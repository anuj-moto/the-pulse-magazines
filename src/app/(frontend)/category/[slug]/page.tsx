import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Article } from '@/payload-types'
import {
  getCategoryBySlug,
  getAllCategories,
  getArticles,
  PAGE_SIZE,
} from '@/lib/queries'
import { Container } from '@/components/layout/Container'
import { buildMetadata } from '@/lib/seo'
import { ArchiveHeader } from '@/components/content/ArchiveHeader'
import { ArticleGrid } from '@/components/content/ArticleGrid'
import { Pagination } from '@/components/content/Pagination'

export const revalidate = 300

type Params = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((c) => ({ slug: c.slug as string }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'Not found', robots: { index: false } }
  return buildMetadata({
    title: category.title,
    description: category.description || `Articles filed under ${category.title}.`,
    path: `/category/${category.slug}`,
  })
}

export default async function CategoryPage({ params, searchParams }: Params) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const page = Math.max(1, Number(pageParam) || 1)
  const res = await getArticles({ categoryId: category.id, page, limit: PAGE_SIZE })

  return (
    <Container className="py-12 sm:py-16">
      <ArchiveHeader
        eyebrow="Section"
        title={category.title}
        description={category.description}
        count={res.totalDocs}
      />
      {res.docs.length > 0 ? (
        <>
          <ArticleGrid articles={res.docs as Article[]} className="mt-10" />
          <Pagination
            page={page}
            totalPages={res.totalPages}
            basePath={`/category/${category.slug}`}
          />
        </>
      ) : (
        <p className="mt-10 text-muted">No stories in this section yet.</p>
      )}
    </Container>
  )
}
