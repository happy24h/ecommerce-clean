import { QueryClient } from '@tanstack/react-query'

// ─── Helpers ────────────────────────────────────────────────────────────────

const isAxiosError = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  'response' in error &&
  typeof (error as { response?: unknown }).response === 'object'

const getStatus = (error: unknown): number | undefined =>
  isAxiosError(error)
    ? (error as { response: { status?: number } }).response?.status
    : undefined

// ─── QueryClient ─────────────────────────────────────────────────────────────

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Không tự refetch khi user switch tab — tránh spam API không cần thiết.
      // Chỉ bật lại nếu data của bạn thay đổi real-time (e.g. giá cổ phiếu, chat).
      refetchOnWindowFocus: false,

      // Không retry khi mất mạng — đợi user tự thử lại.
      // Bật lại nếu app cần offline-first.
      refetchOnReconnect: false,

      // Mỗi query tự set staleTime riêng (xem từng hook).
      // Đây là fallback khi hook không set — 1 phút là hợp lý cho E-commerce.
      staleTime: 1000 * 60,

      // Sau khi component unmount, giữ cache bao lâu trước khi xoá.
      // 5 phút: đủ để user back lại trang và không cần fetch lại.
      gcTime: 1000 * 60 * 5,

      // Retry thông minh:
      // - 401 / 403 / 404: không retry — lỗi logic, retry cũng vô ích.
      // - Network/500: retry 1 lần — có thể do chập chờn nhất thời.
      retry: (failureCount, error) => {
        const status = getStatus(error)
        if (status === 401 || status === 403 || status === 404) return false
        return failureCount < 1
      },
    },

    mutations: {
      // Mutation (POST/PATCH/DELETE) không bao giờ retry tự động.
      // Đặt hàng 2 lần, xoá 2 lần — đều là thảm hoạ.
      retry: false,
    },
  },
})
