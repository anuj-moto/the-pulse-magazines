import type { Article } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/content/SectionHeading'
import { ArticleCard } from '@/components/content/ArticleCard'
import { Reveal } from '@/components/motion/Reveal'

/** Curated grid of standout articles. */
export function EditorsChoice({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null

  return (
    <section>
      <Container className="py-16 sm:py-24">
        <Reveal>
          <SectionHeading eyebrow="Curated · 01" title="Editor's Choice" href="/blog" />
        </Reveal>
        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <Reveal key={article.id} delay={i} as="article">
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
