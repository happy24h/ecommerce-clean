import { axiosInstance } from './axiosInstance'
import type { Post, PaginatedResponse } from '@/types'

export const postsApi = {
  getPosts: async (page = 1, pageSize = 9, categoryId?: string): Promise<PaginatedResponse<Post>> => {
    const params: Record<string, unknown> = { current: page, pageSize }
    if (categoryId) params.categoryId = categoryId
    else params.websiteId = 'my-blog'
    const { data } = await axiosInstance.get('/posts', { params })
    return {
      data: data.data?.result ?? [],
      meta: {
        total: data.data?.meta?.total ?? 0,
        page: data.data?.meta?.current ?? 1,
        limit: data.data?.meta?.pageSize ?? pageSize,
        totalPages: data.data?.meta?.pages ?? 1,
      },
    }
  },

  getPostById: async (id: string): Promise<Post> => {
    const { data } = await axiosInstance.get(`/posts/${id}`)
    return data.data
  },
}
