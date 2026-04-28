import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Package, CreditCard, FileText } from 'lucide-react'
import { useOrderDetail } from '@/hooks/useOrders'
import { formatPrice, formatDate } from '@/utils'
import { ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL } from '@/constants'
import { Spinner, Badge } from '@/components/ui'
import type { OrderStatus } from '@/types'

const STATUS_BADGE: Record<OrderStatus, 'warning' | 'success' | 'info' | 'danger'> = {
  PENDING:   'warning',
  PAID:      'success',
  SHIPPING:  'info',
  DELIVERED: 'success',
  CANCELLED: 'danger',
}

const STATUS_STEPS: OrderStatus[] = ['PENDING', 'PAID', 'SHIPPING', 'DELIVERED']

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading, isError } = useOrderDetail(id ?? '')

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-gray-500">Không tìm thấy đơn hàng.</p>
        <Link to="/account/orders" className="text-sm text-primary-600 hover:underline">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    )
  }

  const stepIndex = STATUS_STEPS.indexOf(order.status)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/account/orders"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Đơn hàng của tôi
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-700 truncate">#{order._id.slice(-8).toUpperCase()}</span>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h1>
        <Badge variant={STATUS_BADGE[order.status]}>
          {ORDER_STATUS_LABEL[order.status]}
        </Badge>
      </div>

      {/* Progress tracker (only for non-cancelled orders) */}
      {!isCancelled && (
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, idx) => (
              <div key={step} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      idx <= stepIndex
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className={`text-xs ${idx <= stepIndex ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
                    {ORDER_STATUS_LABEL[step]}
                  </span>
                </div>
                {idx < STATUS_STEPS.length - 1 && (
                  <div
                    className={`mx-1 mb-4 flex-1 border-t-2 transition-colors ${
                      idx < stepIndex ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Order items */}
        <section className="rounded-xl border border-gray-100 bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Package className="h-4 w-4 text-gray-500" />
            Sản phẩm ({order.items.length})
          </h2>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 truncate">{item.title}</p>
                  <p className="text-xs text-gray-400">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <span className="flex-shrink-0 font-semibold text-gray-800">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Tạm tính</span>
              <span>{formatPrice(order.totalAmount - (order.shippingFee ?? 0))}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Phí vận chuyển</span>
              {(order.shippingFee ?? 0) === 0
                ? <span className="text-green-600 font-medium">Miễn phí</span>
                : <span>{formatPrice(order.shippingFee)}</span>
              }
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-base">
              <span>Tổng tiền</span>
              <span className="text-primary-600">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Shipping address */}
          {order.shippingAddress && (
            <section className="rounded-xl border border-gray-100 bg-white p-5">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                <MapPin className="h-4 w-4 text-gray-500" />
                Địa chỉ giao hàng
              </h2>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-800">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.address}</p>
              </div>
            </section>
          )}

          {/* Payment & order info */}
          <section className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
              <CreditCard className="h-4 w-4 text-gray-500" />
              Thông tin thanh toán
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Phương thức</span>
                <span className="font-medium text-gray-800">
                  {PAYMENT_METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ngày đặt</span>
                <span className="font-medium text-gray-800">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Mã đơn hàng</span>
                <span className="font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Note */}
        {order.note && (
          <section className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
              <FileText className="h-4 w-4 text-gray-500" />
              Ghi chú
            </h2>
            <p className="text-sm text-gray-600">{order.note}</p>
          </section>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link to="/account/orders" className="text-sm text-primary-600 hover:underline">
          Xem tất cả đơn hàng
        </Link>
      </div>
    </div>
  )
}
