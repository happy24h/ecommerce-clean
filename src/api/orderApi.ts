import { axiosInstance } from './axiosInstance'
import type {
  Order,
  CreateOrderPayload,
  PaginatedResponse,
  ApiResponse,
} from '@/types'

export const orderApi = {
  // Tạo đơn hàng từ server-side cart
  createOrder: async (
    payload: CreateOrderPayload
  ): Promise<ApiResponse<Order>> => {
    const { data } = await axiosInstance.post('/order/checkout', payload)
    return data
  },

  // Lấy danh sách đơn hàng của user
  getMyOrders: async (
    page = 1,
    limit = 10,
    status?: string
  ): Promise<PaginatedResponse<Order>> => {
    const { data } = await axiosInstance.get('/order', {
      params: { current: page, pageSize: limit, status },
    })
    return data
  },

  // Chi tiết đơn hàng
  getOrderById: async (orderId: string): Promise<Order> => {
    const { data } = await axiosInstance.get(`/order/${orderId}`)
    return data.data
  },

  // Hủy đơn hàng
  cancelOrder: async (
    orderId: string,
    reason: string
  ): Promise<ApiResponse<Order>> => {
    const { data } = await axiosInstance.patch(`/order/${orderId}/cancel`, {
      reason,
    })
    return data
  },
}
