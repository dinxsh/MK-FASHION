'use client';

import { getStoredToken } from './adminAuth';
import { getApiBaseUrl } from './apiBaseUrl';

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

export type ApiReview = {
  id: string;
  rating: number;
  text: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  customer: { name: string; email: string };
  product: { name: string; slug: string; images: Array<{ url: string }> };
};

export type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  children: ApiCategory[];
  _count: { products: number };
};

export type ApiAnalytics = {
  products: number;
  customers: number;
  orders: number;
  revenue: number;
  revenueChart: Array<{ day: string; revenue: number }>;
  ordersChart: Array<{ day: string; orders: number }>;
  categoryRevenue: Array<{ category: string; revenue: number; orders: number }>;
  topProducts: Array<{ id: string; name: string; soldCount: number; revenue: number; imageUrl: string | null; category: { name: string } | null }>;
};

export type ApiCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  status: 'ACTIVE' | 'BLOCKED';
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string | null;
};

export type ApiCoupon = {
  id: string;
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  minOrder: number;
  uses: number;
  maxUses: number | null;
  expiresAt: string | null;
  isActive: boolean;
  description: string | null;
};

export type CouponInput = {
  code: string;
  type: ApiCoupon['type'];
  value: number;
  minOrder?: number;
  maxUses?: number;
  expiresAt?: string;
  isActive?: boolean;
};

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
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

export function getAdminOrder(id: string) {
  return adminRequest<ApiOrder>(`/admin/orders/${id}`, { cache: 'no-store' });
}

export function updateOrderStatus(id: string, status: ApiOrder['status']) {
  return adminRequest<ApiOrder>(`/admin/orders/${id}/status`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
  });
}

export function getAdminReviews() {
  return adminRequest<ApiReview[]>('/admin/reviews', { cache: 'no-store' });
}

export function updateReviewStatus(id: string, status: ApiReview['status']) {
  return adminRequest<ApiReview>(`/admin/reviews/${id}/status`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
  });
}

export function deleteReview(id: string) {
  return adminRequest<{ message: string }>(`/admin/reviews/${id}`, { method: 'DELETE' });
}

export function getAdminCategories() {
  return adminRequest<ApiCategory[]>('/admin/categories', { cache: 'no-store' });
}

export function deleteCategory(id: string) {
  return adminRequest<{ message: string }>(`/admin/categories/${id}`, { method: 'DELETE' });
}

export function getAdminAnalytics() {
  return adminRequest<ApiAnalytics>('/admin/analytics', { cache: 'no-store' });
}

export function getAdminCustomers() {
  return adminRequest<ApiCustomer[]>('/admin/customers', { cache: 'no-store' });
}

export function updateCustomerStatus(id: string, status: ApiCustomer['status']) {
  return adminRequest<ApiCustomer>(`/admin/customers/${id}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
  });
}

export function getAdminCoupons() {
  return adminRequest<ApiCoupon[]>('/admin/coupons', { cache: 'no-store' });
}

export function createCoupon(coupon: CouponInput) {
  return adminRequest<ApiCoupon>('/admin/coupons', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(coupon),
  });
}

export function updateCoupon(id: string, coupon: Partial<CouponInput>) {
  return adminRequest<ApiCoupon>(`/admin/coupons/${id}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(coupon),
  });
}

export function deleteCoupon(id: string) {
  return adminRequest<{ message: string }>(`/admin/coupons/${id}`, { method: 'DELETE' });
}

export async function uploadProductImage(file: File) {
  const form = new FormData();
  form.append('image', file);
  return adminRequest<{ imageUrl: string }>('/admin/uploads/product-image', { method: 'POST', body: form });
}

export function saveWhatsAppNumber(number: string) {
  return adminRequest('/admin/settings/whatsapp', {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'whatsapp', value: { number } }),
  });
}
