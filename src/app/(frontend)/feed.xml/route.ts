import { getArticles } from '@/lib/queries'
import { primaryCategory } from '@/lib/content'
import { SITE } from '@/lib/site'

export const revalidate = 600

/** Escape text for inclusion in XML. */
function xml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** GET /feed.xml — RSS 2.0 feed of the 20 most recent articles. */
export async function GET() {
  const res = await getArticles({ limit: 20 })
  const built = new Date().toUTCString()

  const items = res.docs
    .map((article) => {
      const link = `${SITE.url}/${article.slug}`
      const cat = primaryCategory(article)
      const pubDate = article.publishedDate
        ? new Date(article.publishedDate).toUTCString()
        : built
      return `    <item>
      <title>${xml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      ${cat ? `<category>${xml(cat.title)}</category>` : ''}
      <description>${xml(article.excerpt || '')}</description>
    </item>`
    })
    .join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(SITE.name)}</title>
    <link>${SITE.url}</link>
    <description>${xml(SITE.description)}</description>
    <language>en</language>
    <lastBuildDate>${built}</lastBuildDate>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate',
    },
  })
}
