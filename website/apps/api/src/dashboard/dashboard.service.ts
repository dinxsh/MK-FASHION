import { Injectable } from '@nestjs/common';
import { DataStoreService } from '../data/data-store.service';
import type { DashboardStats, OrderStatus } from '../common/types';

@Injectable()
export class DashboardService {
  constructor(private readonly dataStore: DataStoreService) {}

  async getSummary(): Promise<DashboardStats> {
    const data = await this.dataStore.getData();
    const revenue = data.orders
      .filter((order) => order.paymentStatus === 'Paid')
      .reduce((sum, order) => sum + order.total, 0);

    const orderStatusChart = (['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'] as OrderStatus[]).map(
      (status) => ({
        name: status,
        value: data.orders.filter((order) => order.status === status).length,
      }),
    );

    const revenueByDay = new Map<string, number>();
    const ordersByDay = new Map<string, number>();

    for (const order of data.orders) {
      const key = order.date;
      revenueByDay.set(key, (revenueByDay.get(key) || 0) + order.total);
      ordersByDay.set(key, (ordersByDay.get(key) || 0) + 1);
    }

    const sortedDays = [...ordersByDay.keys()].sort();

    return {
      revenue,
      orders: data.orders.length,
      products: data.products.length,
      customers: data.customers.length,
      revenueChart: sortedDays.map((day) => ({ day, revenue: revenueByDay.get(day) || 0 })),
      ordersChart: sortedDays.map((day) => ({ day, orders: ordersByDay.get(day) || 0 })),
      orderStatusChart,
    };
  }
}
