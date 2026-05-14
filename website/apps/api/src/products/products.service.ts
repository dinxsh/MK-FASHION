import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataStoreService } from '../data/data-store.service';
import { ProductDto } from '../common/dto';

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

@Injectable()
export class ProductsService {
  constructor(private readonly dataStore: DataStoreService) {}

  async findAll() {
    const data = await this.dataStore.getData();
    return data.products;
  }

  async findOne(id: string) {
    const data = await this.dataStore.getData();
    const product = data.products.find((entry) => entry.id === id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(body: ProductDto) {
    const product = {
      ...body,
      id: randomUUID(),
      slug: slugify(body.name),
      sold: body.sold || 0,
    };

    await this.dataStore.update((draft) => {
      draft.products.unshift(product);
    });

    return product;
  }

  async update(id: string, body: ProductDto) {
    let updated;
    await this.dataStore.update((draft) => {
      const product = draft.products.find((entry) => entry.id === id);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      Object.assign(product, {
        ...body,
        slug: slugify(body.name),
        sold: body.sold ?? product.sold,
      });
      updated = { ...product };
    });

    return updated;
  }

  async remove(id: string) {
    await this.dataStore.update((draft) => {
      const before = draft.products.length;
      draft.products = draft.products.filter((entry) => entry.id !== id);
      if (draft.products.length === before) {
        throw new NotFoundException('Product not found');
      }
    });
    return { success: true };
  }
}
