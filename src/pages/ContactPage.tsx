import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { contactApi } from '@/api/contactApi'
import toast from 'react-hot-toast'

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: 'Địa chỉ',
    value: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
  },
  {
    icon: Phone,
    label: 'Điện thoại',
    value: '0909 123 456',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'support@shopvn.com',
  },
  {
    icon: Clock,
    label: 'Giờ làm việc',
    value: 'Thứ 2 – Thứ 6: 8:00 – 17:30',
  },
]

export const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const { mutate, isPending } = useMutation({
    mutationFn: contactApi.sendContact,
    onSuccess: () => {
      toast.success('Gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.')
      setForm({ name: '', email: '', phone: '', message: '' })
      setErrors({})
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      const msg = err?.response?.data?.message ?? 'Gửi thất bại, vui lòng thử lại.'
      toast.error(msg)
    },
  })

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên'
    if (!form.email.trim()) e.email = 'Vui lòng nhập email'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ'
    if (!form.message.trim()) e.message = 'Vui lòng nhập nội dung'
    else if (form.message.trim().length < 10) e.message = 'Nội dung phải có ít nhất 10 ký tự'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    mutate({ name: form.name, email: form.email, phone: form.phone || undefined, message: form.message })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-xs text-gray-400">
        <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-600">Liên hệ</span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold text-gray-900">Liên hệ với chúng tôi</h1>
      <p className="mb-10 text-sm text-gray-500">
        Có câu hỏi hoặc cần hỗ trợ? Chúng tôi luôn sẵn sàng lắng nghe bạn.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

        {/* Contact info */}
        <div className="lg:col-span-2 space-y-4">
          {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <Icon className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-gray-800">{value}</p>
              </div>
            </div>
          ))}

          {/* Map embed */}
          <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
            <iframe
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197883!2d106.70094807480804!3d10.777887089378268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a6df0a74!2zTmd1eeG7hW4gSHXhu4csIFF14bqtbiAxLCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1714000000000"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-base font-bold text-gray-800">Gửi tin nhắn</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Họ và tên"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  error={errors.name}
                  required
                />
                <Input
                  label="Số điện thoại"
                  placeholder="0909 123 456"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
                required
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Nhập nội dung tin nhắn..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-1 transition-colors
                    ${errors.message
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                )}
              </div>

              <Button type="submit" size="lg" loading={isPending} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Gửi tin nhắn
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
