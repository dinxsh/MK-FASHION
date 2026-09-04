import { createClient } from '@sanity/client';
import { apiVersion, dataset, hasSanityConfig, projectId } from '../../sanity/env';

export const sanityClient = hasSanityConfig()
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production',
    })
  : null;

export type HomepageContent = {
  eyebrow: string;
  headline: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  heroImageUrl: string;
};

const fallbackHomepage: HomepageContent = {
  eyebrow: 'THE ROYAL EDIT',
  headline: 'Elegance in Tradition',
  description: 'Discover thoughtfully chosen ethnic wear for every celebration.',
  ctaLabel: 'SHOP COLLECTION',
  ctaHref: '/sarees',
  heroImageUrl: '/images/hero_banner_1773723337466.png',
};

export async function getHomepageContent(): Promise<HomepageContent> {
  if (!sanityClient) return fallbackHomepage;

  try {
    const content = await sanityClient.fetch<Partial<HomepageContent> | null>(
      `*[_type == "homepage"][0]{
        eyebrow,
        headline,
        description,
        ctaLabel,
        ctaHref,
        "heroImageUrl": heroImage.asset->url
      }`,
      {},
      { next: { revalidate: 60 } },
    );
    return { ...fallbackHomepage, ...content };
  } catch (error) {
    console.error('Unable to load Sanity homepage content', error);
    return fallbackHomepage;
  }
}
