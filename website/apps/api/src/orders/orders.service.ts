import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../data/data-store.service';
import { UpdateOrderDto } from '../common/dto';

@Injectable()
export class OrdersService {
  constructor(private readonly dataStore: DataStoreService) {}

  async findAll() {
    const data = await this.dataStore.getData();
    return data.orders;
  }

  async findOne(id: string) {
    const data = await this.dataStore.getData();
    const order = data.orders.find((entry) => entry.id === id || entry.id === `#${id}`);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async update(id: string, body: UpdateOrderDto) {
    let updated;
    await this.dataStore.update((draft) => {
      const order = draft.orders.find((entry) => entry.id === id || entry.id === `#${id}`);
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      Object.assign(order, body);
      updated = { ...order };
    });

    return updated;
  }
}
