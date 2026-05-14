import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './common/auth.guard';
import { RolesGuard } from './common/roles.guard';
import { CouponsController } from './coupons/coupons.controller';
import { CouponsService } from './coupons/coupons.service';
import { CustomersController } from './customers/customers.controller';
import { CustomersService } from './customers/customers.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { DataStoreService } from './data/data-store.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { ReviewsController } from './reviews/reviews.controller';
import { ReviewsService } from './reviews/reviews.service';
import { SettingsController } from './settings/settings.controller';
import { SettingsService } from './settings/settings.service';
import { StorefrontController } from './storefront/storefront.controller';
import { StorefrontService } from './storefront/storefront.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [
    AuthController,
    DashboardController,
    ProductsController,
    OrdersController,
    CustomersController,
    ReviewsController,
    CouponsController,
    SettingsController,
    StorefrontController,
  ],
  providers: [
    DataStoreService,
    AuthService,
    AuthGuard,
    RolesGuard,
    DashboardService,
    ProductsService,
    OrdersService,
    CustomersService,
    ReviewsService,
    CouponsService,
    SettingsService,
    StorefrontService,
  ],
})
export class AppModule {}
