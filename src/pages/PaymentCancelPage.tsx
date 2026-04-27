import { Link } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const PaymentCancelPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <XCircle className="h-10 w-10 text-red-500" />
      </div>

      <h1 className="mt-6 text-2xl font-bold text-gray-800">Thanh toán bị hủy</h1>
      <p className="mt-2 text-gray-500">
        Bạn đã hủy quá trình thanh toán. Đơn hàng vẫn được lưu với trạng thái chờ thanh toán.
      </p>

      <p className="mt-3 max-w-sm text-sm text-gray-400">
        Bạn có thể vào mục Đơn hàng để thực hiện thanh toán lại hoặc hủy đơn.
      </p>

      <div className="mt-8 flex gap-3">
        <Link to="/account/orders">
          <Button variant="primary">Xem đơn hàng của tôi</Button>
        </Link>
        <Link to="/cart">
          <Button variant="outline">Quay lại giỏ hàng</Button>
        </Link>
      </div>
    </div>
  )
}
