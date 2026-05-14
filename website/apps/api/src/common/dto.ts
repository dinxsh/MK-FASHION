import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import type { AdminRole, CustomerStatus, OrderStatus, ProductStatus, ReviewStatus } from './types';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(8, 128)
  password!: string;
}

export class ChangePasswordDto {
  @IsString()
  @Length(8, 128)
  currentPassword!: string;

  @IsString()
  @Length(8, 128)
  newPassword!: string;
}

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock!: number;

  @IsEnum(['Active', 'Draft', 'Archived'])
  status!: ProductStatus;

  @IsString()
  @IsNotEmpty()
  image!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  images!: string[];

  @IsString()
  @IsNotEmpty()
  sku!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sold?: number;

  @IsOptional()
  @IsString()
  shortDesc?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  details?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  weight?: string;
}

export class UpdateOrderDto {
  @IsEnum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'])
  status!: OrderStatus;

  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateCustomerDto {
  @IsEnum(['Active', 'Blocked'])
  status!: CustomerStatus;
}

export class UpdateReviewDto {
  @IsEnum(['Approved', 'Pending', 'Rejected'])
  status!: ReviewStatus;
}

export class CouponDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsEnum(['percent', 'fixed'])
  type!: 'percent' | 'fixed';

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  value!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minOrder!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxUses!: number;

  @IsString()
  expiry!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCouponDto {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class InviteStaffDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsEnum(['Admin', 'Manager', 'Viewer'])
  role!: AdminRole;

  @IsOptional()
  @IsString()
  @Length(8, 128)
  password?: string;
}

export class GeneralSettingsDto {
  @IsString()
  storeName!: string;

  @IsEmail()
  storeEmail!: string;

  @IsString()
  storePhone!: string;

  @IsString()
  storeAddress!: string;

  @IsString()
  currency!: string;

  @IsString()
  gst!: string;

  @IsString()
  timezone!: string;
}

export class PaymentSettingsDto {
  @IsBoolean()
  upi!: boolean;

  @IsBoolean()
  cards!: boolean;

  @IsBoolean()
  cod!: boolean;

  @IsBoolean()
  wallets!: boolean;

  @IsBoolean()
  emi!: boolean;
}

export class ShippingSettingsDto {
  @IsString()
  freeShipThreshold!: string;

  @IsString()
  stdDeliveryDays!: string;
}

export class NotificationSettingsDto {
  @IsBoolean()
  newOrder!: boolean;

  @IsBoolean()
  lowStock!: boolean;

  @IsBoolean()
  dailySummary!: boolean;

  @IsBoolean()
  newReview!: boolean;

  @IsBoolean()
  newCustomer!: boolean;
}

export class AppearanceSettingsDto {
  @IsString()
  accentColor!: string;

  @IsString()
  logoUrl!: string;
}

export class ContentSettingsDto {
  @IsString()
  headline!: string;

  @IsString()
  subheadline!: string;

  @IsString()
  ctaText!: string;

  @IsString()
  announcement!: string;

  @IsBoolean()
  showAnnouncement!: boolean;

  @IsArray()
  @IsString({ each: true })
  featuredCollections!: string[];
}

export class UpdateSettingsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => GeneralSettingsDto)
  general?: GeneralSettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentSettingsDto)
  payment?: PaymentSettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingSettingsDto)
  shipping?: ShippingSettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationSettingsDto)
  notifications?: NotificationSettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AppearanceSettingsDto)
  appearance?: AppearanceSettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContentSettingsDto)
  content?: ContentSettingsDto;
}
