# MK Fashion Backend Implementation Plan

Last updated: August 30, 2026

## Goal

Turn the existing backend scaffold into a production-ready commerce API that supports the current admin dashboard and storefront without relying on frontend mock data.

## Current Reality

### What exists

- `apps/api`: NestJS bootstrap with global prefix and CORS
- `apps/ml-service`: FastAPI service with `GET /health` and a mocked size recommendation endpoint
- `docker/dev.yml`: local PostgreSQL, Redis, and Elasticsearch containers
- `apps/frontend`: admin and storefront UI already designed

### What does not exist yet

- Database schema and migrations
- Auth and role-based access control
- Product, category, order, customer, review, coupon, content, and settings APIs
- Payment, shipping, inventory, search, and notification integrations
- Real admin data fetching
- Test coverage for backend behavior

## Recommended Architecture

### Primary services

- `apps/api`
  - Main business API
  - Admin auth
  - Catalog, orders, customers, settings, reviews, promotions
  - Search indexing orchestration
  - ML service proxy for recommendations
- `apps/ml-service`
  - Size recommendation
  - Future ranking/personalization endpoints

### Infrastructure choices

- PostgreSQL: source of truth for commerce data
- Redis: caching, rate limits, background job state, sessions if needed
- Elasticsearch: product search, faceting, autocomplete

### Recommended libraries for `apps/api`

- ORM: `@prisma/client` + `prisma`
- Validation: `class-validator` + `class-transformer`
- Auth: `@nestjs/jwt`, `passport`, `passport-jwt`, `bcrypt`
- Config: `@nestjs/config`
- Database access: `@prisma/client`
- HTTP integration: `@nestjs/axios`
- Background jobs: `bullmq` or `@nestjs/bullmq`
- API docs: `@nestjs/swagger`

## Build Order

## Phase 1: Foundation

Objective: make the API capable of storing and serving real data.

### Tasks

- Add shared env/config handling
- Add Prisma and PostgreSQL connection
- Add initial schema and migrations
- Add request validation pipe
- Add structured error handling and logging
- Add health endpoints for API, DB, Redis, Elasticsearch, and ML service

### Deliverables

- `apps/api/src/config/*`
- `apps/api/prisma/schema.prisma`
- `apps/api/src/common/*`
- `GET /api/v1/health`
- `GET /api/v1/health/dependencies`

## Phase 2: Admin Auth

Objective: replace the frontend-only password check.

### Tasks

- Create `admins` table
- Store hashed passwords with `bcrypt`
- Implement login endpoint
- Issue JWT access tokens and refresh tokens
- Add route guards and role checks
- Support roles: `admin`, `manager`, `viewer`
- Add audit log for sign-in and security actions

### Endpoints

- `POST /api/v1/admin/auth/login`
- `POST /api/v1/admin/auth/refresh`
- `POST /api/v1/admin/auth/logout`
- `GET /api/v1/admin/auth/me`
- `POST /api/v1/admin/auth/change-password`

### Frontend changes

- Replace `sessionStorage` auth in `apps/frontend/src/lib/adminAuth.ts`
- Store token securely
- Protect admin routes using server-validated session state

## Phase 3: Catalog

Objective: support products, categories, inventory, and storefront listing pages.

### Data models

- `Category`
- `Product`
- `ProductVariant`
- `ProductImage`
- `InventoryItem`
- `ProductTag`

### Key fields

- Product: `id`, `slug`, `name`, `sku`, `status`, `description`, `shortDescription`, `price`, `compareAtPrice`
- Category: `id`, `name`, `slug`, `parentId`, `sortOrder`, `imageUrl`
- Inventory: `productId`, `availableQty`, `reservedQty`, `lowStockThreshold`

### Endpoints

- `GET /api/v1/admin/products`
- `POST /api/v1/admin/products`
- `GET /api/v1/admin/products/:id`
- `PATCH /api/v1/admin/products/:id`
- `DELETE /api/v1/admin/products/:id`
- `POST /api/v1/admin/products/:id/duplicate`
- `POST /api/v1/admin/products/bulk/archive`
- `POST /api/v1/admin/products/bulk/delete`
- `GET /api/v1/admin/categories`
- `POST /api/v1/admin/categories`
- `PATCH /api/v1/admin/categories/:id`
- `DELETE /api/v1/admin/categories/:id`
- `POST /api/v1/admin/categories/reorder`

### Storefront endpoints

- `GET /api/v1/store/products`
- `GET /api/v1/store/products/:slug`
- `GET /api/v1/store/categories`

## Phase 4: Customers and Orders

Objective: back the admin orders and customers screens with real data.

### Data models

- `Customer`
- `Address`
- `Order`
- `OrderItem`
- `Payment`
- `Shipment`

### Endpoints

- `GET /api/v1/admin/orders`
- `GET /api/v1/admin/orders/:id`
- `PATCH /api/v1/admin/orders/:id/status`
- `POST /api/v1/admin/orders/:id/refund`
- `POST /api/v1/admin/orders/:id/shipment`
- `GET /api/v1/admin/customers`
- `GET /api/v1/admin/customers/:id`
- `PATCH /api/v1/admin/customers/:id`
- `POST /api/v1/store/checkout`
- `POST /api/v1/store/orders`
- `GET /api/v1/store/orders/:id`

