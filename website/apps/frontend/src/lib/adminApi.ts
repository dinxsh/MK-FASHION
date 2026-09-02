'use client';

import { getStoredToken } from './adminAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

export type ApiProduct = {
  id: string;
  name: string;
  sku: string;
  price: number;
  description: string | null;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  category: { name: string } | null;
  images: Array<{ url: string }>;
  inventoryItem: { availableQty: number } | null;
};

export type ProductInput = {
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description?: string;
  inStock: number;
};

export type ApiOrder = {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus: 'PAID' | 'UNPAID' | 'REFUNDED';
  grandTotal: number;
  createdAt: string;
  customer: { name: string; email: string; phone: string | null };
  items: Array<{ id: string; name: string; quantity: number; unitPrice: number; imageUrl: string | null }>;
};

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || 'Something went wrong');
  return data as T;
}

export function getAdminProducts() {
  return adminRequest<ApiProduct[]>('/admin/products', { cache: 'no-store' });
}

export function createProduct(product: ProductInput) {
  return adminRequest<ApiProduct>('/admin/products', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product),
  });
}

export function updateProduct(id: string, product: Partial<ProductInput>) {
  return adminRequest<ApiProduct>(`/admin/products/${id}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product),
  });
}

export function deleteProduct(id: string) {
  return adminRequest<{ message: string }>(`/admin/products/${id}`, { method: 'DELETE' });
}

export function getAdminOrders() {
  return adminRequest<ApiOrder[]>('/admin/orders', { cache: 'no-store' });
}

export function updateOrderStatus(id: string, status: ApiOrder['status']) {
  return adminRequest<ApiOrder>(`/admin/orders/${id}/status`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
  });
}

export async function uploadProductImage(file: File) {
  const form = new FormData();
  form.append('image', file);
  return adminRequest<{ imageUrl: string }>('/admin/uploads/product-image', { method: 'POST', body: form });
}
