import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { CouponType, ReviewStatus } from '@prisma/client';

export class CategoryDto {
  @IsString() @IsNotEmpty() name!: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsUrl({ require_tld: false }) imageUrl?: string;
  @IsOptional() @Type(() => Number) @IsInt() sortOrder?: number;
  @IsOptional() @IsString() parentId?: string;
}

export class UpdateCategoryDto {
  @IsOptional() @IsString() @IsNotEmpty() name?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsUrl({ require_tld: false }) imageUrl?: string;
  @IsOptional() @Type(() => Number) @IsInt() sortOrder?: number;
  @IsOptional() @IsString() parentId?: string;
}

export class UpdateCustomerDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() status?: string;
}

export class CouponDto {
  @IsString() @IsNotEmpty() code!: string;
  @IsEnum(CouponType) type!: CouponType;
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) value!: number;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) minOrder?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) maxUses?: number;
  @IsOptional() @IsDateString() expiresAt?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsString() description?: string;
}

export class UpdateCouponDto {
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsEnum(CouponType) type?: CouponType;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) value?: number;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) minOrder?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) maxUses?: number;
  @IsOptional() @IsDateString() expiresAt?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsString() description?: string;
}

export class CreateReviewDto {
  @IsString() @IsNotEmpty() productId!: string;
  @IsString() @IsNotEmpty() customerName!: string;
  @IsEmail() email!: string;
  @Type(() => Number) @IsInt() @Min(1) @Max(5) rating!: number;
  @IsString() @IsNotEmpty() text!: string;
}

export class UpdateReviewStatusDto {
  @IsEnum(ReviewStatus) status!: ReviewStatus;
}

export class ContentBlockDto {
  @IsString() @IsNotEmpty() key!: string;
  @IsString() @IsNotEmpty() title!: string;
  @IsObject() value!: Record<string, unknown>;
  @IsOptional() @IsBoolean() published?: boolean;
}

export class StoreSettingDto {
  @IsString() @IsNotEmpty() key!: string;
  @IsObject() value!: Record<string, unknown>;
}
