import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const productInclude = {
  category: true,
  images: { orderBy: { sortOrder: 'asc' as const } },
  inventoryItem: true,
};

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findPublic() {
    return this.prisma.product.findMany({
      where: { status: ProductStatus.ACTIVE },
      include: productInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublicBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: ProductStatus.ACTIVE },
      include: productInclude,
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  findAll() {
    return this.prisma.product.findMany({
      include: productInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateProductDto) {
    const category = await this.findOrCreateCategory(dto.category);
    const slug = this.toSlug(dto.name);

    return this.prisma.product.create({
      data: {
        name: dto.name.trim(),
        slug: `${slug}-${Date.now()}`,
        sku: `MK-${Date.now()}`,
        shortDescription: dto.description?.trim(),
        description: dto.description?.trim(),
        price: dto.price,
        status: ProductStatus.ACTIVE,
        categoryId: category.id,
        images: { create: { url: dto.imageUrl, altText: dto.name.trim() } },
        inventoryItem: { create: { availableQty: dto.inStock ?? 0 } },
      },
      include: productInclude,
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.ensureExists(id);
    const category = dto.category ? await this.findOrCreateCategory(dto.category) : undefined;

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        shortDescription: dto.description?.trim(),
        description: dto.description?.trim(),
        price: dto.price,
        categoryId: category?.id,
        ...(dto.imageUrl && {
          images: {
            deleteMany: {},
            create: { url: dto.imageUrl, altText: dto.name?.trim() },
          },
        }),
        ...(dto.inStock !== undefined && {
          inventoryItem: {
            upsert: {
              create: { availableQty: dto.inStock },
              update: { availableQty: dto.inStock },
            },
          },
        }),
      },
      include: productInclude,
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }

  private async ensureExists(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  private async findOrCreateCategory(name: string) {
    const cleanName = name.trim();
    const slug = this.toSlug(cleanName);
    return this.prisma.category.upsert({
      where: { slug },
      update: { name: cleanName },
      create: { name: cleanName, slug },
    });
  }

  private toSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'product';
  }
}
