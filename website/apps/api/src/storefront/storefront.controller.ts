import { Controller, Get, Param } from '@nestjs/common';
import { StorefrontService } from './storefront.service';

@Controller('storefront')
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  @Get('home')
  getHome() {
    return this.storefrontService.getHomeContent();
  }

  @Get('products')
  listProducts() {
    return this.storefrontService.listProducts();
  }

  @Get('products/:slug')
  getProduct(@Param('slug') slug: string) {
    return this.storefrontService.getProductBySlug(slug);
  }
}
