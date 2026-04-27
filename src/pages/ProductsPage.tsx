import { useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useQuery } from '@tanstack/react-query'
import { categoryApi } from '@/api'
import { QUERY_KEYS, SORT_OPTIONS, DEFAULT_PAGE_SIZE } from '@/constants'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Skeleton } from '@/components/ui'
import type { ProductFilter } from '@/types'

const PRICE_RANGES = [
  { label: 'Dưới 100K',        min: 0,       max: 100000   },
  { label: '100K – 500K',       min: 100000,  max: 500000   },
  { label: '500K – 1 triệu',    min: 500000,  max: 1000000  },
  { label: '1 triệu – 5 triệu', min: 1000000, max: 5000000  },
  { label: 'Trên 5 triệu',      min: 5000000, max: undefined },
]

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentFilter: ProductFilter = {
    categoryId: searchParams.get('categoryId') ?? undefined,
    minPrice:   searchParams.get('minPrice')   ? Number(searchParams.get('minPrice'))   : undefined,
    maxPrice:   searchParams.get('maxPrice')   ? Number(searchParams.get('maxPrice'))   : undefined,
    sort:       (searchParams.get('sort') as ProductFilter['sort']) || 'popular',
    search:     searchParams.get('q') || undefined,
    page:       Number(searchParams.get('page')) || 1,
    limit:      DEFAULT_PAGE_SIZE,
  }

  const { data, isLoading, isFetching } = useProducts(currentFilter)

  const { data: categories, isLoading: catsLoading } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: categoryApi.getCategories,
    staleTime: 1000 * 60 * 15,
  })

  const updateFilter = useCallback(
    (updates: Partial<ProductFilter>) => {
      const next = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null) next.delete(key)
        else next.set(key, String(value))
      })
      next.set('page', '1')
      setSearchParams(next)
    },
    [searchParams, setSearchParams]
  )

  const totalPages = data?.meta.totalPages || 1
  const currentPage = currentFilter.page || 1

  const activePriceRange = PRICE_RANGES.find(
    (r) => r.min === currentFilter.minPrice && r.max === currentFilter.maxPrice
  )

  const pageTitle = currentFilter.search
    ? `Kết quả cho "${currentFilter.search}"`
    : currentFilter.categoryId
      ? (categories?.find((c) => c._id === currentFilter.categoryId)?.name ?? 'Sản phẩm')
      : 'Tất cả sản phẩm'

  return (
    <div>
      {/* Banner */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-700 to-primary-500 p-8 md:p-12">
          <div className="relative z-10 max-w-lg">
            <nav className="mb-3 flex items-center gap-1 text-xs text-primary-200">
              <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white font-medium">Sản phẩm</span>
            </nav>
            <h1 className="text-2xl font-bold leading-snug text-white md:text-3xl">{pageTitle}</h1>
            <p className="mt-2 text-sm text-primary-100">
              Khám phá hàng ngàn sản phẩm chính hãng, giao hàng nhanh toàn quốc.
            </p>
            {data && (
              <p className="mt-3 inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-medium text-white">
                {data.meta.total} sản phẩm
              </p>
            )}
          </div>
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 right-24 h-40 w-40 rounded-full bg-white/10" />
        </section>
      </div>

    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex gap-6">

        {/* ── Sidebar ── */}
        <aside className="hidden lg:block w-56 flex-shrink-0 space-y-6">

          {/* Danh mục */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-gray-800">Danh mục</h3>
            <div className="space-y-0.5">
              {catsLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full rounded-lg" />
                  ))
                : (
                  <>
                    <button
                      onClick={() => updateFilter({ categoryId: undefined })}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        !currentFilter.categoryId
                          ? 'bg-primary-50 font-semibold text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Tất cả danh mục
                    </button>
                    {categories?.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => updateFilter({ categoryId: cat._id })}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          currentFilter.categoryId === cat._id
                            ? 'bg-primary-50 font-semibold text-primary-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </>
                )
              }
            </div>
          </div>

          {/* Khoảng giá */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-gray-800">Khoảng giá</h3>
            <div className="space-y-0.5">
              <button
                onClick={() => updateFilter({ minPrice: undefined, maxPrice: undefined })}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  !activePriceRange
                    ? 'bg-primary-50 font-semibold text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Tất cả mức giá
              </button>
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.label}
                  onClick={() => updateFilter({ minPrice: range.min, maxPrice: range.max })}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    activePriceRange?.label === range.label
                      ? 'bg-primary-50 font-semibold text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* Toolbar */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {isFetching && !isLoading && (
                <span className="text-sm text-primary-500">Đang cập nhật...</span>
              )}
            </div>

            {/* Sort — mobile categories dropdown */}
            <div className="flex items-center gap-2">
              {/* Category select — mobile only */}
              <div className="relative lg:hidden">
                <select
                  value={currentFilter.categoryId || ''}
                  onChange={(e) => updateFilter({ categoryId: e.target.value || undefined })}
                  className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8
                    text-sm text-gray-700 focus:border-primary-500 focus:outline-none"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={currentFilter.sort || 'popular'}
                  onChange={(e) => updateFilter({ sort: e.target.value as ProductFilter['sort'] })}
                  className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8
                    text-sm text-gray-700 focus:border-primary-500 focus:outline-none"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Grid */}
          <ProductGrid
            products={data?.data}
            isLoading={isLoading}
            emptyTitle="Không tìm thấy sản phẩm"
            emptyDescription="Thử thay đổi danh mục hoặc từ khóa tìm kiếm."
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateFilter({ page: i + 1 })}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1
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

      </div>
    </div>
    </div>
  )
}
