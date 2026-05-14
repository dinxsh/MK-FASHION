import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../data/data-store.service';
import { UpdateCustomerDto } from '../common/dto';

@Injectable()
export class CustomersService {
  constructor(private readonly dataStore: DataStoreService) {}

  async findAll() {
    const data = await this.dataStore.getData();
    return data.customers;
  }

  async update(id: string, body: UpdateCustomerDto) {
    let updated;
    await this.dataStore.update((draft) => {
      const customer = draft.customers.find((entry) => entry.id === id);
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
      customer.status = body.status;
      updated = { ...customer };
    });
    return updated;
  }

  async remove(id: string) {
    await this.dataStore.update((draft) => {
      const before = draft.customers.length;
      draft.customers = draft.customers.filter((entry) => entry.id !== id);
      if (draft.customers.length === before) {
        throw new NotFoundException('Customer not found');
      }
    });
    return { success: true };
  }
}
