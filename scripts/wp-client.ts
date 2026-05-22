/**
 * Minimal WordPress REST API client for the one-time content migration.
 * Read-only — paginated fetches with retry/backoff.
 */
import path from 'path'

const WP_URL = (process.env.WORDPRESS_API_URL || 'https://thepulsemagazines.com').replace(
  /\/$/,
  '',
)
const API = `${WP_URL}/wp-json/wp/v2`

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

async function wpFetch(url: string, attempt = 1): Promise<Response> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'PulseMagazine-Migration/1.0' },
      signal: AbortSignal.timeout(45000),
    })
    if (res.status >= 500 && attempt < 4) {
      await sleep(600 * attempt)
      return wpFetch(url, attempt + 1)
    }
    return res
  } catch (err) {
    if (attempt < 4) {
      await sleep(600 * attempt)
      return wpFetch(url, attempt + 1)
    }
    throw err
  }
}

/** Fetch every page of a WordPress REST collection endpoint. */
export async function fetchAll<T = any>(
  endpoint: string,
  params: Record<string, string | number> = {},
): Promise<T[]> {
  const results: T[] = []
  let page = 1
  let totalPages = 1

  do {
    const qs = new URLSearchParams({ per_page: '100', page: String(page) })
    for (const [k, v] of Object.entries(params)) qs.set(k, String(v))

    const res = await wpFetch(`${API}/${endpoint}?${qs.toString()}`)
    // WordPress returns 400 when requesting a page beyond the last one.
    if (res.status === 400) break
    if (!res.ok) throw new Error(`WP GET ${endpoint} (page ${page}) → ${res.status}`)

    totalPages = Number(res.headers.get('x-wp-totalpages') || '1')
    const batch = (await res.json()) as T[]
    results.push(...batch)
    page += 1
  } while (page <= totalPages)

  return results
}

/** Fetch specific records by ID (batched via the `include` query param). */
export async function fetchByIds<T = any>(endpoint: string, ids: number[]): Promise<T[]> {
  const unique = [...new Set(ids)].filter((id) => Number.isFinite(id) && id > 0)
  const results: T[] = []

  for (const ids100 of chunk(unique, 100)) {
    const qs = new URLSearchParams({ per_page: '100', orderby: 'include' })
    for (const id of ids100) qs.append('include[]', String(id))

    const res = await wpFetch(`${API}/${endpoint}?${qs.toString()}`)
    if (!res.ok) throw new Error(`WP GET ${endpoint} (include) → ${res.status}`)
    results.push(...((await res.json()) as T[]))
  }

  return results
}

/** Download a binary asset (image). */
export async function downloadFile(
  url: string,
): Promise<{ data: Buffer; mimetype: string }> {
  const res = await wpFetch(url)
  if (!res.ok) throw new Error(`Download failed ${url} → ${res.status}`)
  const data = Buffer.from(await res.arrayBuffer())
  const mimetype = (res.headers.get('content-type') || 'image/jpeg').split(';')[0].trim()
  return { data, mimetype }
}

/**
 * Extract the og:image URL from a page's HTML. Used as a fallback for
 * magazine covers, whose media records the REST API forbids anonymously.
 */
export async function fetchOgImage(pageUrl: string): Promise<string | null> {
  const res = await wpFetch(pageUrl)
  if (!res.ok) return null
  const html = await res.text()
  const match =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
  return match ? match[1] : null
}

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
  'image/svg+xml': '.svg',
}

/** Build an upload filename whose extension matches the served mime type. */
export function filenameFor(sourceUrl: string, mimetype: string): string {
  let base = 'image'
  try {
    base = path.basename(new URL(sourceUrl).pathname) || 'image'
  } catch {
    /* keep default */
  }
  const wantExt = EXT_BY_MIME[mimetype.toLowerCase()] || path.extname(base) || '.jpg'
  const stem = base.replace(/\.[^.]+$/, '') || 'image'
  return `${stem}${wantExt}`
}

export { WP_URL }
