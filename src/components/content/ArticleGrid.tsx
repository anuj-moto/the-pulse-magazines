import type { Article } from '@/payload-types'
import { ArticleCard } from './ArticleCard'
import { cn } from '@/lib/utils'

/** Responsive 3-up grid of article cards. */
export function ArticleGrid({
  articles,
  className,
}: {
  articles: Article[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {articles.map((article, i) => (
        <ArticleCard key={article.id} article={article} priority={i < 3} />
      ))}
    </div>
  )
}
