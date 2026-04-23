import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useLogin } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ROUTES } from '@/constants'

export const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const { mutate: login, isPending } = useLogin()
  const location = useLocation()

  const validate = () => {
    const newErrors: Partial<typeof form> = {}
    if (!form.email) newErrors.email = 'Vui lòng nhập email'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email không hợp lệ'
    if (!form.password) newErrors.password = 'Vui lòng nhập mật khẩu'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) login(form)
  }

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.HOME

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <Link to={ROUTES.HOME} className="text-2xl font-bold text-primary-600">
              Shop<span className="text-gray-800">VN</span>
            </Link>
            <h1 className="mt-4 text-xl font-bold text-gray-800">Đăng nhập</h1>
            <p className="mt-1 text-sm text-gray-500">
              {from !== ROUTES.HOME && 'Đăng nhập để tiếp tục'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              leftAddon={<Mail className="h-4 w-4" />}
              required
            />

            <Input
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              leftAddon={<Lock className="h-4 w-4" />}
              rightAddon={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              required
            />

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg" loading={isPending}>
              Đăng nhập
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Chưa có tài khoản?{' '}
            <Link to={ROUTES.REGISTER} className="font-medium text-primary-600 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
