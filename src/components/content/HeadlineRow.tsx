import Link from 'next/link'
import type { Article } from '@/payload-types'
import { ArticleMeta } from './ArticleMeta'

/** Numbered, image-free headline row — used in the Top Headlines list. */
export function HeadlineRow({ article, index }: { article: Article; index: number }) {
  return (
    <article className="group flex gap-4 border-b border-hairline py-4 last:border-0">
      <span className="font-serif text-2xl leading-none font-semibold text-hairline">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <h3 className="font-serif text-lg leading-snug font-semibold tracking-tight">
          <Link href={`/${article.slug}`} className="transition-colors group-hover:text-crimson">
            {article.title}
          </Link>
        </h3>
        <ArticleMeta article={article} className="mt-1.5" />
      </div>
    </article>
  )
}
