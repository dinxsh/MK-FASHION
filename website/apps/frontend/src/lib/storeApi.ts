export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  description: string | null;
  category: { name: string; slug: string } | null;
  images: Array<{ url: string }>;
  inventoryItem: { availableQty: number } | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

export async function getStoreProducts(): Promise<StoreProduct[]> {
  const response = await fetch(`${API_BASE_URL}/products`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Could not load products');
  return response.json();
}

export async function getStoreProduct(slug: string): Promise<StoreProduct> {
  const response = await fetch(`${API_BASE_URL}/products/${slug}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Product not found');
  return response.json();
}

export function matchesCategory(product: StoreProduct, category: string) {
  const value = product.category?.name.toLowerCase() || '';
  const target = category.toLowerCase();
  return value.includes(target) || (target === 'kurtas' && value.includes('kurti'));
}
