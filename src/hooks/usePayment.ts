import { useMutation } from '@tanstack/react-query'
import { paymentApi } from '@/api'
import toast from 'react-hot-toast'

export const useCreatePaymentLink = () => {
  return useMutation({
    mutationFn: (orderId: string) => paymentApi.createPaymentLink(orderId),
    onSuccess: (data) => {
      window.location.href = data.data.checkoutUrl
    },
    onError: () => {
      toast.error('Không tạo được link thanh toán. Vui lòng thử lại.')
    },
  })
}
