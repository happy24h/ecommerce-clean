import { axiosInstance } from './axiosInstance'
import type { Category } from '@/types'
import { WEBSITE_ID } from '@/constants'

const BASE_PARAMS = { websiteIds: WEBSITE_ID, current: 1, pageSize: 10, sort: '-updatedAt' }

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const { data } = await axiosInstance.get('/category', {
      params: { ...BASE_PARAMS, type: 'PRODUCT' },
    })
    return data.data?.result ?? []
  },

  getPostCategories: async (): Promise<Category[]> => {
    const { data } = await axiosInstance.get('/category', {
      params: { ...BASE_PARAMS, type: 'POST', pageSize: 20 },
    })
    return data.data?.result ?? []
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const { data } = await axiosInstance.get(`/category/${slug}`, {
      params: { websiteIds: WEBSITE_ID },
    })
    return data.data?.result
  },
}
