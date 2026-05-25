'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

/** Desktop nav link with active-section highlighting. */
export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative py-3.5 text-[0.78rem] font-medium tracking-wide whitespace-nowrap transition-colors',
        'hover:text-electric',
        active ? 'text-electric' : 'text-ink',
      )}
    >
      {label}
      <span
        className={cn(
          'absolute inset-x-0 -bottom-px h-px bg-electric transition-transform duration-300 ease-editorial',
          active ? 'scale-x-100' : 'scale-x-0',
        )}
      />
    </Link>
  )
}
