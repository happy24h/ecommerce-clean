import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Clock, User } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { usePosts } from '@/hooks/usePosts'
import { categoryApi } from '@/api'
import { QUERY_KEYS } from '@/constants'
import { Skeleton } from '@/components/ui'
import type { Post } from '@/types'

export const NewsPage = () => {
  const [page, setPage] = useState(1)
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>()

  const { data, isLoading } = usePosts(page, 9, activeCategoryId)

  const { data: categories, isLoading: catsLoading } = useQuery({
    queryKey: [QUERY_KEYS.POST_CATEGORIES],
    queryFn: categoryApi.getPostCategories,
    staleTime: 1000 * 60 * 15,
  })

  const totalPages = data?.meta.totalPages ?? 1

  const handleCategoryChange = (id?: string) => {
    setActiveCategoryId(id)
    setPage(1)
  }

  const activeCategory = categories?.find((c) => c._id === activeCategoryId)

  return (
    <div>
      {/* Banner */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-700 to-primary-500 p-8 md:p-12">
          <div className="relative z-10 max-w-lg">
            <nav className="mb-3 flex items-center gap-1 text-xs text-primary-200">
              <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white font-medium">Tin tức</span>
            </nav>
            <h1 className="text-2xl font-bold leading-snug text-white md:text-3xl">
              {activeCategory ? activeCategory.name : 'Tin tức & Bài viết'}
            </h1>
            <p className="mt-2 text-sm text-primary-100">
              Cập nhật những thông tin mới nhất về công nghệ, sản phẩm và xu hướng.
            </p>
            {data && (
              <p className="mt-3 inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-medium text-white">
                {data.meta.total} bài viết
              </p>
            )}
          </div>
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 right-24 h-40 w-40 rounded-full bg-white/10" />
        </section>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-gray-800">Danh mục</h3>
              <div className="space-y-0.5">
                {catsLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full rounded-lg" />
                    ))
                  : (
                    <>
                      <button
                        onClick={() => handleCategoryChange(undefined)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          !activeCategoryId
                            ? 'bg-primary-50 font-semibold text-primary-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Tất cả bài viết
                      </button>
                      {categories?.map((cat) => (
                        <button
                          key={cat._id}
                          onClick={() => handleCategoryChange(cat._id)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2
                            text-left text-sm transition-colors ${
                            activeCategoryId === cat._id
                              ? 'bg-primary-50 font-semibold text-primary-700'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span>{cat.name}</span>
                          {cat.totalPosts !== undefined && (
                            <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                              activeCategoryId === cat._id
                                ? 'bg-primary-100 text-primary-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {cat.totalPosts}
                            </span>
                          )}
                        </button>
                      ))}
                    </>
                  )
                }
              </div>
            </div>
          </aside>

          {/* Posts */}
          <div className="flex-1 min-w-0">
            {/* Mobile category select */}
            <div className="mb-4 lg:hidden">
              <select
                value={activeCategoryId || ''}
                onChange={(e) => handleCategoryChange(e.target.value || undefined)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm
                  text-gray-700 focus:border-primary-500 focus:outline-none"
              >
                <option value="">Tất cả bài viết</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {data?.data.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center gap-1">
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

        </div>
      </div>
    </div>
  )
}

const PostCard = ({ post }: { post: Post }) => {
  const categoryName = typeof post.categoryId === 'object' ? post.categoryId.name : ''
  const date = new Date(post.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })

  return (
    <Link
      to={`/news/${post._id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white
        shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="overflow-hidden bg-gray-50">
        <img
          src={post.image}
          alt={post.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {categoryName && (
          <span className="w-fit rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600">
            {categoryName}
          </span>
        )}

        <h2 className="line-clamp-2 text-sm font-semibold text-gray-800 leading-snug
          group-hover:text-primary-600 transition-colors">
          {post.title}
        </h2>

        <div className="mt-auto flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" /> {post.createdBy.name}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {date}
          </span>
        </div>
      </div>
    </Link>
  )
}

const PostCardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="flex flex-col gap-3 p-4">
      <Skeleton className="h-4 w-20 rounded-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-32 mt-1" />
    </div>
  </div>
)
