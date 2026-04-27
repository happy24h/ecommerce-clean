import { Link } from 'react-router-dom'
import { ShoppingCart, Heart } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice } from '@/utils'
import { useCartStore } from '@/store/cartStore'
import { useToggleWishlist } from '@/hooks/useWishlist'
import { Skeleton } from '@/components/ui'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((s) => s.addItem)
  const { mutate: toggleWishlist } = useToggleWishlist()
  const isDigital = !!product.sourceFileUrl
  const outOfStock = !isDigital && product.stock === 0

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white
      shadow-sm transition-shadow duration-200 hover:shadow-md">

      {/* Wishlist button */}
      <button
        onClick={(e) => { e.preventDefault(); toggleWishlist(product._id) }}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full
          bg-white/80 text-gray-400 opacity-0 shadow-sm backdrop-blur-sm transition-all
          group-hover:opacity-100 hover:text-red-500"
      >
        <Heart className="h-4 w-4" />
      </button>

      {/* Image */}
      <Link to={`/products/${product._id}`} className="block overflow-hidden bg-gray-50">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-52 w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link
          to={`/products/${product._id}`}
          className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-primary-600 leading-snug"
        >
          {product.title}
        </Link>

        {isDigital && product.version && (
          <p className="text-xs text-gray-400">v{product.version}</p>
        )}

        {!isDigital && (
          <p className={`text-xs font-medium ${outOfStock ? 'text-red-500' : 'text-green-600'}`}>
            {outOfStock ? 'Hết hàng' : `Còn ${product.stock} cái`}
          </p>
        )}

        <div className="mt-auto">
          <span className="text-base font-bold text-primary-600">{formatPrice(product.price)}</span>
        </div>

        <button
          disabled={outOfStock}
          onClick={() => addItem(product)}
          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary-50
            py-2 text-xs font-medium text-primary-600 transition-colors
            hover:bg-primary-600 hover:text-white disabled:cursor-not-allowed
            disabled:bg-gray-100 disabled:text-gray-400"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {outOfStock ? 'Hết hàng' : isDigital ? 'Mua ngay' : 'Thêm vào giỏ'}
        </button>
      </div>
    </div>
  )
}

export const ProductCardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white">
    <Skeleton className="h-52 w-full rounded-none" />
    <div className="flex flex-col gap-2 p-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-28 mt-1" />
      <Skeleton className="h-8 w-full mt-1" />
    </div>
  </div>
)
