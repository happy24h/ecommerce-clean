# CLAUDE.md — Backend API Reference

This is a **NestJS multi-website backend** (MongoDB + JWT) designed to power multiple frontend sites via a single API. Read this file to understand how to call the API correctly.

---

## Base URL & Versioning

```
Base URL: http://localhost:8081
API Prefix: /api/v1   (or /api/v2 — both are active, identical behavior)
Swagger UI: http://localhost:8081/swagger
```

All API calls must include `/api/v1/` prefix.

---

## Standard Response Format

Every response (success & error) is wrapped:

```json
// Success
{
  "statusCode": 200,
  "message": "Fetch list post with paginate",
  "data": { ... }
}

// Error
{
  "statusCode": 400,
  "message": "error detail",
  "error": "Bad Request"
}
```

Always read `data` field for actual payload.

---

## Authentication

### How auth works

- **Login** → get `access_token` (JWT, 10 days) + `refresh_token` (cookie, 1 day)
- **Protected requests** → `Authorization: Bearer <access_token>` header
- **Token refresh** → call `/auth/refresh` (sends cookie automatically)
- **Logout** → clears refresh token cookie

### Headers for protected routes

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Auth Flow

```
POST /api/v1/auth/register   → create account
POST /api/v1/auth/login      → get tokens
GET  /api/v1/auth/account    → get current user info + permissions
GET  /api/v1/auth/refresh    → refresh access token (uses cookie)
POST /api/v1/auth/logout     → logout
```

#### POST /api/v1/auth/login
```json
// Request
{ "username": "user@email.com", "password": "password123" }

// Response data
{
  "access_token": "eyJ...",
  "user": {
    "_id": "...",
    "name": "John",
    "email": "user@email.com",
    "role": { "_id": "...", "name": "USER" },
    "permissions": [{ "method": "GET", "apiPath": "/api/v1/posts", "module": "posts" }],
    "avatar": "https://..."
  }
}
```

#### POST /api/v1/auth/register
```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 25,
  "gender": "male",
  "address": "Hanoi"
}
```

#### GET /api/v1/auth/account
Returns logged-in user info. Requires `Authorization` header.

#### GET /api/v1/auth/refresh
No body needed. Browser must send `refresh_token` cookie (set automatically on login).
Returns new `access_token`.

---

## Pagination & Filtering (all list endpoints)

Every list endpoint uses query params:

```
GET /api/v1/posts?current=1&pageSize=10&qs=title=Hello
```

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `current` | number | 1 | Page number |
| `pageSize` | number | 10 | Items per page |
| `qs` | string | — | Filter query string (URL encoded) |

**Paginated response structure:**
```json
{
  "data": {
    "meta": {
      "current": 1,
      "pageSize": 10,
      "pages": 5,
      "total": 47
    },
    "result": [ ... ]
  }
}
```

**Filter examples:**
```
?qs=title=Hello World              → exact match
?qs=websiteId=my-blog             → filter by website
?qs=categoryId=64abc123           → filter by category
?current=2&pageSize=5             → page 2, 5 items
```

---

## Multi-website Support (websiteId)

This backend serves **multiple websites**. Resources (posts, products, categories) are scoped by `websiteId`.

- Always send `websiteId` when creating resources
- Filter lists by `?qs=websiteId=<your-site-slug>` to get site-specific data
- Websites are registered via `POST /api/v1/websites`
- Default websiteId values in code: `'prostore'`, `'my-blog'`

---

## Public vs Protected Endpoints

**Public (no auth needed):**
- `GET /api/v1/posts` and `GET /api/v1/posts/:id`
- `GET /api/v1/category` and `GET /api/v1/category/:id`
- `GET /api/v1/product` and `GET /api/v1/product/:id`
- `GET /api/v1/podcast` and `GET /api/v1/podcast/:id`
- `GET /api/v1/comments`
- `GET /api/v1/websites` and `GET /api/v1/websites/:id`
- `GET /api/v1/users/:id`
- `GET /api/v1/health`
- `POST /api/v1/auth/login`, `POST /api/v1/auth/register`
- `GET /api/v1/auth/refresh`
- `POST /api/v1/files/upload`
- `POST /api/v1/payment/webhook`

**Protected (requires `Authorization: Bearer <token>`):**
- All POST/PATCH/DELETE endpoints
- Cart, Order, Payment operations
- Dashboard, Roles, Permissions management

---

## Endpoint Reference

### Posts

```
POST   /api/v1/posts              Create post (JWT)
GET    /api/v1/posts              List posts (public)
GET    /api/v1/posts/:id          Get post (public)
PATCH  /api/v1/posts/:id          Update post (JWT)
DELETE /api/v1/posts/:id          Delete post (JWT)
PUT    /api/v1/posts/:id          Like/unlike post (JWT)
```

