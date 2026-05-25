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
        <Link href={`/category/${cat.slug}`} className="eyebrow text-electric hover:underline">
          {cat.title}
        </Link>
      )}
      {cat && <span aria-hidden className="text-hairline-strong">·</span>}
      <time dateTime={isoDate(article.publishedDate)} className="num">
        {formatDate(article.publishedDate)}
      </time>
      {showReadingTime && (
        <>
          <span aria-hidden className="text-hairline-strong">·</span>
          <span className="num">{readingTime(article.content)} min</span>
        </>
      )}
    </div>
  )
}
