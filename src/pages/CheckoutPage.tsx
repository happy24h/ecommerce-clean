import { useState } from 'react'
import { ChevronRight, QrCode, Wallet, Building2, Truck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useCreateOrder } from '@/hooks/useOrders'
import { formatPrice } from '@/utils'
import { Button } from '@/components/ui/Button'
import type { PaymentMethod } from '@/types'

const PAYMENT_OPTIONS: {
  method: PaymentMethod
  label: string
  desc: string
  icon: React.ReactNode
  disabled?: boolean
}[] = [
  {
    method: 'COD',
    label: 'Thanh toán khi nhận hàng',
    desc: 'Trả tiền mặt khi nhận được hàng',
    icon: <Truck className="h-5 w-5 text-orange-500" />,
  },
  {
    method: 'PAYOS',
    label: 'PayOS',
    desc: 'Sắp ra mắt',
    icon: <QrCode className="h-5 w-5 text-gray-300" />,
    disabled: true,
  },
  {
    method: 'MOMO',
    label: 'Ví MoMo',
    desc: 'Sắp ra mắt',
    icon: <Wallet className="h-5 w-5 text-gray-300" />,
    disabled: true,
  },
  {
    method: 'BANK_TRANSFER',
    label: 'Chuyển khoản ngân hàng',
    desc: 'Sắp ra mắt',
    icon: <Building2 className="h-5 w-5 text-gray-300" />,
    disabled: true,
  },
]

export const CheckoutPage = () => {
  const { items, totalPrice } = useCartStore()
  const { mutate: createOrder, isPending } = useCreateOrder()

  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD')
  const [note, setNote] = useState('')

  const subtotal = totalPrice()
  const shippingFee = subtotal >= 300000 ? 0 : 30000
  const total = subtotal + shippingFee

  const isAddressValid =
    shippingAddress.name.trim() &&
    shippingAddress.phone.trim() &&
    shippingAddress.address.trim()

  const handleChange = (field: keyof typeof shippingAddress) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setShippingAddress((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = () => {
    createOrder({
      paymentMethod,
      shippingAddress,
      shippingFee,
      note: note || undefined,
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-6 text-xl font-bold text-gray-800">Thanh toán</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left */}
        <div className="space-y-5 lg:col-span-3">
          {/* Shipping address */}
          <section className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="mb-4 text-base font-semibold text-gray-800">Địa chỉ giao hàng</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Họ tên người nhận <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shippingAddress.name}
                  onChange={handleChange('name')}
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm
                    placeholder:text-gray-400 focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={handleChange('phone')}
                  placeholder="0901 234 567"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm
                    placeholder:text-gray-400 focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Địa chỉ giao hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shippingAddress.address}
                  onChange={handleChange('address')}
                  placeholder="123 Trần Thái Tông, Cầu Giấy, Hà Nội"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm
                    placeholder:text-gray-400 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Payment method */}
          <section className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="mb-3 text-base font-semibold text-gray-800">Phương thức thanh toán</h2>
            <div className="space-y-2">
              {PAYMENT_OPTIONS.map(({ method, label, desc, icon, disabled }) => (
                <label
                  key={method}
                  className={`flex items-center gap-3 rounded-lg border-2 p-3 transition-colors ${
                    disabled
                      ? 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-50'
                      : paymentMethod === method
                        ? 'cursor-pointer border-primary-500 bg-primary-50'
                        : 'cursor-pointer border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    disabled={disabled}
                    onChange={() => setPaymentMethod(method)}
                    className="accent-primary-600"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50">
                      {icon}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-800'}`}>
                        {label}
                      </p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </div>
                  {disabled && (
                    <span className="flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
                      Sắp ra mắt
                    </span>
                  )}
                </label>
              ))}
            </div>
          </section>

          {/* Note */}
          <section className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="mb-3 text-base font-semibold text-gray-800">Ghi chú đơn hàng</h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú cho người bán (không bắt buộc)"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm
                placeholder:text-gray-400 focus:border-primary-500 focus:outline-none"
            />
          </section>
        </div>

        {/* Right: order summary */}
        <div className="h-fit rounded-xl border border-gray-100 bg-white p-5 space-y-4 lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-800">
            Đơn hàng ({items.length} sản phẩm)
          </h2>

          <div className="max-h-48 space-y-2 overflow-y-auto">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-2 text-sm">
                <img
                  src={item.product.images[0]}
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-lg border border-gray-100 object-contain bg-gray-50"
                />
                <div className="flex-1 min-w-0">
                  <p className="line-clamp-1 text-gray-700">{item.product.title}</p>
                  <p className="text-gray-400">x{item.quantity}</p>
                </div>
                <span className="font-medium text-gray-800">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Vận chuyển</span>
              {shippingFee === 0
                ? <span className="text-green-600 font-medium">Miễn phí</span>
                : <span>{formatPrice(shippingFee)}</span>}
            </div>
          </div>

          <div className="flex justify-between border-t border-gray-100 pt-3 font-bold">
            <span>Tổng tiền</span>
            <span className="text-lg text-primary-600">{formatPrice(total)}</span>
          </div>

          <Button
            fullWidth
            size="lg"
            loading={isPending}
            disabled={items.length === 0 || !isAddressValid}
            onClick={handleSubmit}
            rightIcon={<ChevronRight className="h-4 w-4" />}
          >
            Xác nhận đặt hàng
          </Button>

          {!isAddressValid && (
            <p className="text-center text-xs text-red-400">Vui lòng điền đầy đủ địa chỉ giao hàng</p>
          )}

          <p className="text-center text-xs text-gray-400">
            Bằng cách đặt hàng, bạn đồng ý với{' '}
            <a href="/terms" className="text-primary-600 hover:underline">Điều khoản</a>
            {' '}của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  )
}
