import { useQuery } from '@tanstack/react-query'
import { postsApi } from '@/api'
import { QUERY_KEYS } from '@/constants'

export const usePosts = (page = 1, pageSize = 9, categoryId?: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.POSTS, page, pageSize, categoryId],
    queryFn: () => postsApi.getPosts(page, pageSize, categoryId),
    staleTime: 1000 * 60 * 5,
  })

export const usePost = (id: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.POST_DETAIL, id],
    queryFn: () => postsApi.getPostById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
