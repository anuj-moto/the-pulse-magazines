import Link from 'next/link'
import { Search } from 'lucide-react'
import { Container } from './Container'
import { NavLink } from './NavLink'
import { MobileNav } from './MobileNav'
import { PRIMARY_NAV, SITE } from '@/lib/site'

/** Editorial masthead: top strip, wordmark, then a sticky section nav. */
export function Header() {
  return (
    <header className="bg-paper">
      {/* Top strip */}
      <div className="border-b border-hairline">
        <Container className="flex h-9 items-center justify-between">
          <span className="eyebrow text-faint">{SITE.tagline}</span>
          <Link
            href="/search"
            className="eyebrow flex items-center gap-1.5 text-faint hover:text-crimson"
          >
            <Search size={13} strokeWidth={2} />
            <span className="hidden sm:inline">Search</span>
          </Link>
        </Container>
      </div>

      {/* Wordmark */}
      <Container className="py-7 text-center sm:py-9">
        <Link href="/" className="inline-block" aria-label={`${SITE.name} — home`}>
          <span className="block font-serif text-[1.75rem] leading-none font-semibold tracking-tight text-ink sm:text-[2.75rem] lg:text-[3.25rem]">
            The Pulse Magazines
          </span>
        </Link>
      </Container>

      {/* Sticky section nav */}
      <div className="sticky top-0 z-50 border-y border-ink bg-paper">
        <Container>
          <nav
            aria-label="Primary"
            className="flex h-14 items-center justify-between md:h-auto md:justify-center"
          >
            <ul className="hidden items-center gap-7 md:flex lg:gap-9">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} label={item.label} />
                </li>
              ))}
            </ul>

            {/* Mobile: condensed wordmark + hamburger */}
            <Link
              href="/"
              className="font-serif text-lg font-semibold text-ink md:hidden"
            >
              The Pulse
            </Link>
            <MobileNav />
          </nav>
        </Container>
      </div>
    </header>
  )
}
