import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useCurrentUser } from '@/hooks/useAuth'
import { useCreateOrder } from '@/hooks/useOrders'
import { formatPrice } from '@/utils'
import { Button } from '@/components/ui/Button'
import { PAYMENT_METHOD_LABEL } from '@/constants'
import type { Order } from '@/types'

export const CheckoutPage = () => {
  const { items, totalPrice } = useCartStore()
  const { data: user } = useCurrentUser()
  const { mutate: createOrder, isPending } = useCreateOrder()

  const defaultAddress = user?.addresses.find((a) => a.isDefault) ?? user?.addresses[0]

  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(
    defaultAddress?._id
  )
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('cod')
  const [note, setNote] = useState('')

  const subtotal = totalPrice()
  const shippingFee = subtotal >= 300000 ? 0 : 30000
  const total = subtotal + shippingFee

  const handleSubmit = () => {
    createOrder({ paymentMethod, note: note || undefined })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-6 text-xl font-bold text-gray-800">Thanh toán</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left: address + payment */}
        <div className="space-y-5 lg:col-span-3">
          {/* Delivery address */}
          <section className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="mb-3 flex items-center justify-between text-base font-semibold text-gray-800">
              Địa chỉ giao hàng
              <button className="text-xs text-primary-600 hover:underline">+ Thêm địa chỉ</button>
            </h2>
            {user?.addresses.length ? (
              <div className="space-y-2">
                {user.addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-colors ${
                      selectedAddressId === addr._id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr._id}
                      checked={selectedAddressId === addr._id}
                      onChange={() => setSelectedAddressId(addr._id)}
                      className="mt-0.5 accent-primary-600"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-gray-800">
                        {addr.fullName} · {addr.phone}
                        {addr.isDefault && (
                          <span className="ml-1 rounded-sm bg-primary-100 px-1 py-0.5 text-xs text-primary-700">
                            Mặc định
                          </span>
                        )}
                      </p>
                      <p className="text-gray-500">
                        {addr.street}, {addr.ward}, {addr.district}, {addr.province}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Chưa có địa chỉ. Vui lòng thêm địa chỉ giao hàng.</p>
            )}
          </section>

          {/* Payment method */}
          <section className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="mb-3 text-base font-semibold text-gray-800">Phương thức thanh toán</h2>
            <div className="space-y-2">
              {(Object.keys(PAYMENT_METHOD_LABEL) as Order['paymentMethod'][]).map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-colors ${
                    paymentMethod === method
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="accent-primary-600"
                  />
                  <span className="text-sm text-gray-700">{PAYMENT_METHOD_LABEL[method]}</span>
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
            disabled={items.length === 0}
            onClick={handleSubmit}
            rightIcon={<ChevronRight className="h-4 w-4" />}
          >
            Xác nhận đặt hàng
          </Button>

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
