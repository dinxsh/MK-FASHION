import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ReviewStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CategoryDto,
  ContentBlockDto,
  CouponDto,
  CreateReviewDto,
  StoreSettingDto,
  UpdateCategoryDto,
  UpdateCouponDto,
  UpdateCustomerDto,
} from './dto/operations.dto';

@Injectable()
export class OperationsService {
  constructor(private readonly prisma: PrismaService) {}

  getPublicCategories() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: { include: { _count: { select: { products: true } } }, orderBy: { sortOrder: 'asc' } },
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  getAdminCategories() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: { include: { _count: { select: { products: true } } }, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] },
        _count: { select: { products: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async createCategory(dto: CategoryDto) {
    const slug = this.slug(dto.slug || dto.name);
    const exists = await this.prisma.category.findUnique({ where: { slug } });
    if (exists) throw new ConflictException('A category with this name already exists');
    return this.prisma.category.create({ data: { name: dto.name.trim(), slug, imageUrl: dto.imageUrl, sortOrder: dto.sortOrder ?? 0, parentId: dto.parentId } });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    await this.categoryOrThrow(id);
    const slug = dto.slug || dto.name ? this.slug(dto.slug || dto.name) : undefined;
    if (slug) {
      const duplicate = await this.prisma.category.findFirst({ where: { slug, NOT: { id } } });
      if (duplicate) throw new ConflictException('A category with this name already exists');
    }
    return this.prisma.category.update({ where: { id }, data: { name: dto.name?.trim(), slug, imageUrl: dto.imageUrl, sortOrder: dto.sortOrder, parentId: dto.parentId } });
  }

  async deleteCategory(id: string) {
    const category = await this.categoryOrThrow(id);
    const [childCount, productCount] = await Promise.all([
      this.prisma.category.count({ where: { parentId: id } }),
      this.prisma.product.count({ where: { categoryId: id } }),
    ]);
    if (childCount > 0) throw new BadRequestException('Delete child categories first');
    if (productCount > 0) throw new BadRequestException('Move or delete products in this category first');
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }

  async getCustomers() {
    const customers = await this.prisma.customer.findMany({
      include: {
        _count: { select: { orders: true } },
        orders: {
          select: { id: true, grandTotal: true, status: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return customers.map(({ orders, _count, ...customer }) => {
      const completedOrders = orders.filter((order) => !['CANCELLED', 'REFUNDED'].includes(order.status));
      const totalSpent = completedOrders.reduce((sum, order) => sum + Number(order.grandTotal), 0);
      return {
        ...customer,
        totalOrders: _count.orders,
        totalSpent,
        lastOrderAt: orders[0]?.createdAt ?? null,
      };
    });
  }

  async getCustomer(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: { include: { items: true }, orderBy: { createdAt: 'desc' } },
        reviews: { include: { product: { select: { name: true, slug: true } } }, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    const totalSpent = customer.orders
      .filter((order) => !['CANCELLED', 'REFUNDED'].includes(order.status))
      .reduce((sum, order) => sum + Number(order.grandTotal), 0);
    return { ...customer, totalSpent, totalOrders: customer.orders.length };
  }
  async updateCustomer(id: string, dto: UpdateCustomerDto) { await this.getCustomer(id); return this.prisma.customer.update({ where: { id }, data: { name: dto.name?.trim(), phone: dto.phone?.trim(), city: dto.city?.trim(), status: dto.status } }); }

  getCoupons() { return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } }); }
  async createCoupon(dto: CouponDto) {
    const code = dto.code.trim().toUpperCase();
    const exists = await this.prisma.coupon.findUnique({ where: { code } });
    if (exists) throw new ConflictException('Coupon code already exists');
    return this.prisma.coupon.create({ data: { code, type: dto.type, value: dto.value, minOrder: dto.minOrder ?? 0, maxUses: dto.maxUses, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, isActive: dto.isActive ?? true, description: dto.description?.trim() } });
  }
  async updateCoupon(id: string, dto: UpdateCouponDto) {
    await this.couponOrThrow(id);
    const code = dto.code?.trim().toUpperCase();
    if (code) { const duplicate = await this.prisma.coupon.findFirst({ where: { code, NOT: { id } } }); if (duplicate) throw new ConflictException('Coupon code already exists'); }
    return this.prisma.coupon.update({ where: { id }, data: { code, type: dto.type, value: dto.value, minOrder: dto.minOrder, maxUses: dto.maxUses, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, isActive: dto.isActive, description: dto.description?.trim() } });
  }
  async deleteCoupon(id: string) { await this.couponOrThrow(id); await this.prisma.coupon.delete({ where: { id } }); return { message: 'Coupon deleted successfully' }; }
  async validateCoupon(code: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code: code?.trim().toUpperCase() || '' } });
    if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date()) || (coupon.maxUses && coupon.uses >= coupon.maxUses)) throw new NotFoundException('Coupon is not available');
    return coupon;
  }

  getPublicReviews(productId: string) { return this.prisma.review.findMany({ where: { productId, status: ReviewStatus.APPROVED }, include: { customer: { select: { name: true } } }, orderBy: { createdAt: 'desc' } }); }
  getReviews() {
    return this.prisma.review.findMany({
      include: {
        customer: { select: { name: true, email: true } },
        product: { select: { name: true, slug: true, images: { select: { url: true }, orderBy: { sortOrder: 'asc' }, take: 1 } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  async createReview(dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');
    const customer = await this.prisma.customer.upsert({ where: { email: dto.email.toLowerCase().trim() }, update: { name: dto.customerName.trim() }, create: { name: dto.customerName.trim(), email: dto.email.toLowerCase().trim() } });
    return this.prisma.review.create({ data: { productId: product.id, customerId: customer.id, rating: dto.rating, text: dto.text.trim() } });
  }
  async updateReviewStatus(id: string, status: ReviewStatus) { const review = await this.prisma.review.findUnique({ where: { id } }); if (!review) throw new NotFoundException('Review not found'); return this.prisma.review.update({ where: { id }, data: { status } }); }
  async deleteReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    await this.prisma.review.delete({ where: { id } });
    return { message: 'Review deleted successfully' };
  }

  async getPublicContent(key: string) { const block = await this.prisma.contentBlock.findFirst({ where: { key, publishedAt: { not: null } } }); if (!block) throw new NotFoundException('Content not found'); return block; }
  getContent() { return this.prisma.contentBlock.findMany({ orderBy: { key: 'asc' } }); }
  upsertContent(key: string, dto: ContentBlockDto) { if (dto.key !== key) throw new BadRequestException('Content key cannot be changed'); return this.prisma.contentBlock.upsert({ where: { key }, create: { key, title: dto.title.trim(), value: dto.value as Prisma.InputJsonValue, publishedAt: dto.published ? new Date() : null }, update: { title: dto.title.trim(), value: dto.value as Prisma.InputJsonValue, ...(dto.published !== undefined && { publishedAt: dto.published ? new Date() : null }) } }); }
  getSettings() { return this.prisma.storeSetting.findMany({ orderBy: { key: 'asc' } }); }
  async getWhatsApp() {
    const setting = await this.prisma.storeSetting.findUnique({ where: { key: 'whatsapp' } });
    const value = setting?.value as { number?: string } | undefined;
    return { number: value?.number ?? null };
  }
  upsertSetting(key: string, dto: StoreSettingDto) { if (key === 'whatsapp' && (typeof dto.value.number !== 'string' || (dto.value.number !== '' && !/^[1-9]\d{7,14}$/.test(dto.value.number)))) throw new BadRequestException('Enter a WhatsApp number with 8–15 digits including country code'); if (dto.key !== key) throw new BadRequestException('Setting key cannot be changed'); return this.prisma.storeSetting.upsert({ where: { key }, create: { key, value: dto.value as Prisma.InputJsonValue }, update: { value: dto.value as Prisma.InputJsonValue } }); }

  async getAnalytics() {
    const [products, customers, orders, categoryStats, topProducts] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.customer.count(),
      this.prisma.order.findMany({
        select: { grandTotal: true, status: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.category.findMany({
        where: { parentId: null },
        select: {
          id: true,
          name: true,
          products: { select: { price: true, soldCount: true } },
          children: { select: { products: { select: { price: true, soldCount: true } } } },
        },
      }),
      this.prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          soldCount: true,
          category: { select: { name: true } },
          images: { select: { url: true }, orderBy: { sortOrder: 'asc' }, take: 1 },
        },
        orderBy: [{ soldCount: 'desc' }, { createdAt: 'desc' }],
        take: 10,
      }),
    ]);

    const validOrders = orders.filter((order) => !['CANCELLED', 'REFUNDED'].includes(order.status));
    const revenue = validOrders.reduce((total, order) => total + Number(order.grandTotal), 0);
    const orderStatus = Object.entries(
      orders.reduce<Record<string, number>>((groups, order) => {
        groups[order.status] = (groups[order.status] || 0) + 1;
        return groups;
      }, {}),
    ).map(([status, count]) => ({ status, count }));

    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(today.getDate() - (29 - index));
      const key = date.toISOString().slice(0, 10);
      return { key, day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), revenue: 0 };
    });
    const last14Days = Array.from({ length: 14 }, (_, index) => {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(today.getDate() - (13 - index));
      const key = date.toISOString().slice(0, 10);
      return { key, day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), orders: 0 };
    });

    const revenueByDay = new Map(last30Days.map((entry) => [entry.key, entry]));
    const ordersByDay = new Map(last14Days.map((entry) => [entry.key, entry]));
    for (const order of validOrders) {
      const key = new Date(order.createdAt).toISOString().slice(0, 10);
      const revenueEntry = revenueByDay.get(key);
      if (revenueEntry) revenueEntry.revenue += Number(order.grandTotal);
      const ordersEntry = ordersByDay.get(key);
      if (ordersEntry) ordersEntry.orders += 1;
    }

    const categoryRevenue = categoryStats.map((category) => {
      const allProducts = [...category.products, ...category.children.flatMap((child) => child.products)];
      const categoryRevenueValue = allProducts.reduce((sum, product) => sum + Number(product.price) * product.soldCount, 0);
      const orderCount = allProducts.reduce((sum, product) => sum + product.soldCount, 0);
      return { category: category.name, revenue: categoryRevenueValue, orders: orderCount };
    });

    return {
      products,
      customers,
      orders: orders.length,
      revenue,
      orderStatus,
      revenueChart: last30Days.map(({ key, ...entry }) => entry),
      ordersChart: last14Days.map(({ key, ...entry }) => entry),
      categoryRevenue,
      topProducts: topProducts.map((product) => ({
        ...product,
        revenue: Number(product.price) * product.soldCount,
        imageUrl: product.images[0]?.url ?? null,
      })),
      recentOrders: orders.slice(-10).reverse(),
    };
  }

  private async categoryOrThrow(id: string) { const category = await this.prisma.category.findUnique({ where: { id } }); if (!category) throw new NotFoundException('Category not found'); return category; }
  private async couponOrThrow(id: string) { const coupon = await this.prisma.coupon.findUnique({ where: { id } }); if (!coupon) throw new NotFoundException('Coupon not found'); return coupon; }
  private slug(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'category'; }
}
