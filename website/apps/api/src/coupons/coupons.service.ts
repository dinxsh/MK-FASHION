import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataStoreService } from '../data/data-store.service';
import { CouponDto, UpdateCouponDto } from '../common/dto';

@Injectable()
export class CouponsService {
  constructor(private readonly dataStore: DataStoreService) {}

  async findAll() {
    const data = await this.dataStore.getData();
    return data.coupons;
  }

  async create(body: CouponDto) {
    const coupon = {
      id: randomUUID(),
      code: body.code.toUpperCase(),
      type: body.type,
      value: body.value,
      minOrder: body.minOrder,
      uses: 0,
      maxUses: body.maxUses,
      expiry: body.expiry,
      active: true,
      description: body.description,
    };

    await this.dataStore.update((draft) => {
      draft.coupons.unshift(coupon);
    });

    return coupon;
  }

  async update(id: string, body: UpdateCouponDto) {
    let updated;
    await this.dataStore.update((draft) => {
      const coupon = draft.coupons.find((entry) => entry.id === id);
      if (!coupon) {
        throw new NotFoundException('Coupon not found');
      }
      Object.assign(coupon, body);
      updated = { ...coupon };
    });
    return updated;
  }

  async remove(id: string) {
    await this.dataStore.update((draft) => {
      const before = draft.coupons.length;
      draft.coupons = draft.coupons.filter((entry) => entry.id !== id);
      if (draft.coupons.length === before) {
        throw new NotFoundException('Coupon not found');
      }
    });
    return { success: true };
  }
}
