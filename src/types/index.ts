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
export interface Permission {
  _id: string
  name: string
  apiPath: string
  method: string
  module: string
}

export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  address?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  role?: { _id: string; name: string }
  permissions?: Permission[]
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
  age: number
  gender: 'male' | 'female' | 'other'
  address: string
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
export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'
export type PaymentMethod = 'PAYOS' | 'MOMO' | 'BANK_TRANSFER' | 'COD'

export interface ShippingAddress {
  name: string
  phone: string
  address: string
}

export interface OrderItem {
  productId: string
  title: string
  price: number
  quantity: number
}

export interface Order {
  _id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  shippingFee: number
  shippingAddress: ShippingAddress
  status: OrderStatus
  paymentMethod: PaymentMethod
  note?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrderPayload {
  paymentMethod: PaymentMethod
  shippingAddress: ShippingAddress
  shippingFee: number
  note?: string
}

// ==================== PAYMENT ====================
export interface PaymentLink {
  checkoutUrl: string
  qrCode: string
  paymentLinkId: string
  status: string
  amount: number
}

// ==================== REVIEW ====================
export interface Review {
  id: number
  productId: number
  user: Pick<User, '_id' | 'name' | 'avatar'>
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
