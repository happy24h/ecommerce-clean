import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { wishlistApi } from '@/api'
import { QUERY_KEYS } from '@/constants'
import { useIsAuthenticated } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export const useWishlist = (page = 1) => {
  const { isAuthenticated } = useIsAuthenticated()
  return useQuery({
    queryKey: [QUERY_KEYS.WISHLIST, page],
    queryFn: () => wishlistApi.getWishlist(page),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  })
}

export const useToggleWishlist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: wishlistApi.toggle,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] })
      toast.success(data.isFavorited ? 'Đã thêm vào yêu thích' : 'Đã xoá khỏi yêu thích')
    },
    onError: () => toast.error('Vui lòng đăng nhập để dùng tính năng này'),
  })
}
