import { axiosInstance } from './axiosInstance'
import type { Order, CreateOrderPayload, PaginatedResponse, ApiResponse } from '@/types'

export const orderApi = {
  createOrder: async (payload: CreateOrderPayload): Promise<ApiResponse<Order>> => {
    const { data } = await axiosInstance.post('/order/checkout', payload)
    return data
  },

  getMyOrders: async (page = 1, limit = 10, status?: string): Promise<PaginatedResponse<Order>> => {
    const params: Record<string, unknown> = { current: page, pageSize: limit }
    if (status) params.qs = `status=${status}`

    const { data } = await axiosInstance.get('/order/my-orders', { params })
    console.log('[orderApi.getMyOrders] raw response:', data)

    const payload = data.data

    // Backend trả về array trực tiếp: { data: [...] }
    if (Array.isArray(payload)) {
      return {
        data: payload,
        meta: { total: payload.length, page: 1, limit: payload.length, totalPages: 1 },
      }
    }

    // Backend trả về paginated: { data: { meta, result } }
    const { meta, result } = payload ?? {}
    return {
      data: result ?? [],
      meta: {
        total: meta?.total ?? 0,
        page: meta?.current ?? 1,
        limit: meta?.pageSize ?? limit,
        totalPages: meta?.pages ?? 1,
      },
    }
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    const { data } = await axiosInstance.get(`/order/${orderId}`)
    return data.data
  },

  // PENDING → CANCELLED | PAID → SHIPPING | SHIPPING → DELIVERED
  updateOrderStatus: async (orderId: string, status: string): Promise<ApiResponse<Order>> => {
    const { data } = await axiosInstance.patch(`/order/${orderId}/status`, { status })
    return data
  },
}
