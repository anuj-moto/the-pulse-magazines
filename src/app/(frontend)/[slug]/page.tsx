import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getArticleBySlug,
  getRelatedArticles,
  getPageBySlug,
  getAllArticleSlugs,
} from '@/lib/queries'
import { getPayloadClient } from '@/lib/payload'
import { ArticleView } from '@/components/content/ArticleView'
import { PageView } from '@/components/content/PageView'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildMetadata, mediaUrl } from '@/lib/seo'
import { articleSchema } from '@/lib/jsonld'

export const revalidate = 300

type Params = { params: Promise<{ slug: string }> }

/** Pre-render every article and standalone page. */
export async function generateStaticParams() {
  const articleSlugs = await getAllArticleSlugs()
  const payload = await getPayloadClient()
  const pages = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    depth: 0,
    limit: 100,
    pagination: false,
    select: { slug: true },
  })
  return [
    ...articleSlugs.map((slug) => ({ slug })),
    ...pages.docs.map((p) => ({ slug: p.slug as string })),
  ]
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params

  const article = await getArticleBySlug(slug)
  if (article) {
    return buildMetadata({
      title: article.seo?.metaTitle || article.title,
      description: article.seo?.metaDescription || article.excerpt,
      path: `/${article.slug}`,
      image: mediaUrl(article.seo?.ogImage) || mediaUrl(article.featuredImage),
      type: 'article',
      publishedTime: article.publishedDate || undefined,
    })
  }

  const page = await getPageBySlug(slug)
  if (page) {
    return buildMetadata({
      title: page.seo?.metaTitle || page.title,
      description: page.seo?.metaDescription || page.subtitle,
      path: `/${page.slug}`,
      image: mediaUrl(page.seo?.ogImage),
    })
  }

  return { title: 'Not found', robots: { index: false } }
}

/** Resolves to an article, then a standalone page, then 404. */
export default async function SlugPage({ params }: Params) {
  const { slug } = await params

  const article = await getArticleBySlug(slug)
  if (article) {
    const related = await getRelatedArticles(article, 3)
    return (
      <>
        <JsonLd data={articleSchema(article)} />
        <ArticleView article={article} related={related} />
      </>
    )
  }

  const page = await getPageBySlug(slug)
  if (page) {
    return <PageView page={page} />
  }

  notFound()
}
