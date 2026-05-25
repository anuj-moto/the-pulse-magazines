import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Article, Magazine } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/content/SectionHeading'
import { HeadlineRow } from '@/components/content/HeadlineRow'
import { PayloadImage } from '@/components/content/PayloadImage'
import { Reveal } from '@/components/motion/Reveal'
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
      <Container className="py-16 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Latest issue */}
          {magazine && (
            <Reveal className="lg:col-span-4">
              <SectionHeading
                eyebrow="On the Cover · 02"
                title="Latest Issue"
                href="/magazine"
                linkLabel="All issues"
              />
              <Link
                href={`/magazine/${magazine.slug}`}
                className="group mt-8 block"
              >
                <div className="overflow-hidden rounded-sharp border border-hairline">
                  <PayloadImage
                    media={magazine.coverImage}
                    ratio="3 / 4"
                    sizes="(min-width:1024px) 320px, 80vw"
                    className="transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
                  />
                </div>
                <p className="eyebrow mt-5 text-faint">
                  {formatMonth(magazine.issueDate)}
                </p>
                <h3 className="mt-2 font-serif text-xl leading-snug font-normal tracking-[-0.012em] transition-colors group-hover:text-electric">
                  {magazine.title}
                </h3>
              </Link>
            </Reveal>
          )}

          {/* Top headlines */}
          {headlines.length > 0 && (
            <Reveal
              delay={2}
              className={magazine ? 'lg:col-span-8' : 'lg:col-span-12'}
            >
              <SectionHeading
                eyebrow="The Brief · 03"
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
                className="group mt-2 inline-flex items-center gap-2 text-sm font-medium hover:text-electric"
              >
                More stories
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  )
}
