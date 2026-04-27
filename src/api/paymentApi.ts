import { axiosInstance } from './axiosInstance'
import type { ApiResponse, PaymentLink } from '@/types'

export const paymentApi = {
  createPaymentLink: async (orderId: string): Promise<ApiResponse<PaymentLink>> => {
    const { data } = await axiosInstance.post(`/payment/create-link/${orderId}`)
    return data
  },
}
