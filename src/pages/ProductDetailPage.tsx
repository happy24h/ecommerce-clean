import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ShoppingCart, ExternalLink, Download, Play,
  Minus, Plus, ChevronRight, Tag, Package,
} from 'lucide-react'
import { useProduct, useRelatedProducts } from '@/hooks/useProducts'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils'
import { Skeleton } from '@/components/ui'
import { ProductCard } from '@/components/product/ProductCard'

export const ProductDetailPage = () => {
  const { id = '' } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const { data: product, isLoading, isError } = useProduct(id)
  const { data: related } = useRelatedProducts(
    product?.categoryId ?? '',
    product?._id ?? ''
  )
  const addItem = useCartStore((s) => s.addItem)

  if (isLoading) return <ProductDetailSkeleton />

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <p className="text-gray-500">Không tìm thấy sản phẩm</p>
        <Link to="/products" className="text-sm text-primary-600 hover:underline">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    )
  }

  const images = product.images ?? []
  const isDigital = !!product.sourceFileUrl
  const outOfStock = !isDigital && product.stock === 0
  console.log('Related products:', product)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-400">
        <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/products" className="hover:text-primary-600">Sản phẩm</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-600 line-clamp-1">{product.title}</span>
      </nav>

      {/* Main */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

        {/* Ảnh */}
        <div className="flex flex-col gap-3">
          <div className="overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="h-96 w-full object-contain p-6"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-gray-50
                    transition-colors ${selectedImage === i
                      ? 'border-primary-500'
                      : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <img src={img} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Thông tin */}
        <div className="flex flex-col gap-5">

          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-snug">{product.title}</h1>
            {product.version && (
              <p className="mt-1 text-sm text-gray-400">Phiên bản {product.version}</p>
            )}
          </div>

          {/* Giá */}
          <span className="text-3xl font-bold text-primary-600">{formatPrice(product.price)}</span>

          {/* Tech stack — digital */}
          {isDigital && product.techStack && product.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.techStack.map((tech) => (
                <span
                  key={tech}
                  className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1
                    text-xs font-medium text-gray-700"
                >
                  <Tag className="h-3 w-3" /> {tech}
                </span>
              ))}
            </div>
          )}

          {/* Tồn kho — physical */}
          {!isDigital && (
            <p className={`text-sm font-medium ${outOfStock ? 'text-red-500' : 'text-green-600'}`}>
              <Package className="inline h-4 w-4 mr-1" />
              {outOfStock ? 'Hết hàng' : `Còn ${product.stock} sản phẩm`}
            </p>
          )}

          {/* Chọn số lượng — physical */}
          {!isDigital && !outOfStock && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Số lượng</span>
              <div className="flex items-center rounded-lg border border-gray-300">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-9 w-9 items-center justify-center text-gray-500
                    hover:text-primary-600 disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="flex h-9 w-9 items-center justify-center text-gray-500
                    hover:text-primary-600 disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Nút hành động */}
          {isDigital ? (
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => addItem(product, 1)}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary-600
                  py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" /> Mua ngay
              </button>
              <div className="flex gap-2">
                {product.demoUrl && (
                  <a
                    href={product.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border
                      border-gray-300 py-2.5 text-sm font-medium text-gray-700
                      hover:border-primary-400 hover:text-primary-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" /> Xem demo
                  </a>
                )}
                {product.videoUrl && (
                  <a
                    href={product.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border
                      border-gray-300 py-2.5 text-sm font-medium text-gray-700
                      hover:border-primary-400 hover:text-primary-600 transition-colors"
                  >
                    <Play className="h-4 w-4" /> Video giới thiệu
                  </a>
                )}
              </div>
            </div>
          ) : (
            <button
              disabled={outOfStock}
              onClick={() => addItem(product, quantity)}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-primary-600
                py-3 text-sm font-semibold text-primary-600 hover:bg-primary-50
                disabled:border-gray-200 disabled:cursor-not-allowed disabled:text-gray-400
                transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              {outOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
            </button>
          )}

          {/* Metadata — physical (nếu có) */}
          {!isDigital && product.metadata && Object.keys(product.metadata).length > 0 && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Thông số
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {Object.entries(product.metadata).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-500 capitalize">{key}</span>
                    <span className="font-medium text-gray-800">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nguồn tải — digital (sau khi mua) */}
          {isDigital && product.sourceFileUrl && (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-primary-300
              bg-primary-50 p-4">
              <Download className="h-5 w-5 text-primary-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-primary-700">File nguồn có sẵn</p>
                <p className="text-xs text-primary-500">Nhận link tải sau khi thanh toán</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mô tả */}
      <section className="rounded-xl border border-gray-100 p-6">
        <h2 className="mb-3 text-base font-bold text-gray-800">Mô tả sản phẩm</h2>
        <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
          {product.description}
        </p>
      </section>

      {/* Sản phẩm liên quan */}
      {related && related.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-bold text-gray-800">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

const ProductDetailSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-6">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Skeleton className="h-96 rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  </div>
)
