import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { productApi } from '@/api'
import { QUERY_KEYS } from '@/constants'
import type { ProductFilter } from '@/types'
import toast from 'react-hot-toast'

// staleTime riêng cho từng loại data:
//   products list  → 2 phút  (thay đổi thường xuyên: giá, stock)
//   product detail → 5 phút  (ít thay đổi hơn)
//   featured       → 10 phút (gần như tĩnh, do admin chọn thủ công)
//   related        → 5 phút  (theo category, thay đổi chậm)

export const useProducts = (filter: ProductFilter = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, filter],
    queryFn: () => productApi.getProducts(filter),
    staleTime: 1000 * 60 * 2,
    // Giữ data cũ khi đổi trang — tránh màn hình trắng giữa các lần phân trang
    placeholderData: (prev) => prev,
  })
}

export const useInfiniteProducts = (filter: Omit<ProductFilter, 'page'> = {}) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'infinite', filter],
    queryFn: ({ pageParam = 1 }) =>
      productApi.getProducts({ ...filter, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta
      return page < totalPages ? page + 1 : undefined
    },
    staleTime: 1000 * 60 * 2,
  })
}

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_DETAIL, slug],
    queryFn: () => productApi.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  })
}

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEATURED_PRODUCTS],
    queryFn: productApi.getFeaturedProducts,
    staleTime: 1000 * 60 * 10,
  })
}

export const useRelatedProducts = (categoryId: string, excludeId: string) => {
  return useQuery({
    // excludeId nằm trong queryKey để mỗi product detail có cache riêng
    queryKey: [QUERY_KEYS.RELATED_PRODUCTS, categoryId, excludeId],
    queryFn: () => productApi.getProducts({ categoryId, page: 1, limit: 5 }),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
    // Lọc + giới hạn ngay trong query, không cần thêm state ở component
    select: (data) => data.data.filter((p) => p._id !== excludeId).slice(0, 4),
  })
}

export const useProductReviews = (productId: number, page = 1) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEWS, productId, page],
    queryFn: () => productApi.getProductReviews(productId, page),
    enabled: !!productId,
  })
}

export const useCreateReview = (productId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { rating: number; comment: string }) =>
      productApi.createReview(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS, productId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCT_DETAIL] })
      toast.success('Đánh giá của bạn đã được gửi!')
    },
    onError: () => {
      toast.error('Gửi đánh giá thất bại. Vui lòng thử lại.')
    },
  })
}
