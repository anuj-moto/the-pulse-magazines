import type { Metadata } from 'next'
import type { Media } from '@/payload-types'
import { SITE } from './site'

/** Resolve a Payload media value to an absolute URL (for social scrapers). */
export function mediaUrl(media: unknown): string | undefined {
  if (!media || typeof media !== 'object') return undefined
  const url = (media as Media).url
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return `${SITE.url}${url}`
}

type MetaInput = {
  title: string
  description?: string | null
  /** Path beginning with "/", e.g. "/some-article". */
  path: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  noindex?: boolean
}

/** Build a complete Metadata object with canonical URL, OpenGraph and Twitter. */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
  noindex,
}: MetaInput): Metadata {
  const url = `${SITE.url}${path}`
  const desc = description || SITE.description

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description: desc,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      ...(image ? { images: [{ url: image }] } : {}),
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description: desc,
      ...(image ? { images: [image] } : {}),
    },
  }
}
