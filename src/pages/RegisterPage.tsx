import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useRegister } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ROUTES } from '@/constants'

export const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const { mutate: register, isPending } = useRegister()

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.name.trim())          e.name = 'Vui lòng nhập họ tên'
    if (!form.email)                e.email = 'Vui lòng nhập email'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ'
    if (!form.password)             e.password = 'Vui lòng nhập mật khẩu'
    else if (form.password.length < 8) e.password = 'Mật khẩu tối thiểu 8 ký tự'
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Mật khẩu xác nhận không khớp'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) register(form)
  }

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value })

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <Link to={ROUTES.HOME} className="text-2xl font-bold text-primary-600">
              Shop<span className="text-gray-800">VN</span>
            </Link>
            <h1 className="mt-4 text-xl font-bold text-gray-800">Tạo tài khoản</h1>
            <p className="mt-1 text-sm text-gray-500">Miễn phí, chỉ mất vài giây</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              value={form.name}
              onChange={update('name')}
              error={errors.name}
              leftAddon={<User className="h-4 w-4" />}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={update('email')}
              error={errors.email}
              leftAddon={<Mail className="h-4 w-4" />}
              required
            />
            <Input
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder="Tối thiểu 8 ký tự"
              value={form.password}
              onChange={update('password')}
              error={errors.password}
              leftAddon={<Lock className="h-4 w-4" />}
              rightAddon={
                <button type="button" onClick={() => setShowPassword((s) => !s)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              required
            />
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              error={errors.confirmPassword}
              leftAddon={<Lock className="h-4 w-4" />}
              required
            />

            <p className="text-xs text-gray-400">
              Bằng cách đăng ký, bạn đồng ý với{' '}
              <Link to="/terms" className="text-primary-600 hover:underline">Điều khoản</Link>
              {' '}và{' '}
              <Link to="/privacy" className="text-primary-600 hover:underline">Chính sách bảo mật</Link>
              {' '}của chúng tôi.
            </p>

            <Button type="submit" fullWidth size="lg" loading={isPending}>
              Tạo tài khoản
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Đã có tài khoản?{' '}
            <Link to={ROUTES.LOGIN} className="font-medium text-primary-600 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
