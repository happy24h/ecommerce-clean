import { Trash2, Minus, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CartItem as CartItemType } from '@/types'
import { formatPrice } from '@/utils'
import { useCartStore } from '@/store/cartStore'

interface CartItemProps {
  item: CartItemType
}

export const CartItemRow = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCartStore()
  const { product, quantity } = item

  return (
    <div className="flex gap-4 py-4">
      {/* Image */}
      <Link to={`/products/${product._id}`} className="flex-shrink-0">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-20 w-20 rounded-lg border border-gray-100 object-contain bg-gray-50 p-1"
        />
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <Link
          to={`/products/${product._id}`}
          className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-primary-600"
        >
          {product.title}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2">
          {/* Quantity controls */}
          <div className="flex items-center rounded-lg border border-gray-200">
            <button
              onClick={() => updateQuantity(product._id, quantity - 1)}
              className="flex h-7 w-7 items-center justify-center text-gray-500 hover:text-primary-600
                disabled:cursor-not-allowed disabled:opacity-40"
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => updateQuantity(product._id, quantity + 1)}
              className="flex h-7 w-7 items-center justify-center text-gray-500 hover:text-primary-600
                disabled:cursor-not-allowed disabled:opacity-40"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price */}
          <span className="text-sm font-bold text-primary-600">
            {formatPrice(product.price * quantity)}
          </span>

          {/* Remove */}
          <button
            onClick={() => removeItem(product._id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
