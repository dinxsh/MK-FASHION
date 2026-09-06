import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CategoryDto,
  ContentBlockDto,
  CouponDto,
  CreateReviewDto,
  StoreSettingDto,
  UpdateCouponDto,
  UpdateCategoryDto,
  UpdateCustomerDto,
  UpdateReviewStatusDto,
} from './dto/operations.dto';
import { OperationsService } from './operations.service';

@Controller()
export class OperationsController {
  constructor(private readonly service: OperationsService) {}

  @Get('categories') publicCategories() { return this.service.getPublicCategories(); }
  @Get('content/:key') publicContent(@Param('key') key: string) { return this.service.getPublicContent(key); }
  @Get('products/:productId/reviews') publicReviews(@Param('productId') productId: string) { return this.service.getPublicReviews(productId); }
  @Post('reviews') createReview(@Body() dto: CreateReviewDto) { return this.service.createReview(dto); }
  @Get('coupons/validate') validateCoupon(@Query('code') code: string) { return this.service.validateCoupon(code); }

  @UseGuards(JwtAuthGuard)
  @Get('admin/categories') adminCategories() { return this.service.getAdminCategories(); }
  @UseGuards(JwtAuthGuard)
  @Post('admin/categories') createCategory(@Body() dto: CategoryDto) { return this.service.createCategory(dto); }
  @UseGuards(JwtAuthGuard)
  @Patch('admin/categories/:id') updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) { return this.service.updateCategory(id, dto); }
  @UseGuards(JwtAuthGuard)
  @Delete('admin/categories/:id') deleteCategory(@Param('id') id: string) { return this.service.deleteCategory(id); }

  @UseGuards(JwtAuthGuard)
  @Get('admin/customers') customers() { return this.service.getCustomers(); }
  @UseGuards(JwtAuthGuard)
  @Get('admin/customers/:id') customer(@Param('id') id: string) { return this.service.getCustomer(id); }
  @UseGuards(JwtAuthGuard)
  @Patch('admin/customers/:id') updateCustomer(@Param('id') id: string, @Body() dto: UpdateCustomerDto) { return this.service.updateCustomer(id, dto); }

  @UseGuards(JwtAuthGuard)
  @Get('admin/coupons') coupons() { return this.service.getCoupons(); }
  @UseGuards(JwtAuthGuard)
  @Post('admin/coupons') createCoupon(@Body() dto: CouponDto) { return this.service.createCoupon(dto); }
  @UseGuards(JwtAuthGuard)
  @Patch('admin/coupons/:id') updateCoupon(@Param('id') id: string, @Body() dto: UpdateCouponDto) { return this.service.updateCoupon(id, dto); }
  @UseGuards(JwtAuthGuard)
  @Delete('admin/coupons/:id') deleteCoupon(@Param('id') id: string) { return this.service.deleteCoupon(id); }

  @UseGuards(JwtAuthGuard)
  @Get('admin/reviews') reviews() { return this.service.getReviews(); }
  @UseGuards(JwtAuthGuard)
  @Patch('admin/reviews/:id/status') updateReview(@Param('id') id: string, @Body() dto: UpdateReviewStatusDto) { return this.service.updateReviewStatus(id, dto.status); }
  @UseGuards(JwtAuthGuard)
  @Delete('admin/reviews/:id') deleteReview(@Param('id') id: string) { return this.service.deleteReview(id); }

  @UseGuards(JwtAuthGuard)
  @Get('admin/content') content() { return this.service.getContent(); }
  @UseGuards(JwtAuthGuard)
  @Put('admin/content/:key') upsertContent(@Param('key') key: string, @Body() dto: ContentBlockDto) { return this.service.upsertContent(key, dto); }
  @UseGuards(JwtAuthGuard)
  @Get('admin/settings') settings() { return this.service.getSettings(); }
  @Get('store/whatsapp') whatsapp() { return this.service.getWhatsApp(); }
  @UseGuards(JwtAuthGuard)
  @Put('admin/settings/:key') upsertSetting(@Param('key') key: string, @Body() dto: StoreSettingDto) { return this.service.upsertSetting(key, dto); }
  @UseGuards(JwtAuthGuard)
  @Get('admin/analytics') analytics() { return this.service.getAnalytics(); }
}
