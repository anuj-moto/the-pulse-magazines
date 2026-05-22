import type { Article } from '@/payload-types'
import { buildMetadata } from '@/lib/seo'
import { getArticles, PAGE_SIZE } from '@/lib/queries'
import { Container } from '@/components/layout/Container'
import { ArchiveHeader } from '@/components/content/ArchiveHeader'
import { ArticleGrid } from '@/components/content/ArticleGrid'
import { Pagination } from '@/components/content/Pagination'

export const revalidate = 300

export const metadata = buildMetadata({
  title: 'All Stories',
  description:
    'Every article from The Pulse Magazines — business, leadership, innovation and the people redefining them.',
  path: '/blog',
})

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const res = await getArticles({ page, limit: PAGE_SIZE })

  return (
    <Container className="py-12 sm:py-16">
      <ArchiveHeader
        eyebrow="The Archive"
        title="All Stories"
        description="Journeys, strategies and ideas from the people redefining business, leadership and innovation."
        count={res.totalDocs}
      />
      {res.docs.length > 0 ? (
        <>
          <ArticleGrid articles={res.docs as Article[]} className="mt-10" />
          <Pagination page={page} totalPages={res.totalPages} basePath="/blog" />
        </>
      ) : (
        <p className="mt-10 text-muted">No stories found.</p>
      )}
    </Container>
  )
}
