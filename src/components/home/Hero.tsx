import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Article } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { PayloadImage } from '@/components/content/PayloadImage'
import { ArticleMeta } from '@/components/content/ArticleMeta'
import { primaryCategory } from '@/lib/content'

/** Lead-story hero. */
export function Hero({ article }: { article: Article }) {
  const href = `/${article.slug}`
  const cat = primaryCategory(article)

  return (
    <section className="border-b border-hairline">
      <Container className="grid items-center gap-8 py-10 lg:grid-cols-12 lg:gap-12 lg:py-16">
        <Link href={href} className="group block lg:col-span-7">
          <PayloadImage
            media={article.featuredImage}
            ratio="16 / 10"
            priority
            sizes="(min-width:1024px) 680px, 100vw"
            className="rounded-sharp transition-[filter] duration-300 group-hover:brightness-[0.97]"
          />
        </Link>

        <div className="flex flex-col lg:col-span-5">
          <p className="eyebrow text-crimson">{cat ? cat.title : 'Featured'}</p>
          <h1 className="mt-3 font-serif text-[2rem] leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.9rem]">
            <Link href={href} className="transition-colors hover:text-crimson">
              {article.title}
            </Link>
          </h1>
          <p className="mt-4 line-clamp-3 text-lg leading-relaxed text-muted">
            {article.excerpt}
          </p>
          <ArticleMeta
            article={article}
            showCategory={false}
            showReadingTime
            className="mt-5"
          />
          <Link
            href={href}
            className="group mt-6 inline-flex items-center gap-2 self-start border-b-2 border-ink pb-1 text-sm font-medium transition-colors hover:border-crimson hover:text-crimson"
          >
            Read the full story
            <ArrowRight
              size={15}
              strokeWidth={2}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </Container>
    </section>
  )
}
