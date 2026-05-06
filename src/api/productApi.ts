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
    const { page, limit, minPrice, maxPrice, categoryId, search, sort } = filter

    const catId = typeof categoryId === 'object' ? (categoryId as { _id: string })._id : categoryId

    // Map frontend sort value → field name thực tế trong schema
    const SORT_MAP: Record<string, string> = {
      price_asc:  'price',
      price_desc: '-price',
      newest:     '-createdAt',
      popular:    '-createdAt',
      rating:     '-createdAt',
    }

    // aqp (api-query-parser) đọc trực tiếp từ query params
    // price=>=100000 & price=<=500000 → { price: { $gte: 100000, $lte: 500000 } }
    const baseParams = new URLSearchParams()
    baseParams.set('websiteId', WEBSITE_ID)
    baseParams.set('current',   String(page ?? 1))
    baseParams.set('pageSize',  String(limit ?? 12))
    if (catId)  baseParams.set('categoryId', catId)
    if (search) baseParams.set('title', search)
    if (sort && SORT_MAP[sort]) baseParams.set('sort', SORT_MAP[sort])
    if (minPrice !== undefined) baseParams.append('price', `>=${minPrice}`)
    if (maxPrice !== undefined) baseParams.append('price', `<=${maxPrice}`)

    const { data } = await axiosInstance.get(`/product?${baseParams.toString()}`)
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
      { params: { limit, websiteId: WEBSITE_ID } }
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
