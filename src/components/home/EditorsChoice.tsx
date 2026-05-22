import type { Article } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/content/SectionHeading'
import { ArticleCard } from '@/components/content/ArticleCard'

/** Curated grid of standout articles. */
export function EditorsChoice({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null

  return (
    <section>
      <Container className="py-14 sm:py-20">
        <SectionHeading eyebrow="Curated" title="Editor's Choice" href="/blog" />
        <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </Container>
    </section>
  )
}
