import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Article } from '@/payload-types'
import { getTagBySlug, getArticles, PAGE_SIZE } from '@/lib/queries'
import { Container } from '@/components/layout/Container'
import { ArchiveHeader } from '@/components/content/ArchiveHeader'
import { ArticleGrid } from '@/components/content/ArticleGrid'
import { Pagination } from '@/components/content/Pagination'

export const revalidate = 300

type Params = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tag = await getTagBySlug(slug)
  if (!tag) return { title: 'Not found' }
  // Tag archives are thin — keep them out of the index.
  return { title: `${tag.title} — Topic`, robots: { index: false, follow: true } }
}

export default async function TagPage({ params, searchParams }: Params) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const tag = await getTagBySlug(slug)
  if (!tag) notFound()

  const page = Math.max(1, Number(pageParam) || 1)
  const res = await getArticles({ tagId: tag.id, page, limit: PAGE_SIZE })

  return (
    <Container className="py-12 sm:py-16">
      <ArchiveHeader
        eyebrow="Topic"
        title={tag.title}
        description={`Stories tagged “${tag.title}”.`}
        count={res.totalDocs}
      />
      {res.docs.length > 0 ? (
        <>
          <ArticleGrid articles={res.docs as Article[]} className="mt-10" />
          <Pagination
            page={page}
            totalPages={res.totalPages}
            basePath={`/tag/${tag.slug}`}
          />
        </>
      ) : (
        <p className="mt-10 text-muted">No stories with this tag yet.</p>
      )}
    </Container>
  )
}
