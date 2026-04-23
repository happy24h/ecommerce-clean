import { ProductCard, ProductCardSkeleton } from './ProductCard'
import { EmptyState } from '@/components/ui'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'

interface ProductGridProps {
  products?: Product[]
  isLoading?: boolean
  skeletonCount?: number
  emptyTitle?: string
  emptyDescription?: string
}

export const ProductGrid = ({
  products,
  isLoading = false,
  skeletonCount = 8,
  emptyTitle = 'Không có sản phẩm',
  emptyDescription = 'Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.',
}: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-8 w-8" />}
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
