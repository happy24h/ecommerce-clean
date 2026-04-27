import { axiosInstance } from './axiosInstance'
import type {
  Product,
  PaginatedResponse,
  ProductFilter,
  Review,
  ApiResponse,
} from '@/types'
import { WEBSITE_ID } from '@/constants'

export const productApi = {
  // Lấy danh sách sản phẩm (có filter, search, pagination)
  getProducts: async (
    filter: ProductFilter = {}
  ): Promise<PaginatedResponse<Product>> => {
    // backend dùng current/pageSize thay vì page/limit
    const { page, limit, ...rest } = filter
    const params = { websiteId: WEBSITE_ID, ...rest, current: page, pageSize: limit }
    const { data } = await axiosInstance.get('/product', { params })
    return {
      data: data.data?.result ?? [],
      meta: {
        total: data.data?.meta?.total ?? 0,
        page: data.data?.meta?.current ?? 1,
        limit: data.data?.meta?.pageSize ?? 10,
        totalPages: data.data?.meta?.pages ?? 1,
      },
    }
  },

  // Lấy chi tiết sản phẩm theo slug
  getProductBySlug: async (slug: string): Promise<Product> => {
    const { data } = await axiosInstance.get(`/product/${slug}`, { params: { websiteId: WEBSITE_ID } })
    return data.data
  },

  // Lấy sản phẩm nổi bật (cho trang Home)
  getFeaturedProducts: async (): Promise<Product[]> => {
    const { data } = await axiosInstance.get('/product', { params: { websiteId: WEBSITE_ID } })
    return data.data?.result
  },

  // Lấy sản phẩm liên quan
  getRelatedProducts: async (
    productId: number,
    limit = 8
  ): Promise<Product[]> => {
    const { data } = await axiosInstance.get(
      `/products/${productId}/related`,
      { params: { limit } }
    )
    return data.data
  },

  // Lấy đánh giá sản phẩm
  getProductReviews: async (
    productId: number,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Review>> => {
    const { data } = await axiosInstance.get(
      `/products/${productId}/reviews`,
      { params: { page, limit } }
    )
    return data
  },

  // Tạo đánh giá
  createReview: async (
    productId: number,
    payload: { rating: number; comment: string; images?: string[] }
  ): Promise<ApiResponse<Review>> => {
    const { data } = await axiosInstance.post(
      `/products/${productId}/reviews`,
      payload
    )
    return data
  },
}