**Create/Update body:**
```json
{
  "title": "My Post",
  "description": "Content here...",
  "image": "https://cloudinary.com/...",
  "categoryId": "64abc123...",
  "websiteId": "my-blog"
}
```

**Post object:**
```json
{
  "_id": "...",
  "title": "My Post",
  "description": "...",
  "image": "...",
  "categoryId": "...",
  "websiteId": "my-blog",
  "likes": ["userId1", "userId2"],
  "createdBy": { "_id": "...", "email": "...", "name": "...", "avatar": "..." },
  "createdAt": "2024-01-15T...",
  "updatedAt": "2024-01-15T..."
}
```

---

### Categories

```
POST   /api/v1/category           Create category (JWT)
GET    /api/v1/category           List categories (public)
GET    /api/v1/category/:id       Get category (public)
PATCH  /api/v1/category/:id       Update (JWT)
DELETE /api/v1/category/:id       Delete (JWT)
```

**Create body:**
```json
{
  "name": "Technology",
  "description": "Tech articles",
  "image": "https://...",
  "type": "POST",
  "websiteId": "my-blog"
}
```

`type` must be `"PRODUCT"` or `"POST"`.

---

### Products

```
POST   /api/v1/product            Create digital product (JWT)
POST   /api/v1/product/physical   Create physical product (JWT)
GET    /api/v1/product            List products (public)
GET    /api/v1/product/:id        Get product (public)
PATCH  /api/v1/product/:id        Update (JWT)
DELETE /api/v1/product/:id        Delete (JWT)
```

**Digital product body:**
```json
{
  "title": "React Course",
  "description": "Learn React",
  "price": 299000,
  "images": ["https://..."],
  "slug": "react-course",
  "sourceFileUrl": "https://...",
  "demoUrl": "https://...",
  "videoUrl": "https://...",
  "version": "1.0",
  "techStack": ["React", "TypeScript"],
  "websiteId": "my-blog",
  "categoryId": "64abc123",
  "isActive": true
}
```

**Physical product body:**
```json
{
  "title": "T-Shirt",
  "description": "Cool shirt",
  "price": 150000,
  "images": ["https://..."],
  "stock": 100,
  "websiteId": "prostore",
  "categoryId": "64abc123",
  "metadata": { "size": "M", "color": "blue" },
  "isActive": true
}
```

---

### Cart

Requires JWT. Cart is per-user (one cart per account).

```
GET    /api/v1/cart               Get my cart (JWT)
POST   /api/v1/cart/add           Add item to cart (JWT)
DELETE /api/v1/cart/remove/:productId  Remove item (JWT)
```

**Add to cart body:**
```json
{
  "productId": "64abc123...",
  "quantity": 2
}
```

**Cart object:**
```json
{
  "_id": "...",
  "userId": "...",
  "items": [
    {
      "productId": { "_id": "...", "title": "...", "price": 299000 },
      "quantity": 2,
      "addedAt": "2024-01-15T..."
    }
  ]
}
```

---

### Orders

```
POST   /api/v1/order/checkout     Create order from cart (JWT)
GET    /api/v1/order/:id          Get order details (JWT)
```

**Checkout body:**
```json
{
  "paymentMethod": "payos",
  "note": "Please ship fast"
}
```

**Order statuses:** `PENDING` → `PAID` → `CANCELLED`

**Order object:**
```json
{
  "_id": "...",
  "userId": "...",
  "items": [
    { "productId": "...", "title": "React Course", "price": 299000, "quantity": 1 }
  ],
  "totalAmount": 299000,
  "status": "PENDING",
  "paymentMethod": "payos",
  "note": "..."
}
```

---

### Payment (PayOS - Vietnam)

```
POST   /api/v1/payment/create-link/:orderId   Create payment QR (JWT)
POST   /api/v1/payment/webhook               PayOS webhook (public)
```

**Payment flow:**
1. Create order → `POST /order/checkout` → get `orderId`
2. Create payment link → `POST /payment/create-link/:orderId`
3. Get QR link from response → redirect user to PayOS
4. PayOS calls webhook when paid → order status updated to `PAID`

---

### Comments

```
POST   /api/v1/comments           Create comment (JWT)
GET    /api/v1/comments           List comments (public)
GET    /api/v1/comments/:id       Get comment (JWT)
PATCH  /api/v1/comments/:id       Update (JWT)
DELETE /api/v1/comments/:id       Delete (JWT)
```

**Create body:**
```json
{
  "content": "Great post!",
  "relatedPost": "64abc123..."
}
```

---

### Podcasts

