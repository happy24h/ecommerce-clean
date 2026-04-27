import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, ChevronRight, HeartOff } from 'lucide-react'
import { useWishlist, useToggleWishlist } from '@/hooks/useWishlist'
import { useCartStore } from '@/store/cartStore'
import { Skeleton } from '@/components/ui'
import { formatPrice } from '@/utils'

export const WishlistPage = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useWishlist(page)
  const { mutate: toggle } = useToggleWishlist()
  const addItem = useCartStore((s) => s.addItem)

  const totalPages = data ? Math.ceil(data.meta.total / data.meta.pageSize) : 1

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <nav className="mb-4 flex items-center gap-1 text-xs text-gray-400">
        <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-600">Yêu thích</span>
      </nav>

      <div className="mb-6 flex items-center gap-2">
        <Heart className="h-5 w-5 text-primary-600" />
        <h1 className="text-xl font-bold text-gray-800">Sản phẩm yêu thích</h1>
        {data && (
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600">
            {data.meta.total}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <WishlistCardSkeleton key={i} />
          ))}
        </div>
      ) : !data?.result.length ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <HeartOff className="h-12 w-12 text-gray-300" />
          <p className="text-gray-400">Chưa có sản phẩm yêu thích</p>
          <Link
            to="/products"
            className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white
              hover:bg-primary-700 transition-colors"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {data.result.map(({ _id, productId: product }) => {
              const isDigital = !!product.sourceFileUrl
              const outOfStock = !isDigital && product.stock === 0
              return (
                <div
                  key={_id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100
                    bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Remove from wishlist */}
                  <button
                    onClick={() => toggle(product._id)}
                    className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center
                      rounded-full bg-white shadow-sm text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>

                  <Link to={`/products/${product._id}`} className="block overflow-hidden bg-gray-50">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-44 w-full object-contain p-3 transition-transform duration-300
                        group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col gap-2 p-3">
                    <Link
                      to={`/products/${product._id}`}
                      className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-primary-600 leading-snug"
                    >
                      {product.title}
                    </Link>

                    <span className="text-base font-bold text-primary-600">
                      {formatPrice(product.price)}
                    </span>

                    <button
                      disabled={outOfStock}
                      onClick={() => addItem(product as never, 1)}
                      className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-lg
                        bg-primary-50 py-2 text-xs font-medium text-primary-600 transition-colors
                        hover:bg-primary-600 hover:text-white disabled:cursor-not-allowed
                        disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {outOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
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
        </>
      )}
    </div>
  )
}

const WishlistCardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white">
    <Skeleton className="h-44 w-full rounded-none" />
    <div className="flex flex-col gap-2 p-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-5 w-24 mt-1" />
      <Skeleton className="h-8 w-full mt-1" />
    </div>
  </div>
)
