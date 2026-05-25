import Link from 'next/link'
import type { Article } from '@/payload-types'
import { ArticleMeta } from './ArticleMeta'

/** Numbered, image-free headline row — used in the Top Headlines list. */
export function HeadlineRow({ article, index }: { article: Article; index: number }) {
  return (
    <article className="group flex gap-5 border-b border-hairline py-5 last:border-0">
      <span className="num text-base leading-none text-faint">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <h3 className="font-serif text-[1.1rem] leading-[1.25] font-normal tracking-[-0.012em]">
          <Link href={`/${article.slug}`} className="transition-colors group-hover:text-electric">
            {article.title}
          </Link>
        </h3>
        <ArticleMeta article={article} className="mt-2" />
      </div>
    </article>
  )
}
