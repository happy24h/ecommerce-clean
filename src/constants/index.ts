export const QUERY_KEYS = {
  // Products
  PRODUCTS: 'products',
  PRODUCT_DETAIL: 'product-detail',
  FEATURED_PRODUCTS: 'featured-products',
  RELATED_PRODUCTS: 'related-products',

  // Categories
  CATEGORIES: 'categories',
  CATEGORY_DETAIL: 'category-detail',

  // Posts
  POSTS: 'posts',
  POST_DETAIL: 'post-detail',
  POST_CATEGORIES: 'post-categories',

  // Auth
  CURRENT_USER: 'current-user',

  // Orders
  ORDERS: 'orders',
  ORDER_DETAIL: 'order-detail',

  // Reviews
  REVIEWS: 'reviews',

  // Cart (nếu dùng server-side cart)
  CART: 'cart',

  // Wishlist
  WISHLIST: 'wishlist',
} as const

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:slug',
  CATEGORY: '/category/:slug',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order/success/:orderId',
  ORDERS: '/account/orders',
  ORDER_DETAIL: '/account/orders/:id',
  PROFILE: '/account/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  SEARCH: '/search',
} as const

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
}

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cod: 'Thanh toán khi nhận hàng',
  banking: 'Chuyển khoản ngân hàng',
  momo: 'Ví MoMo',
  zalopay: 'ZaloPay',
}

export const SORT_OPTIONS = [
  { label: 'Phổ biến nhất', value: 'popular' },
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Giá thấp đến cao', value: 'price_asc' },
  { label: 'Giá cao đến thấp', value: 'price_desc' },
  { label: 'Đánh giá cao nhất', value: 'rating' },
] as const

export const DEFAULT_PAGE_SIZE = 12
export const WEBSITE_ID = 'prostore'
export const MAX_QUANTITY = 99
