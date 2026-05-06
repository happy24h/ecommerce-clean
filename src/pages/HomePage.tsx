import { Link } from 'react-router-dom'
import { ArrowRight, Truck, RotateCcw, Shield, Headphones } from 'lucide-react'
import { useFeaturedProducts } from '@/hooks/useProducts'
import { useQuery } from '@tanstack/react-query'
import { categoryApi } from '@/api'
import { QUERY_KEYS } from '@/constants'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Skeleton } from '@/components/ui'

const benefits = [
  { icon: Truck,        title: 'Miễn phí vận chuyển', desc: 'Cho đơn hàng từ 300K' },
  { icon: RotateCcw,    title: 'Đổi trả dễ dàng',     desc: 'Trong vòng 30 ngày' },
  { icon: Shield,       title: 'Hàng chính hãng',      desc: '100% sản phẩm chính hãng' },
  { icon: Headphones,   title: 'Hỗ trợ 24/7',          desc: 'Tổng đài miễn phí' },
]

export const HomePage = () => {
  const { data: featured, isLoading: loadingFeatured } = useFeaturedProducts()

  const { data: categories, isLoading: loadingCats } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: categoryApi.getCategories,
    staleTime: 1000 * 60 * 15,
  })

  console.log('Featured products:', featured)
  console.log('Categories:', categories)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-700 to-primary-500 p-8 md:p-14">
        <div className="relative z-10 max-w-lg">
          <p className="text-sm font-medium uppercase tracking-widest text-primary-200">
            Flash Sale hôm nay
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-white md:text-4xl">
            Mua sắm thông minh,<br />tiết kiệm tối đa
          </h1>
          <p className="mt-3 text-primary-100">
            Giảm đến 50% hàng ngàn sản phẩm chính hãng. Giao hàng nhanh toàn quốc.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3
              text-sm font-semibold text-primary-700 shadow-md hover:shadow-lg transition-shadow"
          >
            Mua ngay <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 right-24 h-40 w-40 rounded-full bg-white/10" />
      </section>

      {/* Benefits */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {benefits.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center
              rounded-lg bg-primary-50 text-primary-600">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{title}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Danh mục nổi bật</h2>
          <Link to="/products" className="flex items-center gap-1 text-sm text-primary-600 hover:underline">
            Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {loadingCats
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))
            : categories && categories.length > 0 && categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/category/${cat.slug}`}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full
                    bg-gray-50 border-2 border-transparent group-hover:border-primary-400
                    transition-colors overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                  </div>
                  <span className="text-center text-xs font-medium text-gray-600 group-hover:text-primary-600">
                    {cat.name}
                  </span>
                </Link>
              ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Sản phẩm nổi bật</h2>
            <p className="text-sm text-gray-500">Được yêu thích nhất tuần qua</p>
          </div>
          <Link to="/products?sort=popular" className="flex items-center gap-1 text-sm text-primary-600 hover:underline">
            Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ProductGrid products={featured} isLoading={loadingFeatured} skeletonCount={8} />
      </section>
    </div>
  )
}
