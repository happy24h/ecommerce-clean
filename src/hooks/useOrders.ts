import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { orderApi } from '@/api'
import { QUERY_KEYS } from '@/constants'
import type { CreateOrderPayload } from '@/types'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

// ✅ Lấy danh sách đơn hàng
export const useMyOrders = (page = 1, status?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, page, status],
    queryFn: () => orderApi.getMyOrders(page, 10, status),
    staleTime: 1000 * 30, // 30 giây — đơn hàng cần fresh hơn
  })
}

// ✅ Chi tiết đơn hàng
export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDER_DETAIL, orderId],
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId,
  })
}

// ✅ Tạo đơn hàng
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const clearCart = useCartStore((s) => s.clearCart)

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderApi.createOrder(payload),
    onSuccess: (data) => {
      // Xóa giỏ hàng sau khi đặt hàng thành công
      clearCart()

      // Invalidate danh sách đơn hàng
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] })

      toast.success('Đặt hàng thành công! 🎉')
      navigate(`/order/success/${data.data.id}`)
    },
    onError: () => {
      toast.error('Đặt hàng thất bại. Vui lòng thử lại.')
    },
  })
}

// ✅ Hủy đơn hàng
export const useCancelOrder = (orderId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reason: string) => orderApi.cancelOrder(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER_DETAIL, orderId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] })
      toast.success('Đã hủy đơn hàng.')
    },
    onError: () => {
      toast.error('Không thể hủy đơn hàng này.')
    },
  })
}
