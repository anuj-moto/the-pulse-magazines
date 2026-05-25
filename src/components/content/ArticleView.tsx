import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Article, Author, Tag } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { PayloadImage } from './PayloadImage'
import { RichTextRenderer } from './RichTextRenderer'
import { ShareButtons } from './ShareButtons'
import { ArticleCard } from './ArticleCard'
import { Reveal } from '@/components/motion/Reveal'
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
    <article className="py-12 sm:py-20">
      {/* Header */}
      <Container className="max-w-[780px]">
        {cat && (
          <Link
            href={`/category/${cat.slug}`}
            className="eyebrow text-electric hover:underline"
          >
            {cat.title}
          </Link>
        )}
        <h1 className="mt-5 font-serif text-[2.2rem] leading-[1.06] font-normal tracking-[-0.022em] text-balance sm:text-[3rem] lg:text-[3.4rem]">
          {article.title}
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-muted">{article.excerpt}</p>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-y border-hairline py-5">
          <p className="text-sm">
            {author && <span className="font-medium text-ink">By {author.name}</span>}
            <span className="text-faint">
              {author && ' · '}
              <time className="num" dateTime={isoDate(article.publishedDate)}>
                {formatDate(article.publishedDate)}
              </time>
              {' · '}
              <span className="num">{mins} min read</span>
            </span>
          </p>
          <ShareButtons url={url} title={article.title} />
        </div>
      </Container>

      {/* Featured image */}
      {cover && (
        <Container className="mt-10 max-w-[1080px]">
          <PayloadImage
            media={cover}
            ratio="16 / 9"
            priority
            sizes="(min-width:1024px) 1080px, 100vw"
            className="rounded-sharp"
          />
          {cover.caption && (
            <p className="mt-3 text-xs text-faint">{cover.caption}</p>
          )}
        </Container>
      )}

      {/* Body */}
      <Container className="mt-12 max-w-[720px] sm:mt-16">
        <RichTextRenderer data={article.content} dropCap />

        {tags.length > 0 && (
          <div className="mt-14 flex flex-wrap gap-2 border-t border-hairline pt-7">
            {tags.slice(0, 14).map((t) => (
              <Link
                key={t.id}
                href={`/tag/${t.slug}`}
                className="rounded-sharp border border-hairline px-3 py-1.5 text-xs text-muted transition-all duration-200 hover:-translate-y-px hover:border-electric hover:text-electric"
              >
                {t.title}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-hairline pt-7">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium hover:text-electric"
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
        <Container className="mt-20 sm:mt-28">
          <Reveal>
            <h2 className="border-b border-hairline-strong pb-4 font-serif text-[1.75rem] font-normal tracking-[-0.018em]">
              Related Stories
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a, i) => (
              <Reveal key={a.id} delay={i} as="article">
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        </Container>
      )}
    </article>
  )
}
