export type AdminRole = 'Admin' | 'Manager' | 'Viewer';
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
export type ProductStatus = 'Active' | 'Draft' | 'Archived';
export type CustomerStatus = 'Active' | 'Blocked';
export type ReviewStatus = 'Approved' | 'Pending' | 'Rejected';
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Refunded';

export interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: ProductStatus;
  image: string;
  images: string[];
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

export interface OrderProductRecord {
  name: string;
  qty: number;
  price: number;
  image: string;
}

export interface OrderRecord {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  products: OrderProductRecord[];
  address: string;
  phone: string;
  trackingNumber?: string;
  notes?: string;
  shippingMethod?: string;
}

export interface CustomerRecord {
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

export interface ReviewRecord {
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

export interface CouponRecord {
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

export interface StaffRecord {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar: string;
  lastLogin: string;
  status: 'Active' | 'Invited';
  passwordSalt?: string;
  passwordHash?: string;
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

export interface StoreSettingsRecord {
  general: GeneralSettings;
  payment: PaymentSettings;
  shipping: ShippingSettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  content: ContentSettings;
}

export interface DashboardStats {
  revenue: number;
  orders: number;
  products: number;
  customers: number;
  revenueChart: { day: string; revenue: number }[];
  ordersChart: { day: string; orders: number }[];
  orderStatusChart: { name: OrderStatus; value: number }[];
}

export interface StoreData {
  staff: StaffRecord[];
  products: ProductRecord[];
  orders: OrderRecord[];
  customers: CustomerRecord[];
  reviews: ReviewRecord[];
  coupons: CouponRecord[];
  settings: StoreSettingsRecord;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatar: string;
  status: 'Active' | 'Invited';
}
