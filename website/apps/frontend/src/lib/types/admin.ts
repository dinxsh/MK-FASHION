export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
export type ProductStatus = 'Active' | 'Draft' | 'Archived';
export type CustomerStatus = 'Active' | 'Blocked';
export type ReviewStatus = 'Approved' | 'Pending' | 'Rejected';

export interface Product {
  id: string;
  slug?: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: ProductStatus;
  image: string;
  images?: string[];
  sku: string;
  sold: number;
  shortDesc?: string;
  about?: string;
  details?: string[];
  tags?: string[];
  weight?: string;
  reviewRating?: number;
  reviewCount?: number;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
  status: OrderStatus;
  products: { name: string; qty: number; price: number; image: string }[];
  address: string;
  phone: string;
  trackingNumber?: string;
  notes?: string;
  shippingMethod?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joined: string;
  status: CustomerStatus;
  avatar: string;
  city?: string;
  lastOrder?: string;
}

export interface Review {
  id: string;
  productName: string;
  productImage: string;
  customer: string;
  rating: number;
  text: string;
  date: string;
  status: ReviewStatus;
  helpful?: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrder: number;
  uses: number;
  maxUses: number;
  expiry: string;
  active: boolean;
  description?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Viewer';
  avatar: string;
  lastLogin: string;
  status: 'Active' | 'Invited';
}

export interface GeneralSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  gst: string;
  timezone: string;
}

export interface PaymentSettings {
  upi: boolean;
  cards: boolean;
  cod: boolean;
  wallets: boolean;
  emi: boolean;
}

export interface ShippingSettings {
  freeShipThreshold: string;
  stdDeliveryDays: string;
}

export interface NotificationSettings {
  newOrder: boolean;
  lowStock: boolean;
  dailySummary: boolean;
  newReview: boolean;
  newCustomer: boolean;
}

export interface AppearanceSettings {
  accentColor: string;
  logoUrl: string;
}

export interface ContentSettings {
  headline: string;
  subheadline: string;
  ctaText: string;
  announcement: string;
  showAnnouncement: boolean;
  featuredCollections: string[];
}

export interface SettingsPayload {
  general: GeneralSettings;
  payment: PaymentSettings;
  shipping: ShippingSettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  content: ContentSettings;
  team: StaffMember[];
}

export interface StatData {
  revenue: number;
  orders: number;
  products: number;
  customers: number;
  revenueChart: { day: string; revenue: number }[];
  ordersChart: { day: string; orders: number }[];
  orderStatusChart: { name: OrderStatus; value: number }[];
}
