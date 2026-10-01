import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';
import { hasSanityConfig } from '../../../../sanity/env';
import { getCmsConnectionStatus } from '@/lib/sanityConnection';

export const dynamic = 'force-dynamic';

export default async function StudioPage() {
  if (!hasSanityConfig()) {
    return (
      <main style={{ fontFamily: 'sans-serif', margin: '0 auto', maxWidth: 720, padding: '80px 24px' }}>
        <p style={{ color: '#7c2d12', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          MK Fashion CMS
        </p>
        <h1 style={{ fontSize: 36, marginBottom: 16 }}>Sanity project setup is needed</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6 }}>
          Add your Sanity project ID and dataset to <code>website/apps/frontend/.env.local</code>, then restart the frontend server.
        </p>
        <pre style={{ background: '#1c1917', borderRadius: 10, color: '#f5f5f4', overflowX: 'auto', padding: 20 }}>
{`NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-03-01
SANITY_API_READ_TOKEN=your-read-token`}
        </pre>
        <p style={{ lineHeight: 1.6 }}>
          Find the project ID in Sanity Manage under your project settings. The token alone cannot identify its project.
        </p>
      </main>
    );
  }

  const status = await getCmsConnectionStatus();
  console.info(status.message);

  return (
    <>
      <div
        style={{
          background: status.success ? '#064e3b' : '#7f1d1d',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.03em',
          padding: '10px 16px',
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
      >
        {status.message}
      </div>
      <NextStudio config={config} />
    </>
  );
}
