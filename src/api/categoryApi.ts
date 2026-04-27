import { axiosInstance } from './axiosInstance'
import type { Category } from '@/types'
import { WEBSITE_ID } from '@/constants'

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const { data } = await axiosInstance.get('/category', { params: { websiteId: WEBSITE_ID } })
    return data.data?.result
  },

  getPostCategories: async (): Promise<Category[]> => {
    const { data } = await axiosInstance.get('/category', {
      params: { websiteId: 'my-blog', type: 'POST', pageSize: 20 },
    })
    return data.data?.result ?? []
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const { data } = await axiosInstance.get(`/category/${slug}`, { params: { websiteId: WEBSITE_ID } })
    return data.data?.result
  },
}
