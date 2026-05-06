import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, User, Tag } from 'lucide-react'
import parse, { type HTMLReactParserOptions, Element, domToReact } from 'html-react-parser'
import { usePost, usePosts } from '@/hooks/usePosts'
import { Skeleton } from '@/components/ui'

export const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: post, isLoading, isError } = usePost(id ?? '')
  const { data: related } = usePosts(1, 6)

  const parseOptions: HTMLReactParserOptions = useMemo(() => ({
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === 'pre') {
        return (
          <pre className="my-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm
            leading-relaxed text-gray-100 font-mono whitespace-pre">
            {domToReact(domNode.children as Parameters<typeof domToReact>[0])}
          </pre>
        )
      }
    },
  }), [])

  if (isLoading) return <DetailSkeleton />

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-gray-500">Không tìm thấy bài viết.</p>
        <Link to="/news" className="text-sm text-primary-600 hover:underline">
          Quay lại tin tức
        </Link>
      </div>
    )
  }

  const categoryName = typeof post.categoryId === 'object' ? post.categoryId.name : ''
  const date = new Date(post.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })

  const relatedPosts = related?.data.filter((p) => p._id !== post._id).slice(0, 5) ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">

        {/* Article */}
        <article className="min-w-0 flex-1 space-y-6">
          {/* Breadcrumb */}
          <Link
            to="/news"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Tin tức & Bài viết
          </Link>

          {/* Header */}
          <div className="space-y-4">
            {categoryName && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-50
                px-3 py-1 text-xs font-medium text-primary-600">
                <Tag className="h-3 w-3" />
                {categoryName}
              </span>
            )}
            <h1 className="text-2xl font-extrabold leading-tight text-gray-900 md:text-3xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 pb-4
              text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.createdBy.name}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {date}
              </span>
            </div>
          </div>

          {/* Cover image */}
          {post.image && (
            <div className="overflow-hidden rounded-xl">
              <img
                src={post.image}
                alt={post.title}
                className="h-[380px] w-full object-cover shadow-md"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-slate prose-lg max-w-none text-gray-700
            prose-headings:text-gray-900 prose-headings:leading-snug
            prose-p:leading-8 prose-p:my-4
            prose-li:leading-8 prose-li:my-1
            prose-a:text-primary-600
            prose-img:rounded-xl prose-code:text-primary-700">
            {post.description ? parse(post.description, parseOptions) : null}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="w-full lg:w-72 lg:flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="mb-4 text-base font-bold text-gray-800">Bài viết liên quan</h3>
            <div className="space-y-4">
              {relatedPosts.length === 0
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-20 w-20 flex-shrink-0 rounded-lg" />
                      <div className="flex-1 space-y-2 py-1">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                : relatedPosts.map((p) => (
                    <Link
                      key={p._id}
                      to={`/news/${p._id}`}
                      className="group flex gap-3"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="line-clamp-3 text-sm font-medium text-gray-700
                          leading-snug group-hover:text-primary-600 transition-colors">
                          {p.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(p.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}

const DetailSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-8">
    <div className="flex flex-col gap-8 lg:flex-row animate-pulse">
      <div className="flex-1 space-y-6">
        <Skeleton className="h-4 w-32" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-[380px] w-full rounded-xl" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? 'w-4/5' : 'w-full'}`} />
          ))}
        </div>
      </div>
      <div className="w-full lg:w-72 space-y-4">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-20 w-20 flex-shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2 py-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)
