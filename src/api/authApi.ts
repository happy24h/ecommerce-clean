import { axiosInstance } from './axiosInstance'
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
  ApiResponse,
} from '@/types'

export const authApi = {
  // backend nhận field "username" không phải "email"
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post('/auth/login', {
      username: payload.email,
      password: payload.password,
    })
    return data.data
  },

  // không gửi confirmPassword lên server
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post('/auth/register', {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    })
    return data.data
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout')
    localStorage.removeItem('access_token')
  },

  // đúng endpoint là /auth/account
  getMe: async (): Promise<User> => {
    const { data } = await axiosInstance.get('/auth/account')
    return data.data
  },

  updateProfile: async (
    payload: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>
  ): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.put('/users/update-user-info', payload)
    return data
  },

  // backend dùng oldPassword/newPassword, không phải currentPassword
  changePassword: async (payload: {
    currentPassword: string
    newPassword: string
  }): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.put('/users/reset-password', {
      oldPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    })
    return data
  },
}
