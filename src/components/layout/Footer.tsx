import Link from 'next/link'
import { LinkedInIcon } from '@/components/icons'
import { Container } from './Container'
import { FOOTER_NAV, SITE, SOCIAL } from '@/lib/site'

/** Site footer — masthead block, link columns, legal bar. */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-ink bg-paper-dim">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Masthead block */}
          <div className="max-w-sm">
            <Link href="/" className="font-serif text-2xl font-semibold text-ink">
              The Pulse Magazines
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted">{SITE.description}</p>
            <a
              href={SOCIAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-sharp border border-hairline text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              aria-label="The Pulse Magazines on LinkedIn"
            >
              <LinkedInIcon size={16} />
            </a>
          </div>

          {/* Link columns */}
          {FOOTER_NAV.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="eyebrow text-faint">{col.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink-soft transition-colors hover:text-crimson"
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
        <Container className="flex flex-col gap-2 py-5 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} The Pulse Magazines. All rights reserved.
          </p>
          <p className="eyebrow">{SITE.tagline}</p>
        </Container>
      </div>
    </footer>
  )
}
