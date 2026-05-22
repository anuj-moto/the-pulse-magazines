import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { SITE } from '@/lib/site'

export const revalidate = 3600

/** Dynamic XML sitemap covering every public route. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const published = { _status: { equals: 'published' } }

  const [articles, magazines, categories, pages] = await Promise.all([
    payload.find({
      collection: 'articles',
      where: published,
      depth: 0,
      limit: 10000,
      pagination: false,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'magazines',
      where: published,
      depth: 0,
      limit: 10000,
      pagination: false,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 200,
      pagination: false,
      select: { slug: true },
    }),
    payload.find({
      collection: 'pages',
      where: published,
      depth: 0,
      limit: 200,
      pagination: false,
      select: { slug: true, updatedAt: true },
    }),
  ])

  const now = new Date()

  return [
    { url: SITE.url, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE.url}/magazine`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/contact`, changeFrequency: 'yearly', priority: 0.4 },
    ...articles.docs.map((a) => ({
      url: `${SITE.url}/${a.slug}`,
      lastModified: a.updatedAt ? new Date(a.updatedAt as string) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...magazines.docs.map((m) => ({
      url: `${SITE.url}/magazine/${m.slug}`,
      lastModified: m.updatedAt ? new Date(m.updatedAt as string) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...categories.docs.map((c) => ({
      url: `${SITE.url}/category/${c.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...pages.docs.map((p) => ({
      url: `${SITE.url}/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt as string) : now,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ]
}