```
POST   /api/v1/podcast            Create (JWT)
GET    /api/v1/podcast            List (public)
GET    /api/v1/podcast/:id        Get (public)
PATCH  /api/v1/podcast/:id        Update (JWT)
DELETE /api/v1/podcast/:id        Delete (JWT)
```

**Create body:**
```json
{
  "name": "Episode 1",
  "urlPodcast": "https://...",
  "image": "https://..."
}
```

---

### File Upload

```
POST   /api/v1/files/upload       Upload to Cloudinary (public)
```

**Request:** `multipart/form-data`, field name: `fileUpload`, max 50MB

```javascript
// Example
const form = new FormData();
form.append('fileUpload', file);
const res = await fetch('/api/v1/files/upload', { method: 'POST', body: form });
// Response: { data: { fileName: "https://cloudinary.com/..." } }
```

---

### Users

```
POST   /api/v1/users              Create user (JWT — admin)
GET    /api/v1/users              List users (JWT — admin)
GET    /api/v1/users/:id          Get user (public)
PATCH  /api/v1/users              Update user (JWT)
DELETE /api/v1/users/:id          Delete user (JWT — admin)
PUT    /api/v1/users/reset-password    Change password (JWT)
PUT    /api/v1/users/update-status     Toggle status (JWT — admin)
PUT    /api/v1/users/update-user-info  Update profile (JWT)
```

**Update profile body:**
```json
{
  "name": "New Name",
  "date_of_birth": "1999-01-15",
  "gender": "male",
  "address": "Ho Chi Minh City",
  "avatar": "https://..."
}
```

**Reset password body:**
```json
{ "oldPassword": "current123", "newPassword": "newpass456" }
```

---

### Websites (Multi-tenant)

```
POST   /api/v1/websites           Register new website (JWT)
GET    /api/v1/websites           List websites (public)
GET    /api/v1/websites/:id       Get website (public)
PATCH  /api/v1/websites/:id       Update (JWT)
DELETE /api/v1/websites/:id       Delete (JWT)
```

**Create body:**
```json
{
  "name": "My Blog",
  "slug": "my-blog",
  "description": "Personal blog",
  "isActive": true
}
```

`slug` becomes the `websiteId` used throughout the API.

---

### Roles & Permissions (Admin)

```
POST/GET/PATCH/DELETE  /api/v1/roles
POST/GET/PATCH/DELETE  /api/v1/permissions
```

**Create permission body:**
```json
{
  "name": "Get all posts",
  "apiPath": "/api/v1/posts",
  "method": "GET",
  "module": "posts"
}
```

**Create role body:**
```json
{
  "name": "EDITOR",
  "description": "Can manage posts",
  "isActive": true,
  "permissions": ["permissionId1", "permissionId2"]
}
```

---

### Email Follow (Subscription)

```
POST   /api/v1/email-follow       Subscribe (JWT)
GET    /api/v1/email-follow       List subscribers (public)
DELETE /api/v1/email-follow/:id   Unsubscribe (JWT)
```

**Subscribe body:** `{ "email": "user@example.com" }`

Auto-sends weekly digest every Sunday 00:10 AM.

---

### Dashboard & Health

```
GET  /api/v1/dashboard    Stats: user/post/category counts (JWT)
GET  /api/v1/health       MongoDB health check (public)
```

**Dashboard response:**
```json
{ "data": { "countUser": 42, "countPost": 156, "countCategory": 8 } }
```

---

## Error Handling

| Status | Meaning |
|--------|---------|
| 400 | Bad request / validation error |
| 401 | Missing or invalid token |
| 403 | Insufficient permissions |
| 429 | Rate limited (max 60 req/min, login: 10 req/min) |
| 500 | Server error |

**401 → refresh flow:**
```javascript
// When access token expires
const res = await fetch('/api/v1/auth/refresh', { credentials: 'include' });
const { data } = await res.json();
// data.access_token = new token
```

---

## Common Patterns for Frontend

### Axios setup
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
  withCredentials: true, // required for refresh_token cookie
});

// Set token after login
api.defaults.headers['Authorization'] = `Bearer ${access_token}`;

// Auto-refresh interceptor
api.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401) {
    const { data } = await api.get('/auth/refresh');
    api.defaults.headers['Authorization'] = `Bearer ${data.data.access_token}`;
    return api.request(error.config);
  }
  throw error;
});
```

### Fetch with auth
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
};
```

### Filter posts by website + category
```
GET /api/v1/posts?qs=websiteId=my-blog&current=1&pageSize=10
GET /api/v1/posts?qs=websiteId=my-blog%26categoryId=64abc123
```

### Like a post
```
PUT /api/v1/posts/:id     (JWT required — toggles like/unlike for current user)
```
