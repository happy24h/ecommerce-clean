import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ✅ Merge Tailwind classes an toàn
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

// ✅ Format tiền VNĐ
export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)

// ✅ Tính % giảm giá
export const calcDiscount = (original: number, current: number): number =>
  Math.round(((original - current) / original) * 100)

// ✅ Format ngày giờ
export const formatDate = (dateStr: string): string =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))

// ✅ Truncate text
export const truncate = (text: string, maxLength: number): string =>
  text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`

// ✅ Generate slug từ tên tiếng Việt
export const toSlug = (str: string): string =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

// ✅ Debounce (cho search input)
export const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// ✅ Validate email
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// ✅ Validate SĐT Việt Nam
export const isValidPhone = (phone: string): boolean =>
  /^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone)
