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

// ✅ Lấy danh sách sản phẩm với filter
export const useProducts = (filter: ProductFilter = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, filter],
    queryFn: () => productApi.getProducts(filter),
    staleTime: 1000 * 60 * 2, // 2 phút — sản phẩm ít thay đổi
    placeholderData: (prev) => prev, // giữ data cũ trong lúc load trang mới (pagination mượt)
  })
}

// ✅ Infinite scroll cho trang sản phẩm
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
  })
}

// ✅ Chi tiết sản phẩm
export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_DETAIL, slug],
    queryFn: () => productApi.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 phút
  })
}

// ✅ Sản phẩm nổi bật (trang Home)
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEATURED_PRODUCTS],
    queryFn: productApi.getFeaturedProducts,
    staleTime: 1000 * 60 * 10, // 10 phút — ít thay đổi
  })
}

// ✅ Sản phẩm liên quan — lấy theo cùng categoryId, loại bỏ sản phẩm hiện tại
export const useRelatedProducts = (categoryId: string, excludeId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.RELATED_PRODUCTS, categoryId],
    queryFn: () => productApi.getProducts({ page: 1, limit: 5 }),
    enabled: !!categoryId,
    select: (data) => data.data.filter((p) => p._id !== excludeId).slice(0, 4),
  })
}

// ✅ Đánh giá sản phẩm
export const useProductReviews = (productId: number, page = 1) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEWS, productId, page],
    queryFn: () => productApi.getProductReviews(productId, page),
    enabled: !!productId,
  })
}

// ✅ Tạo đánh giá (mutation)
export const useCreateReview = (productId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { rating: number; comment: string }) =>
      productApi.createReview(productId, payload),
    onSuccess: () => {
      // Invalidate để tự fetch lại reviews sau khi tạo
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REVIEWS, productId],
      })
      // Cập nhật lại rating trên product detail
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT_DETAIL],
      })
      toast.success('Đánh giá của bạn đã được gửi!')
    },
    onError: () => {
      toast.error('Gửi đánh giá thất bại. Vui lòng thử lại.')
    },
  })
}
