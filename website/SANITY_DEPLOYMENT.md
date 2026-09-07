# Sanity-only storefront

Deploy `website/apps/frontend` as the Next.js Vercel project. No NestJS API, PostgreSQL database, or JWT secret is required for this storefront.

Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` (normally `production`), and optionally `NEXT_PUBLIC_SANITY_API_VERSION` (defaults to `2026-03-01`). Use a public Sanity dataset for these unauthenticated storefront reads. Do not put a write token in public environment variables.

Add `https://mk-fashion.vercel.app` to Sanity CORS origins with credentials enabled for Studio login. Keep `http://localhost:3000` as a separate origin for local development. Redeploy after changing Vercel variables.

Open `/studio` and sign in with your Sanity account. All `/admin` routes redirect there. Publish categories, products (including slugs, photos, prices and stock), a homepage document, and one Store settings document containing the WhatsApp number with country code.

Products and WhatsApp settings now come from Sanity. Existing PostgreSQL data is not automatically migrated. The previous custom admin order/customer/analytics screens are superseded by Studio; WhatsApp handles order enquiries, and no automatic order tracking is implemented.

The old API source is retained for reference but does not need deployment. Remove `NEXT_PUBLIC_API_BASE_URL` from the frontend Vercel configuration.
