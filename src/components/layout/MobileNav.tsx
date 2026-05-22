'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search } from 'lucide-react'
import { PRIMARY_NAV, SITE } from '@/lib/site'
import { cn } from '@/lib/utils'

/** Hamburger menu + slide-down panel for small screens. */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close the panel whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll while the panel is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="flex h-11 w-11 items-center justify-center text-ink"
      >
        {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
      </button>

      <div
        className={cn(
          'fixed inset-x-0 bottom-0 top-14 z-40 bg-paper',
          'transition-opacity duration-200 ease-editorial',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <nav className="flex h-full flex-col overflow-y-auto px-6 py-8">
          <ul className="flex flex-col">
            {PRIMARY_NAV.map((item, i) => (
              <li key={item.href} className="border-b border-hairline">
                <Link
                  href={item.href}
                  className="flex items-baseline gap-4 py-4 font-serif text-2xl text-ink hover:text-crimson"
                >
                  <span className="eyebrow text-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/search"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-crimson"
          >
            <Search size={16} strokeWidth={1.75} />
            Search articles
          </Link>
          <p className="eyebrow mt-auto pt-10 text-faint">{SITE.tagline}</p>
        </nav>
      </div>
    </div>
  )
}
