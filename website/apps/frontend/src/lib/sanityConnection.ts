import 'server-only';

import { createClient } from '@sanity/client';
import { apiVersion, dataset, hasSanityConfig, projectId } from '../../sanity/env';

export type CmsConnectionStatus = {
  success: boolean;
  message: string;
};

export async function getCmsConnectionStatus(): Promise<CmsConnectionStatus> {
  if (!hasSanityConfig()) {
    return {
      success: false,
      message:
        'Sanity CMS is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.',
    };
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN || undefined,
  });

  try {
    await client.fetch(
      'count(*[_type in ["homepage", "category", "product", "storeSettings"]])',
      {},
      { cache: 'no-store' },
    );
    return { success: true, message: 'Sanity CMS connection successful.' };
  } catch (error) {
    console.error('Sanity CMS connection failed', error);
    return {
      success: false,
      message:
        'Sanity CMS connection failed. Verify project ID, dataset, token permissions (if dataset is private), and CORS origins.',
    };
  }
}
