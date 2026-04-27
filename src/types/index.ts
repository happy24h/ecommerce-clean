// ==================== PRODUCT ====================
export interface Product {
  _id: string
  title: string
  slug: string
  description: string
  price: number
  images: string[]
  // Digital product
  sourceFileUrl?: string
  demoUrl?: string
  techStack?: string[]
  videoUrl?: string
  version?: string
  // Physical product
  stock: number
  metadata?: Record<string, unknown>
  // Common
  websiteId: string
  categoryId: string
  isActive: boolean
  createdBy?: { _id: string; email: string; name: string; avatar?: string }
  createdAt: string
  updatedAt: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image: string
  type: 'POST' | 'PRODUCT'
  websiteId: string
  totalPosts?: number
}

// ==================== USER ====================
export interface User {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  addresses: Address[]
  createdAt: string
}

export interface Address {
  _id: string
  label: string
  fullName: string
  phone: string
  province: string
  district: string
  ward: string
  street: string
  isDefault: boolean
}

// ==================== AUTH ====================
export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  access_token: string
  // refresh_token được backend lưu vào cookie, không có trong response body
}

// ==================== CART ====================
export interface CartItem {
  productId: string
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

// ==================== ORDER ====================
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipping'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  productId: number
  product: Product
  quantity: number
  price: number
}

export interface Order {
  id: string
  items: OrderItem[]
  shippingAddress: Address
  status: OrderStatus
  paymentMethod: 'cod' | 'banking' | 'momo' | 'zalopay'
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  note?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrderPayload {
  paymentMethod: Order['paymentMethod']
  note?: string
}

// ==================== REVIEW ====================
export interface Review {
  id: number
  productId: number
  user: Pick<User, 'id' | 'name' | 'avatar'>
  rating: number
  comment: string
  images?: string[]
  createdAt: string
}

// ==================== API RESPONSE ====================
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// ==================== POST ====================
export interface Post {
  _id: string
  title: string
  description?: string
  image: string
  websiteId: string
  categoryId: { _id: string; name: string; image?: string } | string
  likes: string[]
  commentCount: number
  createdBy: { _id: string; email: string; name: string; avatar?: string }
  createdAt: string
  updatedAt: string
}

// ==================== FILTER ====================
export interface ProductFilter {
  categoryId?: string
  websiteId?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating'
  search?: string
  page?: number
  limit?: number
}
