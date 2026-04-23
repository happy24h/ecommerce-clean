import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api'
import { QUERY_KEYS, ROUTES } from '@/constants'
import type { LoginPayload, RegisterPayload } from '@/types'
import toast from 'react-hot-toast'

// ✅ Lấy thông tin user hiện tại
export const useCurrentUser = () => {
  const token = localStorage.getItem('access_token')

  return useQuery({
    queryKey: [QUERY_KEYS.CURRENT_USER],
    queryFn: authApi.getMe,
    enabled: !!token,           // Chỉ fetch nếu có token
    staleTime: 1000 * 60 * 5,   // 5 phút
    retry: false,               // Không retry nếu 401
  })
}

// ✅ Kiểm tra đăng nhập
export const useIsAuthenticated = () => {
  const { data, isLoading } = useCurrentUser()
  return {
    isAuthenticated: !!data,
    isLoading,
    user: data,
  }
}

// ✅ Đăng nhập
export const useLogin = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token)
      // refresh_token được backend lưu vào cookie tự động

      queryClient.setQueryData([QUERY_KEYS.CURRENT_USER], data.user)

      toast.success(`Chào mừng ${data.user.name}! 👋`)
      navigate(ROUTES.HOME)
    },
    onError: () => {
      toast.error('Email hoặc mật khẩu không đúng.')
    },
  })
}

// ✅ Đăng ký
export const useRegister = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token)
      queryClient.setQueryData([QUERY_KEYS.CURRENT_USER], data.user)

      toast.success('Đăng ký thành công! Chào mừng bạn 🎉')
      navigate(ROUTES.HOME)
    },
    onError: () => {
      toast.error('Đăng ký thất bại. Email có thể đã được sử dụng.')
    },
  })
}

// ✅ Đăng xuất
export const useLogout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Xóa toàn bộ cache khi logout
      queryClient.clear()
      navigate(ROUTES.LOGIN)
      toast.success('Đã đăng xuất.')
    },
  })
}

// ✅ Cập nhật profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.CURRENT_USER], data.data)
      toast.success('Cập nhật thông tin thành công!')
    },
    onError: () => {
      toast.error('Cập nhật thất bại. Vui lòng thử lại.')
    },
  })
}
