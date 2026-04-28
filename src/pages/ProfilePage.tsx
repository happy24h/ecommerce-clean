import { useState, useRef, useEffect } from 'react'
import { Camera, Lock, User as UserIcon, MapPin } from 'lucide-react'
import { useIsAuthenticated, useUpdateProfile, useChangePassword } from '@/hooks/useAuth'
import { filesApi } from '@/api'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui'
import toast from 'react-hot-toast'

// ─── Avatar Upload ────────────────────────────────────────────────────────────

const AvatarSection = ({
  avatar,
  name,
  onUploaded,
}: {
  avatar?: string
  name?: string
  onUploaded: (url: string) => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh tối đa 5MB')
      return
    }
    setUploading(true)
    try {
      const url = await filesApi.upload(file)
      onUploaded(url)
    } catch {
      toast.error('Upload ảnh thất bại.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative cursor-pointer group"
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md bg-primary-100">
          {avatar ? (
            <img src={avatar} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-primary-600">
              {name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center rounded-full
          bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
          {uploading
            ? <Spinner size="sm" className="border-white border-t-transparent" />
            : <Camera className="h-6 w-6 text-white" />
          }
        </div>
      </div>

      <p className="text-xs text-gray-400">Nhấn vào ảnh để thay đổi</p>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}

// ─── Profile Form ─────────────────────────────────────────────────────────────

const ProfileForm = () => {
  const { user } = useIsAuthenticated()
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const [form, setForm] = useState({
    name: '',
    address: '',
    gender: '' as 'MALE' | 'FEMALE' | 'OTHER' | '',
    avatar: '',
  })

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? '',
        address: user.address ?? '',
        gender: user.gender ?? '',
        avatar: user.avatar ?? '',
      })
    }
  }, [user])

  const handleAvatarUploaded = (url: string) => {
    const next = { ...form, avatar: url }
    setForm(next)
    updateProfile({ avatar: url })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Họ tên không được để trống.')
      return
    }
    updateProfile({
      name: form.name.trim(),
      address: form.address.trim() || undefined,
      gender: form.gender || undefined,
      avatar: form.avatar || undefined,
    })
  }

  const field = (label: string, icon: React.ReactNode, children: React.ReactNode) => (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
        {icon}
        {label}
      </label>
      {children}
    </div>
  )

  const inputCls = `w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm
    placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-100
    disabled:bg-gray-50 disabled:text-gray-400`

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 space-y-6">
      <AvatarSection
        avatar={form.avatar}
        name={form.name}
        onUploaded={handleAvatarUploaded}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {field('Họ và tên', <UserIcon className="h-3.5 w-3.5" />,
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Nguyễn Văn A"
            className={inputCls}
          />
        )}

        {field('Email', null,
          <input
            value={user?.email ?? ''}
            disabled
            className={inputCls}
          />
        )}

        {field('Địa chỉ', <MapPin className="h-3.5 w-3.5" />,
          <input
            value={form.address}
            onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
            placeholder="Số nhà, đường, quận, thành phố..."
            className={inputCls}
          />
        )}

        {field('Giới tính', null,
          <div className="flex gap-3">
            {(['MALE', 'FEMALE', 'OTHER'] as const).map((val) => (
              <label
                key={val}
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 py-2 text-sm font-medium transition-colors ${
                  form.gender === val
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={val}
                  checked={form.gender === val}
                  onChange={() => setForm((p) => ({ ...p, gender: val }))}
                  className="sr-only"
                />
                {val === 'MALE' ? 'Nam' : val === 'FEMALE' ? 'Nữ' : 'Khác'}
              </label>
            ))}
          </div>
        )}

        <Button type="submit" fullWidth loading={isPending} className="mt-2">
          Lưu thay đổi
        </Button>
      </form>
    </div>
  )
}

// ─── Change Password Form ─────────────────────────────────────────────────────

const ChangePasswordForm = () => {
  const { mutate: changePassword, isPending } = useChangePassword()
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.newPassword.length < 6) {
      toast.error('Mật khẩu mới tối thiểu 6 ký tự.')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Xác nhận mật khẩu không khớp.')
      return
    }
    changePassword(
      { currentPassword: form.currentPassword, newPassword: form.newPassword },
      {
        onSuccess: () =>
          setForm({ currentPassword: '', newPassword: '', confirmPassword: '' }),
      }
    )
  }

  const inputCls = `w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm
    placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-100`

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <div className="mb-5 flex items-center gap-2">
        <Lock className="h-4 w-4 text-gray-500" />
        <h2 className="text-base font-semibold text-gray-800">Đổi mật khẩu</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600">
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))}
            placeholder="••••••••"
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600">
            Mật khẩu mới
          </label>
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
            placeholder="Tối thiểu 6 ký tự"
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600">
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
            placeholder="••••••••"
            className={inputCls}
          />
        </div>

        <Button
          type="submit"
          fullWidth
          loading={isPending}
          disabled={!form.currentPassword || !form.newPassword || !form.confirmPassword}
        >
          Đổi mật khẩu
        </Button>
      </form>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const ProfilePage = () => {
  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-xl font-bold text-gray-800">Tài khoản của tôi</h1>
      <div className="space-y-4">
        <ProfileForm />
        <ChangePasswordForm />
      </div>
    </div>
  )
}
