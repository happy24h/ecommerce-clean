# 🛒 ShopVN — E-commerce App

Dự án thương mại điện tử full-stack frontend xây dựng bằng **React + TanStack Query + Zustand + Tailwind CSS**.

---

## 🚀 Tech Stack

| Công nghệ | Mục đích |
|---|---|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool, dev server |
| **TanStack Query v5** | Server state management (API data, caching) |
| **Zustand** | Client state (giỏ hàng, UI state) |
| **React Router v6** | Routing, protected routes |
| **Tailwind CSS** | Styling |
| **Axios** | HTTP client + interceptors |
| **react-hot-toast** | Notifications |
| **lucide-react** | Icons |

---

## 📁 Cấu trúc dự án

```
src/
├── api/                    # Axios instance + API functions
│   ├── axiosInstance.ts    # Axios config, interceptors, auto refresh token
│   ├── productApi.ts       # Product endpoints
│   ├── authApi.ts          # Auth endpoints
│   ├── orderApi.ts         # Order endpoints
│   └── categoryApi.ts      # Category endpoints
│
├── components/
│   ├── ui/                 # Reusable primitives (Button, Input, Badge, Spinner...)
│   ├── layout/             # Header, Footer, MainLayout
│   ├── product/            # ProductCard, ProductGrid
│   ├── cart/               # CartItem
│   └── auth/               # ProtectedRoute
│
├── hooks/                  # TanStack Query hooks (business logic)
│   ├── useProducts.ts      # useProducts, useProduct, useFeaturedProducts...
│   ├── useAuth.ts          # useLogin, useRegister, useLogout, useCurrentUser
│   └── useOrders.ts        # useMyOrders, useCreateOrder, useCancelOrder
│
├── pages/                  # Route-level page components
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx    # Listing + filter + sort + pagination
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── OrdersPage.tsx
│
├── store/
│   └── cartStore.ts        # Zustand cart store (persist to localStorage)
│
├── types/
│   └── index.ts            # TypeScript interfaces (Product, User, Order, ...)
│
├── constants/
│   └── index.ts            # QUERY_KEYS, ROUTES, labels, ...
│
├── utils/
│   └── index.ts            # formatPrice, formatDate, cn, debounce, ...
│
├── App.tsx                 # QueryClient config + Router setup
└── main.tsx                # Entry point
```

---

## ⚡ Tại sao dùng TanStack Query?

### ✅ Giải quyết được các vấn đề điển hình trong E-commerce

**1. Caching thông minh — không gọi API thừa**
```ts
// Sản phẩm nổi bật cache 10 phút
const { data } = useQuery({
  queryKey: ['featured-products'],
  queryFn: productApi.getFeaturedProducts,
  staleTime: 1000 * 60 * 10,
})
```

**2. Pagination mượt mà với placeholderData**
```ts
// Giữ data cũ trong khi load trang mới → không bị nhấp nháy trắng
useQuery({
  queryKey: ['products', filter],
  queryFn: () => productApi.getProducts(filter),
  placeholderData: (prev) => prev, // ← magic line
})
```

**3. Optimistic / Invalidate sau mutation**
```ts
// Sau khi tạo review → tự fetch lại rating + reviews
useMutation({
  mutationFn: productApi.createReview,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['reviews', productId] })
    queryClient.invalidateQueries({ queryKey: ['product-detail'] })
  }
})
```

**4. Set cache trực tiếp — không cần round-trip thêm**
```ts
// Sau khi login → set user vào cache ngay, không cần gọi /me
queryClient.setQueryData(['current-user'], data.user)
```

**5. Conditional fetch — chỉ fetch khi có token**
```ts
useQuery({
  queryKey: ['current-user'],
  queryFn: authApi.getMe,
  enabled: !!localStorage.getItem('accessToken'),
})
```

### 🆚 So sánh với useState/useEffect thuần

| Tiêu chí | useState/useEffect | TanStack Query |
|---|---|---|
| Boilerplate code | Nhiều (loading, error, data state) | Ít, gọn |
| Caching | ❌ Không có | ✅ Built-in |
| Deduplication | ❌ Gọi nhiều lần | ✅ Tự dedupe |
| Background refetch | ❌ Phải tự code | ✅ Built-in |
| Pagination | ❌ Phức tạp | ✅ placeholderData |
| Infinite scroll | ❌ Rất phức tạp | ✅ useInfiniteQuery |
| DevTools | ❌ Không có | ✅ React Query DevTools |

---

## 🧠 Chiến lược State Management

```
State
├── Server state (API data) → TanStack Query
│   ├── Products, Categories
│   ├── User profile
│   └── Orders, Reviews
│
└── Client state (local) → Zustand
    ├── Cart items (persist localStorage)
    ├── UI state (modal, sidebar)
    └── Filter/search params → useSearchParams (URL)
```

---

## 🛠️ Cài đặt & Chạy

```bash
# Clone và cài dependencies
git clone <repo>
cd ecommerce-app
npm install

# Cấu hình environment
cp .env.example .env
# Chỉnh VITE_API_URL trong .env

# Chạy dev server
npm run dev

# Build production
npm run build
```

---

## 📌 Các tính năng đã implement

- [x] Trang chủ (Hero, Categories, Featured Products)
- [x] Danh sách sản phẩm (Filter, Sort, Pagination)
- [x] Chi tiết sản phẩm (Gallery, Quantity, Related)
- [x] Giỏ hàng (CRUD, persist localStorage)
- [x] Checkout (Address, Payment method)
- [x] Đăng nhập / Đăng ký (với validation)
- [x] Danh sách đơn hàng (Filter by status)
- [x] Protected Routes
- [x] Auto refresh token (Axios interceptor)
- [x] Skeleton loading states
- [x] Toast notifications
- [x] Responsive (mobile-first)

## 🔜 Có thể mở rộng

- [ ] Wishlist
- [ ] Search với debounce
- [ ] Product reviews & ratings
- [ ] Infinite scroll (useInfiniteQuery đã có)
- [ ] Admin dashboard
- [ ] PWA support
