import Link from 'next/link'
import { Search } from 'lucide-react'
import { Container } from './Container'
import { NavLink } from './NavLink'
import { MobileNav } from './MobileNav'
import { PRIMARY_NAV, SITE, type NavItem } from '@/lib/site'
import { getNavigation } from '@/lib/queries'

/**
 * Signal masthead: tight wordmark row, then a frosted sticky section nav.
 * The live ticker sits above (mounted in the root layout), so there's no
 * static tagline strip here anymore.
 */
export async function Header() {
  const nav = await getNavigation()
  const items: NavItem[] =
    nav?.headerLinks && nav.headerLinks.length > 0
      ? nav.headerLinks.map((l) => ({ label: l.label, href: l.url }))
      : PRIMARY_NAV

  return (
    <header className="bg-paper">
      {/* Wordmark row */}
      <div className="border-b border-hairline">
        <Container className="flex h-14 items-center justify-between sm:h-16">
          <Link
            href="/"
            className="font-serif text-2xl font-normal tracking-[-0.02em] text-ink transition-opacity hover:opacity-70 sm:text-[1.75rem]"
            aria-label={`${SITE.name} — home`}
          >
            The Pulse Magazines
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="hidden h-9 items-center gap-1.5 rounded-sharp border border-hairline px-3 text-xs text-faint transition-colors hover:border-ink hover:text-ink sm:flex"
            >
              <Search size={13} strokeWidth={2} />
              <span className="font-mono uppercase tracking-wider">Search</span>
            </Link>
            <MobileNav items={items} />
          </div>
        </Container>
      </div>

      {/* Sticky section nav */}
      <div className="sticky top-0 z-40 hidden border-b border-hairline glass md:block">
        <Container>
          <nav aria-label="Primary" className="flex items-center justify-center">
            <ul className="flex items-center gap-7 lg:gap-9">
              {items.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <NavLink href={item.href} label={item.label} />
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  )
}
