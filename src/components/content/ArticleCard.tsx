import Link from 'next/link'
import type { Article } from '@/payload-types'
import { PayloadImage } from './PayloadImage'
import { ArticleMeta } from './ArticleMeta'
import { primaryCategory } from '@/lib/content'
import { cn } from '@/lib/utils'

type Variant = 'standard' | 'compact'

/** Vertical article card used across grids and listings. */
export function ArticleCard({
  article,
  variant = 'standard',
  priority = false,
  className,
}: {
  article: Article
  variant?: Variant
  priority?: boolean
  className?: string
}) {
  const href = `/${article.slug}`
  const cat = primaryCategory(article)

  if (variant === 'compact') {
    return (
      <article className={cn('group flex gap-4', className)}>
        <Link href={href} className="shrink-0">
          <PayloadImage
            media={article.featuredImage}
            ratio="1 / 1"
            sizes="96px"
            className="w-24 rounded-sharp"
          />
        </Link>
        <div className="min-w-0">
          {cat && <p className="eyebrow text-crimson">{cat.title}</p>}
          <h3 className="mt-1 font-serif text-base leading-snug font-semibold">
            <Link href={href} className="transition-colors group-hover:text-crimson">
              {article.title}
            </Link>
          </h3>
          <ArticleMeta article={article} showCategory={false} className="mt-1.5" />
        </div>
      </article>
    )
  }

  return (
    <article className={cn('group flex flex-col', className)}>
      <Link href={href} className="block">
        <PayloadImage
          media={article.featuredImage}
          ratio="16 / 11"
          priority={priority}
          sizes="(min-width:1024px) 360px, (min-width:640px) 45vw, 90vw"
          className="rounded-sharp transition-[filter] duration-300 group-hover:brightness-[0.97]"
        />
      </Link>
      <div className="mt-4 flex flex-1 flex-col">
        {cat && (
          <Link href={`/category/${cat.slug}`} className="eyebrow text-crimson hover:underline">
            {cat.title}
          </Link>
        )}
        <h3 className="mt-2 font-serif text-xl leading-snug font-semibold tracking-tight">
          <Link href={href} className="transition-colors group-hover:text-crimson">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {article.excerpt}
        </p>
        <ArticleMeta article={article} showCategory={false} className="mt-3" />
      </div>
    </article>
  )
}
