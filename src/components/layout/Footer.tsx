import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { LinkedInIcon } from '@/components/icons'
import { Container } from './Container'
import { FOOTER_NAV, SITE, SOCIAL } from '@/lib/site'
import { getNavigation, getSiteSettings } from '@/lib/queries'

/** Site footer — large brand block, link columns, legal bar. */
export async function Footer() {
  const year = new Date().getFullYear()
  const [nav, settings] = await Promise.all([getNavigation(), getSiteSettings()])

  const columns =
    nav?.footerColumns && nav.footerColumns.length > 0
      ? nav.footerColumns.map((c) => ({
          heading: c.heading,
          items: (c.links ?? []).map((l) => ({ label: l.label, href: l.url })),
        }))
      : FOOTER_NAV

  const linkedin = settings?.social?.linkedin || SOCIAL.linkedin
  const description = settings?.description || SITE.description

  return (
    <footer className="mt-24 border-t border-hairline bg-paper">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)] lg:gap-16">
          {/* Brand block */}
          <div className="max-w-md">
            <Link
              href="/"
              className="font-serif text-3xl leading-tight font-normal tracking-[-0.02em] text-ink"
            >
              The Pulse Magazines
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">{description}</p>
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-electric"
              >
                <LinkedInIcon size={15} />
                LinkedIn
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            )}
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="eyebrow text-faint">{col.heading}</h2>
              <ul className="mt-5 space-y-3">
                {col.items.map((item) => (
                  <li key={`${item.label}-${item.href}`}>
                    <Link
                      href={item.href}
                      className="link-underline text-sm text-ink-soft transition-colors hover:text-electric"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Container>

      {/* Legal bar */}
      <div className="border-t border-hairline">
        <Container className="flex flex-col gap-3 py-5 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p className="num">© {year} The Pulse Magazines. All rights reserved.</p>
          <p className="eyebrow">{SITE.tagline}</p>
        </Container>
      </div>
    </footer>
  )
}
