import type { Where } from 'payload'
import { getPayloadClient } from './payload'
import type { Article, Category, Magazine, Page, Tag, Testimonial } from '@/payload-types'

/** Default page size for article/magazine listings. */
export const PAGE_SIZE = 12

const PUBLISHED = { _status: { equals: 'published' } } as const

// ── Globals ──────────────────────────────────────────────────────────
export async function getSiteSettings() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
}

export async function getNavigation() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'navigation', depth: 0 })
}

// ── Articles ─────────────────────────────────────────────────────────
type ArticleQuery = {
  page?: number
  limit?: number
  categoryId?: number | string
  tagId?: number | string
  excludeIds?: (number | string)[]
}

export async function getArticles(opts: ArticleQuery = {}) {
  const payload = await getPayloadClient()
  const where: Where = { ...PUBLISHED }
  if (opts.categoryId != null) where.category = { in: [opts.categoryId] }
  if (opts.tagId != null) where.tags = { in: [opts.tagId] }
  if (opts.excludeIds?.length) where.id = { not_in: opts.excludeIds }

  return payload.find({
    collection: 'articles',
    where,
    sort: '-publishedDate',
    depth: 1,
    limit: opts.limit ?? PAGE_SIZE,
    page: opts.page ?? 1,
  })
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug }, ...PUBLISHED },
    depth: 2,
    limit: 1,
  })
  return (res.docs[0] as Article) ?? null
}

/** Articles sharing a category with the given one, newest first. */
export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const categoryIds = (article.category ?? [])
    .map((c) => (typeof c === 'object' ? c.id : c))
    .filter(Boolean)
  if (categoryIds.length === 0) return []

  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'articles',
    where: {
      category: { in: categoryIds },
      id: { not_equals: article.id },
      ...PUBLISHED,
    },
    sort: '-publishedDate',
    depth: 1,
    limit,
  })
  return res.docs as Article[]
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'articles',
    where: PUBLISHED,
    depth: 0,
    limit: 1000,
    pagination: false,
    select: { slug: true },
  })
  return res.docs.map((d) => d.slug as string).filter(Boolean)
}

// ── Magazines ────────────────────────────────────────────────────────
export async function getMagazines(opts: { page?: number; limit?: number } = {}) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'magazines',
    where: PUBLISHED,
    sort: '-issueDate',
    depth: 1,
    limit: opts.limit ?? PAGE_SIZE,
    page: opts.page ?? 1,
  })
}

export async function getMagazineBySlug(slug: string): Promise<Magazine | null> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'magazines',
    where: { slug: { equals: slug }, ...PUBLISHED },
    depth: 2,
    limit: 1,
  })
  return (res.docs[0] as Magazine) ?? null
}

export async function getLatestMagazine(): Promise<Magazine | null> {
  const res = await getMagazines({ limit: 1 })
  return (res.docs[0] as Magazine) ?? null
}

export async function getAllMagazineSlugs(): Promise<string[]> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'magazines',
    where: PUBLISHED,
    depth: 0,
    limit: 1000,
    pagination: false,
    select: { slug: true },
  })
  return res.docs.map((d) => d.slug as string).filter(Boolean)
}

// ── Taxonomy ─────────────────────────────────────────────────────────
export async function getAllCategories(): Promise<Category[]> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'categories',
    sort: 'title',
    depth: 0,
    limit: 100,
    pagination: false,
  })
  return res.docs as Category[]
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
  })
  return (res.docs[0] as Category) ?? null
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'tags',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
  })
  return (res.docs[0] as Tag) ?? null
}

// ── Pages ────────────────────────────────────────────────────────────
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, ...PUBLISHED },
    depth: 1,
    limit: 1,
  })
  return (res.docs[0] as Page) ?? null
}

// ── Testimonials ─────────────────────────────────────────────────────
export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'testimonials',
    where: { featured: { equals: true } },
    sort: 'order',
    depth: 1,
    limit: 12,
  })
  return res.docs as Testimonial[]
}

// ── Search ───────────────────────────────────────────────────────────
export async function searchArticles(query: string): Promise<Article[]> {
  const q = query.trim()
  if (!q) return []
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'articles',
    where: {
      and: [PUBLISHED, { or: [{ title: { like: q } }, { excerpt: { like: q } }] }],
    },
    sort: '-publishedDate',
    depth: 1,
    limit: 30,
  })
  return res.docs as Article[]
}

// ── Homepage composition ─────────────────────────────────────────────
function asArticle(value: unknown): Article | null {
  return value && typeof value === 'object' ? (value as Article) : null
}

export async function getHomepageData() {
  const payload = await getPayloadClient()
  const homepage = await payload.findGlobal({ slug: 'homepage', depth: 2 })

  // Hero — curated, else newest article.
  let hero = asArticle(homepage.heroArticle)
  if (!hero) {
    const latest = await getArticles({ limit: 1 })
    hero = (latest.docs[0] as Article) ?? null
  }

  const usedIds = new Set<number | string>()
  if (hero) usedIds.add(hero.id)

  // Editor's Choice — curated, else newest from the Featured section, else newest overall.
  let editorsChoice = (homepage.editorsChoice ?? [])
    .map(asArticle)
    .filter((a): a is Article => Boolean(a))
  if (editorsChoice.length === 0) {
    const featured = await getPayloadClient().then((p) =>
      p.find({
        collection: 'categories',
        where: { slug: { equals: 'featured' } },
        limit: 1,
        depth: 0,
      }),
    )
    const featuredId = featured.docs[0]?.id
    const res = await getArticles({
      limit: 6,
      categoryId: featuredId,
      excludeIds: [...usedIds],
    })
    editorsChoice = res.docs as Article[]
  }
  editorsChoice = editorsChoice.slice(0, 6)
  editorsChoice.forEach((a) => usedIds.add(a.id))

  // Latest issue — curated, else newest.
  const latestIssue =
    (homepage.featuredIssue && typeof homepage.featuredIssue === 'object'
      ? (homepage.featuredIssue as Magazine)
      : null) ?? (await getLatestMagazine())

  // Top headlines — curated, else newest from News & Business.
  let topHeadlines = (homepage.topHeadlines ?? [])
    .map(asArticle)
    .filter((a): a is Article => Boolean(a))
  if (topHeadlines.length === 0) {
    const cats = await payload.find({
      collection: 'categories',
      where: { slug: { in: ['news', 'business'] } },
      depth: 0,
      limit: 5,
    })
    const ids = cats.docs.map((c) => c.id)
    const res = await getArticles({ limit: 5, excludeIds: [...usedIds] })
    topHeadlines =
      ids.length > 0
        ? ((
            await getArticles({ categoryId: ids[0], limit: 5, excludeIds: [...usedIds] })
          ).docs as Article[])
        : (res.docs as Article[])
  }
  topHeadlines = topHeadlines.slice(0, 5)
  topHeadlines.forEach((a) => usedIds.add(a.id))

  // Latest posts — newest articles not already shown above.
  const latestPosts = (
    await getArticles({ limit: 6, excludeIds: [...usedIds] })
  ).docs as Article[]

  const testimonials = await getFeaturedTestimonials()

  return {
    hero,
    editorsChoice,
    latestIssue,
    topHeadlines,
    latestPosts,
    testimonials,
    newsletterHeading: homepage.newsletterHeading || 'Subscribe for exclusive content',
    newsletterText:
      homepage.newsletterText ||
      'Get the journeys, strategies and ideas of those redefining business — delivered to your inbox.',
  }
}
