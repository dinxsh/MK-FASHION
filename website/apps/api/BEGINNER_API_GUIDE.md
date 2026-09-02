# MK Fashion API: Beginner Guide

Run the API:

```powershell
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run db:seed
npm run dev
```

The API runs at `http://localhost:4000/api/v1`.

## Admin login

`POST /admin/auth/login`

```json
{
  "email": "admin@mkfashion.in",
  "password": "mkfashion2026"
}
```

Copy `accessToken` from the response. Send it with each admin request as:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Create a product

`POST /admin/products`

```json
{
  "name": "Blue Cotton Kurti",
  "price": 1299,
  "category": "Kurtis",
  "imageUrl": "https://example.com/blue-kurti.jpg",
  "description": "Comfortable everyday kurti",
  "inStock": 10
}
```

## List products

`GET /products` is public and returns active products for the storefront.

`GET /admin/products` returns every product for the admin panel.

## Place a cash-on-delivery order

`POST /orders`

```json
{
  "customerName": "Asha Sharma",
  "email": "asha@example.com",
  "phone": "9876543210",
  "address": "12 Market Road",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "items": [
    { "productId": "PRODUCT_ID", "quantity": 1 }
  ]
}
```

## Manage orders

`GET /admin/orders` lists submitted orders.

`PATCH /admin/orders/ORDER_ID/status`

```json
{ "status": "PROCESSING" }
```

Valid statuses are `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, and `REFUNDED`.
