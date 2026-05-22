/**
 * One-time WordPress → Payload content migration.
 *
 *   pnpm migrate:wp            # full migration (idempotent — safe to re-run)
 *   pnpm migrate:wp --dry-run  # report what would happen, write nothing
 *
 * Order: categories → authors → tags → media → articles → magazines →
 * pages → site globals & testimonials. Every record is upserted on its
 * hidden `wpId`, so re-running picks up edits made on WordPress since.
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import pLimit from 'p-limit'
import config from '../src/payload.config'
import { fetchAll, fetchByIds, downloadFile, fetchOgImage, filenameFor } from './wp-client'
import {
  buildEditorConfig,
  htmlToLexical,
  htmlToText,
  cleanExcerpt,
  extractReadableHtml,
  type EditorConfig,
} from './html-to-lexical'

const DRY = process.argv.includes('--dry-run')
const ONLY = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1]

// ── Reporting ────────────────────────────────────────────────────────
const report: string[] = []
const stats: Record<string, { created: number; updated: number; skipped: number }> = {}
const warnings: string[] = []

function log(msg = '') {
  console.log(msg)
  report.push(msg)
}
function bump(key: string, kind: 'created' | 'updated' | 'skipped') {
  stats[key] ??= { created: 0, updated: 0, skipped: 0 }
  stats[key][kind] += 1
}
function warn(msg: string) {
  warnings.push(msg)
  console.warn('  ⚠ ' + msg)
}

const shouldRun = (step: string) => !ONLY || ONLY === step

async function main() {
  const startedAt = Date.now()
  log(`\n━━ WordPress → Payload migration ${DRY ? '(DRY RUN)' : ''} ━━\n`)

  const payload = await getPayload({ config })
  const editorConfig: EditorConfig = await buildEditorConfig(payload.config)

  /** Find a doc by its WordPress id. */
  async function findByWpId(collection: string, wpId: number) {
    const res = await payload.find({
      collection: collection as never,
      where: { wpId: { equals: wpId } },
      limit: 1,
      depth: 0,
      pagination: false,
    })
    return res.docs[0]
  }

  /** Upsert a non-upload doc keyed on wpId. Returns the Payload id. */
  async function upsert(
    collection: string,
    wpId: number,
    data: Record<string, unknown>,
    isDraftCollection = false,
  ): Promise<number | string> {
    const existing = await findByWpId(collection, wpId)
    if (existing) {
      if (!DRY) {
        await payload.update({
          collection: collection as never,
          id: existing.id,
          data: data as never,
          ...(isDraftCollection ? { draft: false } : {}),
        })
      }
      bump(collection, 'updated')
      return existing.id
    }
    if (DRY) {
      bump(collection, 'created')
      return `dry-${collection}-${wpId}`
    }
    const created = await payload.create({
      collection: collection as never,
      data: data as never,
      ...(isDraftCollection ? { draft: false } : {}),
    })
    bump(collection, 'created')
    return created.id
  }

  /**
   * Resolve a magazine cover image. Most magazine cover media records are
   * forbidden by the WordPress REST API, so fall back to the cover URL in
   * the magazine page's og:image meta tag.
   */
  async function resolveCoverViaPage(m: any): Promise<number | string | undefined> {
    const fmId: number = m.featured_media || 0
    if (fmId) {
      const existing = await findByWpId('media', fmId)
      if (existing) {
        mediaMap.set(fmId, existing.id)
        return existing.id
      }
    }
    const ogUrl = m.link ? await fetchOgImage(m.link) : null
    if (!ogUrl) return undefined
    if (DRY) {
      bump('media', 'created')
      return `dry-media-og-${fmId || m.id}`
    }
    try {
      const { data, mimetype } = await downloadFile(ogUrl)
      const created = await payload.create({
        collection: 'media',
        data: {
          alt: htmlToText(m.title?.rendered) || 'Magazine cover',
          ...(fmId ? { wpId: fmId } : {}),
        },
        file: {
          data,
          mimetype,
          name: `${fmId || m.id}-${filenameFor(ogUrl, mimetype)}`,
          size: data.length,
        },
      })
      if (fmId) mediaMap.set(fmId, created.id)
      bump('media', 'created')
      return created.id
    } catch (err) {
      warn(`Cover download for "${htmlToText(m.title?.rendered)}": ${(err as Error).message}`)
      return undefined
    }
  }

  // ═══ 1. Categories ═════════════════════════════════════════════════
  const catMap = new Map<number, number | string>() // wp term id → payload id
  if (shouldRun('categories')) {
    log('1. Categories')
    const wpCats = await fetchAll('categories')
    for (const c of wpCats) {
      if (c.slug === 'uncategorized') continue
      const id = await upsert('categories', c.id, {
        title: htmlToText(c.name),
        slug: c.slug,
        description: htmlToText(c.description || ''),
        wpId: c.id,
      })
      catMap.set(c.id, id)
    }
    log(`   ${catMap.size} categories\n`)
  }

  // ═══ 2. Authors ════════════════════════════════════════════════════
  const authorMap = new Map<number, number | string>()
  let fallbackAuthorId: number | string | undefined
  if (shouldRun('authors')) {
    log('2. Authors')
    const wpUsers = await fetchAll('users')
    for (const u of wpUsers) {
      const id = await upsert('authors', u.id, {
        name: htmlToText(u.name) || 'The Pulse Magazines Team',
        slug: u.slug,
        bio: htmlToText(u.description || ''),
        wpId: u.id,
      })
      authorMap.set(u.id, id)
    }
    fallbackAuthorId = authorMap.get(1) ?? [...authorMap.values()][0]
    log(`   ${authorMap.size} authors\n`)
  }

  // ═══ 3. Fetch tags (lookup only — created on demand) ═══════════════
  log('3. Tags (index)')
  const wpTagsById = new Map<number, { name: string; slug: string }>()
  for (const t of await fetchAll('tags')) {
    wpTagsById.set(t.id, { name: htmlToText(t.name), slug: t.slug })
  }
  log(`   ${wpTagsById.size} tags indexed\n`)

  // ═══ 4. Fetch source content ═══════════════════════════════════════
  log('4. Fetching posts & magazine issues')
  const wpPosts = await fetchAll('posts')
  const wpMagazines = await fetchAll('magazine')
  log(`   ${wpPosts.length} posts, ${wpMagazines.length} magazine issues\n`)

  // Magazine taxonomy → shared categories
  const magCatMap = new Map<number, number | string>()
  if (shouldRun('articles') || shouldRun('magazines')) {
    try {
      for (const mc of await fetchAll('magazine-category')) {
        if (mc.slug === 'uncategorized') continue
        const existing = await payload.find({
          collection: 'categories',
          where: { slug: { equals: mc.slug } },
          limit: 1,
          depth: 0,
        })
        if (existing.docs[0]) {
          magCatMap.set(mc.id, existing.docs[0].id)
        } else if (!DRY) {
          const created = await payload.create({
            collection: 'categories',
            data: { title: htmlToText(mc.name), slug: mc.slug },
          })
          magCatMap.set(mc.id, created.id)
        }
      }
    } catch {
      warn('Could not read magazine-category taxonomy; magazine issues will be uncategorised.')
    }
  }

  // ═══ 5. Used tags ══════════════════════════════════════════════════
  const tagMap = new Map<number, number | string>()
  const usedTagIds = new Set<number>()
  for (const p of wpPosts) for (const t of p.tags || []) usedTagIds.add(t)
  log(`5. Tags (${usedTagIds.size} actually used)`)
  for (const tagId of usedTagIds) {
    const t = wpTagsById.get(tagId)
    if (!t || !t.slug) continue
    const id = await upsert('tags', tagId, { title: t.name, slug: t.slug, wpId: tagId })
    tagMap.set(tagId, id)
  }
  log(`   ${tagMap.size} tags migrated\n`)

  // ═══ 6. Media ══════════════════════════════════════════════════════
  const mediaMap = new Map<number, number | string>()
  if (shouldRun('media')) {
    const mediaIds = new Set<number>()
    for (const p of wpPosts) if (p.featured_media) mediaIds.add(p.featured_media)
    for (const m of wpMagazines) if (m.featured_media) mediaIds.add(m.featured_media)

    log(`6. Media (${mediaIds.size} images)`)
    const wpMedia = await fetchByIds('media', [...mediaIds])
    const limit = pLimit(5)
    let done = 0

    await Promise.all(
      wpMedia.map((m: any) =>
        limit(async () => {
          try {
            const existing = await findByWpId('media', m.id)
            if (existing) {
              mediaMap.set(m.id, existing.id)
              bump('media', 'updated')
            } else if (DRY) {
              mediaMap.set(m.id, `dry-media-${m.id}`)
              bump('media', 'created')
            } else {
              const { data, mimetype } = await downloadFile(m.source_url)
              const created = await payload.create({
                collection: 'media',
                data: {
                  alt:
                    htmlToText(m.alt_text) ||
                    htmlToText(m.title?.rendered) ||
                    'The Pulse Magazines',
                  caption: htmlToText(m.caption?.rendered || ''),
                  wpId: m.id,
                },
                file: {
                  data,
                  mimetype,
                  // Prefix with the WP media id — different month folders on
                  // WordPress can share a basename, which would collide in
                  // Payload's flat media store.
                  name: `${m.id}-${filenameFor(m.source_url, mimetype)}`,
                  size: data.length,
                },
              })
              mediaMap.set(m.id, created.id)
              bump('media', 'created')
            }
          } catch (err) {
            warn(`Media ${m.id} (${m.source_url}): ${(err as Error).message}`)
            bump('media', 'skipped')
          }
          if (++done % 25 === 0) log(`   …${done}/${wpMedia.length}`)
        }),
      ),
    )
    log(`   ${mediaMap.size} images ready\n`)
  }

  // ═══ 7. Articles ═══════════════════════════════════════════════════
  if (shouldRun('articles')) {
    log(`7. Articles (${wpPosts.length})`)
    let i = 0
    for (const p of wpPosts) {
      const categories = (p.categories || [])
        .map((id: number) => catMap.get(id))
        .filter(Boolean)
      const tags = (p.tags || []).map((id: number) => tagMap.get(id)).filter(Boolean)
      const title = htmlToText(p.title?.rendered) || 'Untitled'

      await upsert(
        'articles',
        p.id,
        {
          title,
          slug: p.slug,
          excerpt: cleanExcerpt(p.excerpt?.rendered || '') || title,
          content: htmlToLexical(p.content?.rendered || '', editorConfig),
          featuredImage: mediaMap.get(p.featured_media) ?? null,
          author: authorMap.get(p.author) ?? fallbackAuthorId ?? null,
          category: categories,
          tags,
          publishedDate: p.date,
          _status: 'published',
          wpId: p.id,
        },
        true,
      )
      if (++i % 25 === 0) log(`   …${i}/${wpPosts.length}`)
    }
    log(`   done\n`)
  }

  // ═══ 8. Magazine issues ════════════════════════════════════════════
  if (shouldRun('magazines')) {
    log(`8. Magazine issues (${wpMagazines.length})`)
    for (const m of wpMagazines) {
      let cover = mediaMap.get(m.featured_media)
      if (!cover) cover = await resolveCoverViaPage(m)
      if (!cover) {
        warn(`Magazine "${htmlToText(m.title?.rendered)}" has no cover image — skipped.`)
        bump('magazines', 'skipped')
        continue
      }
      const categories = (m['magazine-category'] || [])
        .map((id: number) => magCatMap.get(id))
        .filter(Boolean)

      await upsert(
        'magazines',
        m.id,
        {
          title: htmlToText(m.title?.rendered) || 'Untitled Issue',
          slug: m.slug,
          excerpt: cleanExcerpt(m.excerpt?.rendered || ''),
          content: htmlToLexical(m.content?.rendered || '', editorConfig),
          coverImage: cover,
          category: categories,
          issueDate: m.date,
          _status: 'published',
          wpId: m.id,
        },
        true,
      )
    }
    log(`   done\n`)
  }

  // ═══ 9. Pages ══════════════════════════════════════════════════════
  if (shouldRun('pages')) {
    log('9. Pages')
    const wpPages = await fetchAll('pages')
    const legalPages = [
      { wpSlug: 'privacy-policy-2', slug: 'privacy-policy', title: 'Privacy Policy' },
      { wpSlug: 'disclaimer', slug: 'disclaimer', title: 'Disclaimer' },
      { wpSlug: 'terms-of-use', slug: 'terms-of-use', title: 'Terms of Use' },
    ]
    for (const lp of legalPages) {
      const wpPage = wpPages.find((p: any) => p.slug === lp.wpSlug)
      if (!wpPage) {
        warn(`WordPress page "${lp.wpSlug}" not found — "${lp.title}" not migrated.`)
        continue
      }
      const readable = extractReadableHtml(wpPage.content?.rendered || '')
      await upsert(
        'pages',
        wpPage.id,
        {
          title: lp.title,
          slug: lp.slug,
          content: htmlToLexical(readable, editorConfig),
          _status: 'published',
          wpId: wpPage.id,
        },
        true,
      )
    }

    // About — re-authored fresh (the WordPress page is Elementor markup).
    const aboutWpId = 900000001 // synthetic stable id, won't collide with WP
    const aboutHtml = `
      <h2>Our Story</h2>
      <p>At The Pulse Magazines, we go beyond headlines to bring you powerful
      success stories, bold ideas, and authentic voices that inspire, inform,
      and ignite change. We are not just a magazine — we are a movement built
      around the belief that every story matters.</p>
      <p>We celebrate journeys that defy the odds, spotlight innovation that
      shapes the future, and explore the heart of what truly matters — one
      story at a time.</p>
      <h2>What We Cover</h2>
      <p>From business and leadership to innovation, industry, and health and
      wellness, our editorial team profiles the people redefining how the
      world works. Each feature is a conversation with a thought leader, an
      innovator, or a change-maker whose perspective is worth your time.</p>
      <h2>Why It Matters</h2>
      <p>In a media landscape crowded with noise, The Pulse Magazines offers a
      curated, human-centered alternative — global in relevance, premium in
      standard, and grounded in real journeys. Whether you are a reader with a
      story, a brand with a vision, or a creator looking to collaborate, there
      is a place for you here.</p>`
    await upsert(
      'pages',
      aboutWpId,
      {
        title: 'About Us',
        slug: 'about',
        subtitle: 'Where every story matters.',
        content: htmlToLexical(aboutHtml, editorConfig),
        _status: 'published',
        wpId: aboutWpId,
      },
      true,
    )
    log('   privacy-policy, disclaimer, terms-of-use, about\n')
  }

  // ═══ 10. Site globals & testimonials ═══════════════════════════════
  if (shouldRun('globals')) {
    log('10. Site settings, navigation, homepage & testimonials')
    if (!DRY) {
      const nav = await payload.findGlobal({ slug: 'navigation' })
      if (!nav?.headerLinks?.length) {
        await payload.updateGlobal({
          slug: 'navigation',
          data: {
            headerLinks: [
              { label: 'Magazine', url: '/magazine' },
              { label: 'Featured', url: '/category/featured' },
              { label: 'News', url: '/category/news' },
              { label: 'Business', url: '/category/business' },
              { label: 'Health & Wellness', url: '/category/health-wellness' },
              { label: 'Industry', url: '/category/industry' },
              { label: 'Tech', url: '/category/tech' },
            ],
            footerColumns: [
              {
                heading: 'Sections',
                links: [
                  { label: 'Featured', url: '/category/featured' },
                  { label: 'Business', url: '/category/business' },
                  { label: 'News', url: '/category/news' },
                  { label: 'Industry', url: '/category/industry' },
                  { label: 'Health & Wellness', url: '/category/health-wellness' },
                ],
              },
              {
                heading: 'The Magazine',
                links: [
                  { label: 'Latest Issues', url: '/magazine' },
                  { label: 'All Articles', url: '/blog' },
                  { label: 'About Us', url: '/about' },
                  { label: 'Contact', url: '/contact' },
                ],
              },
              {
                heading: 'Legal',
                links: [
                  { label: 'Privacy Policy', url: '/privacy-policy' },
                  { label: 'Terms of Use', url: '/terms-of-use' },
                  { label: 'Disclaimer', url: '/disclaimer' },
                ],
              },
            ],
          },
        })
      }

      const settings = await payload.findGlobal({ slug: 'site-settings' })
      if (!settings?.description) {
        await payload.updateGlobal({
          slug: 'site-settings',
          data: {
            siteName: 'The Pulse Magazines',
            tagline: 'Where Every Story Matters',
            description:
              'Showcasing the journeys, strategies, and influence of those redefining business, leadership, and innovation.',
            contactEmail: process.env.CONTACT_NOTIFY_EMAIL || '',
            social: { linkedin: 'https://www.linkedin.com/company/the-pulse-magazines' },
          },
        })
      }

      const testimonialCount = await payload.count({ collection: 'testimonials' })
      if (testimonialCount.totalDocs === 0) {
        const testimonials = [
          {
            quote:
              'The Pulse Magazines stands out as a thoughtfully curated publication that blends strong editorial integrity with a modern global perspective.',
            authorName: 'Giovanni Marzilli',
            authorTitle: 'Media & Publishing Professional, United States',
          },
          {
            quote:
              'What impressed me most is its ability to spotlight voices that are often overlooked by mainstream media while maintaining a premium, international standard.',
            authorName: 'Entrepreneur & Business Consultant',
            authorTitle: 'United States',
          },
          {
            quote:
              'The Pulse Magazines offers a refreshing editorial approach that aligns well with a global entrepreneurial mindset.',
            authorName: 'Founder & Entrepreneur',
            authorTitle: 'Middle East',
          },
          {
            quote:
              'The Pulse Magazines feels less like a publication and more like a curated intellectual experience.',
            authorName: 'Innovation & Policy Professional',
            authorTitle: 'Africa',
          },
          {
            quote: 'Every article invites reflection rather than consumption.',
            authorName: 'Independent Reader',
            authorTitle: 'Global',
          },
          {
            quote:
              'What distinguishes The Pulse Magazines is its ability to merge global relevance with human-centered storytelling.',
            authorName: 'Strategy Consultant',
            authorTitle: 'Europe',
          },
        ]
        for (let idx = 0; idx < testimonials.length; idx++) {
          await payload.create({
            collection: 'testimonials',
            data: { ...testimonials[idx], featured: true, order: idx },
          })
          bump('testimonials', 'created')
        }
      }
    }
    log('   globals seeded\n')
  }

  // ── Report ─────────────────────────────────────────────────────────
  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1)
  log('━━ Summary ━━')
  for (const [key, s] of Object.entries(stats)) {
    log(`   ${key.padEnd(20)} ${s.created} created, ${s.updated} updated, ${s.skipped} skipped`)
  }
  log(`\n   ${warnings.length} warning(s)`)
  for (const w of warnings) log(`     - ${w}`)
  log(`\n   Completed in ${elapsed}s ${DRY ? '(dry run — nothing written)' : ''}`)

  if (!DRY) {
    fs.writeFileSync(
      path.resolve(process.cwd(), 'migration-report.txt'),
      report.join('\n') + '\n',
    )
    log('\n   Report written to migration-report.txt')
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('\n✖ Migration failed:', err)
  process.exit(1)
})