### Notes

- Order IDs should be stored as stable internal UUIDs and exposed with a human-friendly display number
- Inventory should be decremented transactionally during order creation

## Phase 5: Reviews, Coupons, Content, and Settings

Objective: complete the rest of the existing admin UI.

### Data models

- `Review`
- `Coupon`
- `ContentBlock`
- `StoreSetting`
- `StaffInvite`

### Endpoints

- `GET /api/v1/admin/reviews`
- `PATCH /api/v1/admin/reviews/:id`
- `GET /api/v1/admin/coupons`
- `POST /api/v1/admin/coupons`
- `PATCH /api/v1/admin/coupons/:id`
- `GET /api/v1/admin/content`
- `PUT /api/v1/admin/content/announcement`
- `PUT /api/v1/admin/content/homepage`
- `GET /api/v1/admin/settings`
- `PUT /api/v1/admin/settings/general`
- `PUT /api/v1/admin/settings/payment`
- `PUT /api/v1/admin/settings/shipping`
- `PUT /api/v1/admin/settings/notifications`
- `GET /api/v1/admin/team`
- `POST /api/v1/admin/team/invite`
- `DELETE /api/v1/admin/team/:id`

## Phase 6: Search, Jobs, Notifications, and ML

Objective: make the platform operational, searchable, and automation-friendly.

### Search

- Index products and categories into Elasticsearch
- Add autocomplete and category faceting
- Reindex job and incremental sync jobs

### Jobs

- Low-stock alerts
- Daily summary emails
- Review moderation notifications
- Search reindex jobs

### ML integration

- Move the size endpoint behind an API client in Nest
- Add retry, timeout, and fallback behavior
- Add request logging and model version metadata

### Endpoints

- `GET /api/v1/store/search`
- `POST /api/v1/admin/search/reindex`
- `POST /api/v1/store/recommend-size`

## Suggested Prisma Schema

This is the minimum useful first pass:

- `AdminUser`
- `AdminSession`
- `Category`
- `Product`
- `ProductImage`
- `InventoryItem`
- `Customer`
- `CustomerAddress`
- `Order`
- `OrderItem`
- `Payment`
- `Shipment`
- `Review`
- `Coupon`
- `ContentBlock`
- `StoreSetting`
- `AuditLog`

## API Module Layout

Recommended Nest module structure:

- `src/modules/auth`
- `src/modules/admin-users`
- `src/modules/products`
- `src/modules/categories`
- `src/modules/orders`
- `src/modules/customers`
- `src/modules/reviews`
- `src/modules/coupons`
- `src/modules/content`
- `src/modules/settings`
- `src/modules/search`
- `src/modules/ml`
- `src/modules/health`
- `src/common`
- `src/prisma`

## Frontend Migration Plan

Replace mock imports page by page instead of attempting a full rewrite at once.

### Priority order

1. Admin login
2. Products list and product detail
3. Orders list and order detail
4. Customers
5. Reviews
6. Promotions
7. Content
8. Settings
9. Analytics dashboard

### Immediate frontend cleanup targets

- `apps/frontend/src/lib/mockData.ts`
- `apps/frontend/src/lib/adminAuth.ts`
- Admin pages under `apps/frontend/src/app/admin/*`

## Security Gaps To Fix First

- Current admin password is exposed to the browser through `NEXT_PUBLIC_ADMIN_PASSWORD`
- Demo bypass login exists in the UI
- No server-side authorization checks exist
- No rate limiting or brute-force protection exists
- No audit logging exists for admin actions

These should be addressed before any public deployment.

## Concrete Sprint Plan

## Sprint 1

- Add Prisma
- Create initial schema
- Wire PostgreSQL into Nest
- Add auth module and admin login
- Seed one admin user

Success criteria:

- Admin can log in through the API
- Protected admin route returns current user
- DB migration and seed commands actually work

## Sprint 2

- Build products and categories modules
- Replace product and category mocks in frontend
- Add inventory tracking

Success criteria:

- Admin products page reads from API
- Product edits persist to DB
- Categories page supports CRUD and ordering

## Sprint 3

- Build customers and orders modules
- Add order status updates and shipment tracking
- Replace order and customer mocks in frontend

Success criteria:

- Orders page is fully API-backed
- Customer summaries are computed from real orders

## Sprint 4

- Build reviews, coupons, content, settings, and team management
- Add notifications and background jobs
- Add ML proxy integration

Success criteria:

- Remaining admin screens stop using local mock state
- Size recommendation works through the main API

## Definition of Done

The backend should be considered done only when all of the following are true:

- No admin screen depends on `mockData.ts`
- No admin auth depends on browser-only password checks
- All core admin CRUD flows persist to PostgreSQL
- Checkout and order creation work end to end
- Search returns indexed catalog data
- ML recommendation endpoint is no longer mocked
- API has tests for critical flows
- Production env variables and deployment docs exist

## Recommended Next Action

Start with Phase 1 plus Phase 2 together:

- install Prisma and Nest support packages
- create the first schema
- implement admin auth
- replace the current frontend demo login

That gives the project a real backend foundation without spreading effort too thin across unfinished modules.
