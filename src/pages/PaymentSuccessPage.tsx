import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const orderCode = searchParams.get('orderCode')
  const clearCart = useCartStore((s) => s.clearCart)

  // Xóa cart local khi user redirect về sau thanh toán thành công.
  // Backend đã xóa server-side cart qua webhook.
  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <h1 className="mt-6 text-2xl font-bold text-gray-800">Thanh toán thành công!</h1>
      <p className="mt-2 text-gray-500">
        Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
      </p>

      {orderCode && (
        <p className="mt-1 text-sm text-gray-400">
          Mã giao dịch: <span className="font-mono font-medium text-gray-600">{orderCode}</span>
        </p>
      )}

      <p className="mt-3 max-w-sm text-sm text-gray-400">
        Trạng thái đơn hàng sẽ được cập nhật tự động sau khi PayOS xác nhận.
      </p>

      <div className="mt-8 flex gap-3">
        <Link to="/account/orders">
          <Button variant="primary">Xem đơn hàng của tôi</Button>
        </Link>
        <Link to="/products">
          <Button variant="outline">Tiếp tục mua sắm</Button>
        </Link>
      </div>
    </div>
  )
}
