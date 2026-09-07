import { sanityClient } from './sanity';

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

const projection = `{
  "id": _id, "slug": slug.current, name, price, description,
  category->{name, "slug": slug.current},
  "images": coalesce(images[]{"url": asset->url}, []),
  "inventoryItem": {"availableQty": coalesce(stock, 0)}
}`;

export async function getStoreProducts(): Promise<StoreProduct[]> {
  if (!sanityClient) throw new Error('Sanity project is not configured');
  return sanityClient.fetch<StoreProduct[]>(
    `*[_type == "product" && !(_id in path("drafts.**")) && active != false && defined(slug.current)] | order(_createdAt desc) ${projection}`,
    {}, { cache: 'no-store' },
  );
}

export async function getStoreProduct(slug: string): Promise<StoreProduct> {
  if (!sanityClient) throw new Error('Sanity project is not configured');
  const product = await sanityClient.fetch<StoreProduct | null>(
    `*[_type == "product" && !(_id in path("drafts.**")) && active != false && slug.current == $slug][0] ${projection}`,
    { slug }, { cache: 'no-store' },
  );
  if (!product) throw new Error('Product not found');
  return product;
}

export function matchesCategory(product: StoreProduct, category: string) {
  const value = product.category?.name.toLowerCase() || '';
  const target = category.toLowerCase();
  return value.includes(target) || (target === 'kurtas' && value.includes('kurti'));
}
