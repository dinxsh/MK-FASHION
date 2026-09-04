import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, ProductStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

const orderInclude = {
  customer: true,
  items: { include: { product: { include: { images: true } } } },
  payment: true,
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.order.findMany({
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: orderInclude });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(dto: CreateOrderDto) {
    if (dto.items.length === 0) {
      throw new BadRequestException('At least one product is required');
    }

    const productIds = [...new Set(dto.items.map((item) => item.productId))];
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, status: ProductStatus.ACTIVE },
      include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products are unavailable');
    }

    const productById = new Map(products.map((product) => [product.id, product]));
    const subtotal = dto.items.reduce((total, item) => {
      const product = productById.get(item.productId)!;
      return total + Number(product.price) * item.quantity;
    }, 0);

    const email = dto.email.toLowerCase().trim();
    return this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { email },
        update: {
          name: dto.customerName.trim(),
          phone: dto.phone.trim(),
          city: dto.city.trim(),
        },
        create: {
          name: dto.customerName.trim(),
          email,
          phone: dto.phone.trim(),
          city: dto.city.trim(),
        },
      });

      await tx.customerAddress.create({
        data: {
          customerId: customer.id,
          line1: dto.address.trim(),
          city: dto.city.trim(),
          state: dto.state.trim(),
          postalCode: dto.postalCode.trim(),
          country: 'India',
          phone: dto.phone.trim(),
        },
      });

      return tx.order.create({
        data: {
          orderNumber: `MK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          customerId: customer.id,
          subtotal,
          grandTotal: subtotal,
          notes: dto.notes?.trim(),
          items: {
            create: dto.items.map((item) => {
              const product = productById.get(item.productId)!;
              return {
                productId: product.id,
                name: product.name,
                unitPrice: product.price,
                quantity: item.quantity,
                imageUrl: product.images[0]?.url,
              };
            }),
          },
          payment: { create: { provider: 'CASH_ON_DELIVERY', amount: subtotal } },
        },
        include: orderInclude,
      });
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    const existing = await this.prisma.order.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: orderInclude,
    });
  }
}
