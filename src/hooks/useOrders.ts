import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { orderApi, paymentApi } from '@/api'
import { QUERY_KEYS } from '@/constants'
import type { CreateOrderPayload } from '@/types'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

export const useMyOrders = (page = 1, status?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, page, status],
    queryFn: () => orderApi.getMyOrders(page, 10, status),
    staleTime: 1000 * 30,
  })
}

export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDER_DETAIL, orderId],
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId,
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const clearCart = useCartStore((s) => s.clearCart)

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderApi.createOrder(payload),
    onSuccess: async (res) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] })
      const order = res.data

      if (order.paymentMethod === 'PAYOS') {
        try {
          const payment = await paymentApi.createPaymentLink(order._id)
          // Cart local sẽ được clear trên PaymentSuccessPage sau khi redirect về
          window.location.href = payment.data.checkoutUrl
        } catch {
          toast.error('Không tạo được link thanh toán. Vui lòng thử lại.')
        }
      } else {
        // COD / MOMO / BANK_TRANSFER: đặt hàng xong là xong, clear cart luôn
        clearCart()
        toast.success('Đặt hàng thành công!')
        navigate(`/order/success/${order._id}`)
      }
    },
    onError: () => {
      toast.error('Đặt hàng thất bại. Vui lòng thử lại.')
    },
  })
}

export const useUpdateOrderStatus = (orderId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: string) => orderApi.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER_DETAIL, orderId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] })
    },
    onError: () => {
      toast.error('Không thể cập nhật trạng thái đơn hàng.')
    },
  })
}
