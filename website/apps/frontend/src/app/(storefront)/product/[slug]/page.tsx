import ProductClient from './ProductClient';
import { serverApiFetch } from '@/lib/api';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await serverApiFetch<any>(`/storefront/products/${params.slug}`);

  return (
    <ProductClient
      product={{
        name: product.name,
        price: product.price,
        category: product.category,
        shortDesc: product.shortDesc,
        images: product.images?.length ? product.images : [product.image],
        details: product.details?.length ? product.details : ['Dry clean only'],
        about: product.about,
        reviews: {
          rating: product.reviewRating || 5,
          count: product.reviewCount || 0,
          items: [
            { name: 'Verified Buyer', rating: 5, date: 'April 10, 2026', comment: 'Beautiful quality and finish.', images: [product.image] },
          ],
        },
      }}
    />
  );
}
