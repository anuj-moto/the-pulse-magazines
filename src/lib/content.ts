import type { Article, Category, Magazine, Media } from '@/payload-types'

/** The first (primary) category of an article or magazine, if populated. */
export function primaryCategory(
  doc: Pick<Article, 'category'> | Pick<Magazine, 'category'>,
): Category | null {
  const cats = doc.category
  if (!Array.isArray(cats) || cats.length === 0) return null
  const first = cats[0]
  return first && typeof first === 'object' ? (first as Category) : null
}

/** Resolve a populated Media object (or null). */
export function asMedia(value: unknown): Media | null {
  return value && typeof value === 'object' ? (value as Media) : null
}
