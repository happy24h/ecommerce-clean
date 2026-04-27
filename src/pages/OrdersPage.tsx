import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, ChevronRight } from 'lucide-react'
import { useMyOrders } from '@/hooks/useOrders'
import { formatPrice, formatDate } from '@/utils'
import { ORDER_STATUS_LABEL } from '@/constants'
import { Spinner, EmptyState, Badge } from '@/components/ui'
import type { OrderStatus } from '@/types'

const STATUS_TABS: { label: string; value: OrderStatus | undefined }[] = [
  { label: 'Tất cả',          value: undefined },
  { label: 'Chờ thanh toán',  value: 'PENDING' },
  { label: 'Đã thanh toán',   value: 'PAID' },
  { label: 'Đang giao',       value: 'SHIPPING' },
  { label: 'Đã giao',         value: 'DELIVERED' },
  { label: 'Đã hủy',          value: 'CANCELLED' },
]

const STATUS_BADGE: Record<OrderStatus, 'warning' | 'success' | 'info' | 'danger'> = {
  PENDING:   'warning',
  PAID:      'success',
  SHIPPING:  'info',
  DELIVERED: 'success',
  CANCELLED: 'danger',
}

export const OrdersPage = () => {
  const [activeStatus, setActiveStatus] = useState<OrderStatus | undefined>(undefined)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useMyOrders(page, activeStatus)

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-xl font-bold text-gray-800">Đơn hàng của tôi</h1>

      {/* Status tabs */}
      <div className="mb-4 flex overflow-x-auto border-b border-gray-200">
        {STATUS_TABS.map((tab) => (
          <button
            key={String(tab.value)}
            onClick={() => { setActiveStatus(tab.value); setPage(1) }}
            className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeStatus === tab.value
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : !data?.data.length ? (
        <EmptyState
          icon={<Package className="h-8 w-8" />}
          title="Chưa có đơn hàng nào"
          description="Đặt mua sản phẩm để thấy đơn hàng của bạn ở đây."
          action={<Link to="/products" className="text-sm text-primary-600 hover:underline">Mua ngay</Link>}
        />
      ) : (
        <div className="space-y-3">
          {data.data.map((order) => (
            <Link
              key={order._id}
              to={`/account/orders/${order._id}`}
              className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white
                p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
                <ShoppingBag className="h-7 w-7 text-gray-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">
                      {order.items[0]?.title}
                      {order.items.length > 1 && (
                        <span className="text-gray-400"> +{order.items.length - 1} sản phẩm</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <Badge variant={STATUS_BADGE[order.status]}>
                    {ORDER_STATUS_LABEL[order.status]}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary-600">
                    {formatPrice(order.totalAmount)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}

          {data.meta.totalPages > 1 && (
            <div className="flex justify-center gap-1 pt-4">
              {Array.from({ length: data.meta.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium ${
                    page === i + 1
                      ? 'bg-primary-600 text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
