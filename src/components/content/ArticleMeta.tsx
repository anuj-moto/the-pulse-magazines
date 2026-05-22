import Link from 'next/link'
import type { Article } from '@/payload-types'
import { formatDate, isoDate, readingTime } from '@/lib/format'
import { primaryCategory } from '@/lib/content'
import { cn } from '@/lib/utils'

/** Category · date · reading-time line for articles. */
export function ArticleMeta({
  article,
  showReadingTime = false,
  showCategory = true,
  className,
}: {
  article: Article
  showReadingTime?: boolean
  showCategory?: boolean
  className?: string
}) {
  const cat = showCategory ? primaryCategory(article) : null

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-faint',
        className,
      )}
    >
      {cat && (
        <Link href={`/category/${cat.slug}`} className="eyebrow text-crimson hover:underline">
          {cat.title}
        </Link>
      )}
      {cat && <span aria-hidden className="text-hairline">·</span>}
      <time dateTime={isoDate(article.publishedDate)}>
        {formatDate(article.publishedDate)}
      </time>
      {showReadingTime && (
        <>
          <span aria-hidden className="text-hairline">·</span>
          <span>{readingTime(article.content)} min read</span>
        </>
      )}
    </div>
  )
}
