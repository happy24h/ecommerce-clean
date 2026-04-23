import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { CartItemRow } from '@/components/cart/CartItem'
import { formatPrice } from '@/utils'
import { Button, EmptyState } from '@/components/ui'
import { ROUTES } from '@/constants'

export const CartPage = () => {
  const { items, totalItems, totalPrice, clearCart } = useCartStore()

  const subtotal = totalPrice()
  const shippingFee = subtotal >= 300000 ? 0 : 30000
  const total = subtotal + shippingFee

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8" />}
          title="Giỏ hàng của bạn đang trống"
          description="Hãy thêm sản phẩm vào giỏ hàng để tiến hành thanh toán."
          action={
            <Link to={ROUTES.PRODUCTS}>
              <Button leftIcon={<ArrowRight className="h-4 w-4" />}>
                Tiếp tục mua sắm
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          Giỏ hàng <span className="text-base font-normal text-gray-400">({totalItems()} sản phẩm)</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:underline"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Items list */}
        <div className="lg:col-span-2">
          <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white px-4">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} />
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="h-fit rounded-xl border border-gray-100 bg-white p-5 space-y-4">
          <h2 className="text-base font-bold text-gray-800">Tóm tắt đơn hàng</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển</span>
              {shippingFee === 0
                ? <span className="text-green-600 font-medium">Miễn phí</span>
                : <span>{formatPrice(shippingFee)}</span>
              }
            </div>
            {shippingFee > 0 && (
              <p className="text-xs text-gray-400">
                Mua thêm {formatPrice(300000 - subtotal)} để được miễn phí vận chuyển
              </p>
            )}
          </div>

          <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold">
            <span>Tổng cộng</span>
            <span className="text-primary-600">{formatPrice(total)}</span>
          </div>

          {/* Coupon */}
          <div className="flex gap-2">
            <input
              placeholder="Mã giảm giá"
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm
                focus:border-primary-500 focus:outline-none"
            />
            <button className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium
              text-gray-700 hover:bg-gray-200">
              Áp dụng
            </button>
          </div>

          <Link to={ROUTES.CHECKOUT} className="block">
            <Button fullWidth size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Đặt hàng
            </Button>
          </Link>

          <Link
            to={ROUTES.PRODUCTS}
            className="block text-center text-sm text-primary-600 hover:underline"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  )
}
