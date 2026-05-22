import type { Article, Author } from '@/payload-types'
import { SITE } from './site'
import { mediaUrl } from './seo'

/** schema.org Organization — the publisher. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  }
}

/** schema.org WebSite, with a search action. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

/** schema.org Article for a single story. */
export function articleSchema(article: Article) {
  const author =
    article.author && typeof article.author === 'object'
      ? (article.author as Author)
      : null
  const image = mediaUrl(article.featuredImage)

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedDate,
    dateModified: article.updatedAt || article.publishedDate,
    ...(image ? { image: [image] } : {}),
    author: {
      '@type': author ? 'Person' : 'Organization',
      name: author?.name || SITE.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
    },
    mainEntityOfPage: `${SITE.url}/${article.slug}`,
  }
}
