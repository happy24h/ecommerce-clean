import { useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useQuery } from '@tanstack/react-query'
import { categoryApi } from '@/api'
import { QUERY_KEYS, SORT_OPTIONS, DEFAULT_PAGE_SIZE } from '@/constants'
import { ProductGrid } from '@/components/product/ProductGrid'
import type { ProductFilter } from '@/types'

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilter, setShowFilter] = useState(false)

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

  const { data: categories } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: categoryApi.getCategories,
    staleTime: 1000 * 60 * 15,
  })

  const updateFilter = useCallback(
    (updates: Partial<ProductFilter>) => {
      const next = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          next.delete(key)
        } else {
          next.set(key, String(value))
        }
      })
      next.set('page', '1')
      setSearchParams(next)
    },
    [searchParams, setSearchParams]
  )

  const totalPages = data?.meta.totalPages || 1
  const currentPage = currentFilter.page || 1

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            {currentFilter.search
              ? `Kết quả cho "${currentFilter.search}"`
              : 'Tất cả sản phẩm'}
          </h1>
          {data && (
            <p className="text-sm text-gray-500">
              {data.meta.total} sản phẩm
              {isFetching && !isLoading && (
                <span className="ml-2 text-primary-500">Đang cập nhật...</span>
              )}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
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
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4
              -translate-y-1/2 text-gray-400" />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilter((o) => !o)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2
              text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <SlidersHorizontal className="h-4 w-4" /> Lọc
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filter */}
        {showFilter && (
          <aside className="w-56 flex-shrink-0 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-800">Danh mục</h3>
              <div className="space-y-1">
                <button
                  onClick={() => updateFilter({ categoryId: undefined })}
                  className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                    !currentFilter.categoryId
                      ? 'bg-primary-50 font-medium text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Tất cả
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateFilter({ categoryId: cat._id })}
                    className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                      currentFilter.categoryId === cat._id
                        ? 'bg-primary-50 font-medium text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-800">Khoảng giá</h3>
              <div className="space-y-2">
                {[
                  { label: 'Dưới 100K',         min: 0,       max: 100000 },
                  { label: '100K – 500K',        min: 100000,  max: 500000 },
                  { label: '500K – 1 triệu',     min: 500000,  max: 1000000 },
                  { label: '1 triệu – 5 triệu',  min: 1000000, max: 5000000 },
                  { label: 'Trên 5 triệu',       min: 5000000, max: undefined },
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() =>
                      updateFilter({ minPrice: range.min, maxPrice: range.max })
                    }
                    className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                      currentFilter.minPrice === range.min &&
                      currentFilter.maxPrice === range.max
                        ? 'bg-primary-50 font-medium text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Product grid */}
        <div className="flex-1">
          <ProductGrid
            products={data?.data}
            isLoading={isLoading}
            emptyTitle="Không tìm thấy sản phẩm"
            emptyDescription="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
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
  )
}
