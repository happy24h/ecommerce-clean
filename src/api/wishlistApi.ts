import { axiosInstance } from './axiosInstance'
import type { Product } from '@/types'

export interface WishlistItem {
  _id: string
  productId: Pick<Product, '_id' | 'title' | 'price' | 'images' | 'slug' | 'sourceFileUrl' | 'stock'>
}

export interface WishlistResponse {
  meta: { current: number; pageSize: number; pages: number; total: number }
  result: WishlistItem[]
}

export const wishlistApi = {
  getWishlist: async (page = 1, pageSize = 10): Promise<WishlistResponse> => {
    const { data } = await axiosInstance.get('/wishlist', {
      params: { current: page, pageSize },
    })
    return data.data
  },

  toggle: async (productId: string): Promise<{ isFavorited: boolean }> => {
    const { data } = await axiosInstance.put(`/wishlist/${productId}`)
    return data.data
  },
}
