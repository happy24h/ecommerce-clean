import { axiosInstance } from './axiosInstance'
import type { Category } from '@/types'

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const { data } = await axiosInstance.get('/category')
    return data.data?.result
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const { data } = await axiosInstance.get(`/category/${slug}`)
    return data.data?.result
  },
}
