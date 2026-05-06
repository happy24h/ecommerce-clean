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
      age: payload.age,
      gender: payload.gender,
      address: payload.address,
      avatar: 'https://res-console.cloudinary.com/dvdfr9qvv/thumbnails/v1/image/upload/v1770363235/ZGVmYXVsdF9xaHNncDg=/preview',
      status: true,
    })
    return data.data
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout')
    localStorage.removeItem('access_token')
  },

  getMe: async (): Promise<User> => {
    const { data } = await axiosInstance.get('/auth/account')
    // /auth/account trả về { data: { user: {...} } } — khác với login trả về { data: { user, access_token } }
    return data.data.user
  },

  updateProfile: async (
    payload: Partial<Pick<User, 'name' | 'avatar' | 'address' | 'gender'>>
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
