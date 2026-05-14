import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../data/data-store.service';

@Injectable()
export class StorefrontService {
  constructor(private readonly dataStore: DataStoreService) {}

  async listProducts() {
    const data = await this.dataStore.getData();
    return data.products.filter((product) => product.status === 'Active');
  }

  async getProductBySlug(slug: string) {
    const data = await this.dataStore.getData();
    const product = data.products.find((entry) => entry.slug === slug);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async getHomeContent() {
    const data = await this.dataStore.getData();
    return {
      content: data.settings.content,
      featuredProducts: data.products.filter((product) => product.status === 'Active').slice(0, 4),
    };
  }
}
