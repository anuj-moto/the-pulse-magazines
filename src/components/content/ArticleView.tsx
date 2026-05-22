import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Article, Author, Tag } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { PayloadImage } from './PayloadImage'
import { RichTextRenderer } from './RichTextRenderer'
import { ShareButtons } from './ShareButtons'
import { ArticleCard } from './ArticleCard'
import { primaryCategory, asMedia } from '@/lib/content'
import { formatDate, isoDate, readingTime } from '@/lib/format'
import { SITE } from '@/lib/site'

/** Full article reading view. */
export function ArticleView({
  article,
  related,
}: {
  article: Article
  related: Article[]
}) {
  const cat = primaryCategory(article)
  const author =
    article.author && typeof article.author === 'object'
      ? (article.author as Author)
      : null
  const tags = (article.tags ?? []).filter(
    (t): t is Tag => Boolean(t) && typeof t === 'object',
  )
  const cover = asMedia(article.featuredImage)
  const url = `${SITE.url}/${article.slug}`
  const mins = readingTime(article.content)

  return (
    <article className="py-10 sm:py-14">
      {/* Header */}
      <Container className="max-w-[760px]">
        {cat && (
          <Link
            href={`/category/${cat.slug}`}
            className="eyebrow text-crimson hover:underline"
          >
            {cat.title}
          </Link>
        )}
        <h1 className="mt-4 font-serif text-[2.1rem] leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.9rem]">
          {article.title}
        </h1>
        <p className="mt-5 text-xl leading-relaxed text-muted">{article.excerpt}</p>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-y border-hairline py-4">
          <p className="text-sm">
            {author && <span className="font-medium text-ink">By {author.name}</span>}
            <span className="text-faint">
              {author && ' · '}
              <time dateTime={isoDate(article.publishedDate)}>
                {formatDate(article.publishedDate)}
              </time>
              {' · '}
              {mins} min read
            </span>
          </p>
          <ShareButtons url={url} title={article.title} />
        </div>
      </Container>

      {/* Featured image */}
      {cover && (
        <Container className="mt-8 max-w-[980px]">
          <PayloadImage
            media={cover}
            ratio="16 / 9"
            priority
            sizes="(min-width:1024px) 980px, 100vw"
            className="rounded-sharp"
          />
          {cover.caption && (
            <p className="mt-2.5 text-xs text-faint">{cover.caption}</p>
          )}
        </Container>
      )}

      {/* Body */}
      <Container className="mt-10 max-w-[720px] sm:mt-12">
        <RichTextRenderer data={article.content} dropCap />

        {tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2 border-t border-hairline pt-6">
            {tags.slice(0, 14).map((t) => (
              <Link
                key={t.id}
                href={`/tag/${t.slug}`}
                className="rounded-sharp border border-hairline px-2.5 py-1 text-xs text-muted transition-colors hover:border-ink hover:text-ink"
              >
                {t.title}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-hairline pt-6">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium hover:text-crimson"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            All stories
          </Link>
          <ShareButtons url={url} title={article.title} />
        </div>
      </Container>

      {/* Related */}
      {related.length > 0 && (
        <Container className="mt-16 sm:mt-24">
          <h2 className="border-b border-ink pb-3 font-serif text-2xl font-semibold tracking-tight">
            Related Stories
          </h2>
          <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </Container>
      )}
    </article>
  )
}
