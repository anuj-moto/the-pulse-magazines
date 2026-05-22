import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Article, Magazine } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/content/SectionHeading'
import { HeadlineRow } from '@/components/content/HeadlineRow'
import { PayloadImage } from '@/components/content/PayloadImage'
import { formatMonth } from '@/lib/format'

/** Two-column band: latest magazine issue + top headlines list. */
export function LatestIssueHeadlines({
  magazine,
  headlines,
}: {
  magazine: Magazine | null
  headlines: Article[]
}) {
  if (!magazine && headlines.length === 0) return null

  return (
    <section className="border-y border-hairline bg-paper-dim">
      <Container className="py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Latest issue */}
          {magazine && (
            <div className="lg:col-span-4">
              <SectionHeading
                eyebrow="On the cover"
                title="Latest Issue"
                href="/magazine"
                linkLabel="All issues"
              />
              <Link
                href={`/magazine/${magazine.slug}`}
                className="group mt-8 block"
              >
                <PayloadImage
                  media={magazine.coverImage}
                  ratio="3 / 4"
                  sizes="(min-width:1024px) 320px, 80vw"
                  className="rounded-sharp border border-hairline transition-transform duration-300 group-hover:-translate-y-1"
                />
                <p className="eyebrow mt-4 text-faint">
                  {formatMonth(magazine.issueDate)}
                </p>
                <h3 className="mt-1.5 font-serif text-xl leading-snug font-semibold tracking-tight transition-colors group-hover:text-crimson">
                  {magazine.title}
                </h3>
              </Link>
            </div>
          )}

          {/* Top headlines */}
          {headlines.length > 0 && (
            <div className={magazine ? 'lg:col-span-8' : 'lg:col-span-12'}>
              <SectionHeading
                eyebrow="The brief"
                title="Top Headlines"
                href="/category/news"
              />
              <div className="mt-4">
                {headlines.map((article, i) => (
                  <HeadlineRow key={article.id} article={article} index={i} />
                ))}
              </div>
              <Link
                href="/blog"
                className="group mt-2 inline-flex items-center gap-2 text-sm font-medium hover:text-crimson"
              >
                More stories
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
