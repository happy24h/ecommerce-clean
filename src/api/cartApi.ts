import { axiosInstance } from './axiosInstance'

interface BackendCartItem {
  productId: { _id: string; title: string; price: number; images: string[] }
  quantity: number
  addedAt: string
}

interface BackendCart {
  _id: string
  userId: string
  items: BackendCartItem[]
}

export const cartApi = {
  getCart: async (): Promise<BackendCart> => {
    const { data } = await axiosInstance.get('/cart')
    return data.data
  },

  addItem: async (productId: string, quantity: number): Promise<void> => {
    await axiosInstance.post('/cart/add', { productId, quantity })
  },

  removeItem: async (productId: string): Promise<void> => {
    await axiosInstance.delete(`/cart/remove/${productId}`)
  },

  syncFromLocal: async (
    items: { productId: string; quantity: number }[]
  ): Promise<void> => {
    let existingIds: string[] = []
    try {
      const cart = await cartApi.getCart()
      existingIds = (cart?.items ?? []).map((i) => i.productId._id)
    } catch {
      // Cart chưa tồn tại → bỏ qua bước xóa
    }

    await Promise.all(existingIds.map((id) => cartApi.removeItem(id)))

    for (const item of items) {
      await cartApi.addItem(item.productId, item.quantity)
    }
  },
}
