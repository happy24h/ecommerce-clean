import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { orderApi, paymentApi, cartApi } from '@/api'
import { QUERY_KEYS } from '@/constants'
import type { CreateOrderPayload } from '@/types'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

// staleTime cho orders ngắn hơn products vì trạng thái đơn hàng thay đổi thường xuyên hơn.
// 60s: user vào lại trang orders trong 1 phút sẽ dùng cache, quá 1 phút mới refetch.

export const useMyOrders = (page = 1, status?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, page, status],
    queryFn: () => orderApi.getMyOrders(page, 10, status),
    staleTime: 1000 * 60,
  })
}

export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDER_DETAIL, orderId],
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60,
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { clearCart, items } = useCartStore()

  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      // Sync local cart → backend cart trước khi checkout
      await cartApi.syncFromLocal(
        items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      )
      return orderApi.createOrder(payload)
    },
    onSuccess: async (res) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] })
      const order = res.data

      if (order.paymentMethod === 'PAYOS') {
        try {
          const payment = await paymentApi.createPaymentLink(order._id)
          // clearCart được gọi ở PaymentSuccessPage sau khi redirect về
          window.location.href = payment.data.checkoutUrl
        } catch {
          toast.error('Không tạo được link thanh toán. Vui lòng thử lại.')
        }
      } else {
        // COD / MOMO / BANK_TRANSFER: backend xoá cart ngay sau checkout
        clearCart()
        toast.success('Đặt hàng thành công!')
        navigate(`/order/success/${order._id}`)
      }
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'Đặt hàng thất bại. Vui lòng thử lại.')
      console.error('[useCreateOrder]', error)
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
      toast.success('Cập nhật trạng thái thành công.')
    },
    onError: () => {
      toast.error('Không thể cập nhật trạng thái đơn hàng.')
    },
  })
}
