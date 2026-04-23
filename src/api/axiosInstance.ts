import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.shopvn.com/v1'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true, // gửi cookie refresh_token tự động
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ Request Interceptor — tự động đính kèm access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Response Interceptor — xử lý refresh token khi 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Backend dùng cookie refresh_token, không cần gửi body
        const { data } = await axios.get(`${BASE_URL}/auth/refresh`, {
          withCredentials: true,
        })

        localStorage.setItem('access_token', data.data.access_token)
        originalRequest.headers.Authorization = `Bearer ${data.data.access_token}`
        return axiosInstance(originalRequest)
      } catch {
        // Refresh token hết hạn → logout
        localStorage.removeItem('access_token')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)
