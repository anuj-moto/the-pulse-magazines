import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Windowed page navigation for listings. */
export function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number
  totalPages: number
  basePath: string
}) {
  if (totalPages <= 1) return null

  const hrefFor = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`)

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1])
  const visible = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b)

  const arrow =
    'flex h-10 w-10 items-center justify-center rounded-sharp border border-hairline transition-all duration-200 hover:-translate-y-px'

  return (
    <nav
      aria-label="Pagination"
      className="mt-16 flex items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={cn(arrow, 'hover:border-electric hover:text-electric')} aria-label="Previous page">
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span className={cn(arrow, 'opacity-30')} aria-hidden>
          <ChevronLeft size={16} />
        </span>
      )}

      {visible.map((p, i) => {
        const gap = i > 0 && p - visible[i - 1] > 1
        return (
          <span key={p} className="flex items-center gap-2">
            {gap && <span className="num px-1 text-faint">…</span>}
            {p === page ? (
              <span
                aria-current="page"
                className="num flex h-10 min-w-10 items-center justify-center rounded-sharp bg-ink px-3 text-sm font-medium text-paper"
              >
                {p}
              </span>
            ) : (
              <Link
                href={hrefFor(p)}
                className="num flex h-10 min-w-10 items-center justify-center rounded-sharp border border-hairline px-3 text-sm transition-all duration-200 hover:-translate-y-px hover:border-electric hover:text-electric"
              >
                {p}
              </Link>
            )}
          </span>
        )
      })}

      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={cn(arrow, 'hover:border-electric hover:text-electric')} aria-label="Next page">
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className={cn(arrow, 'opacity-30')} aria-hidden>
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  )
}
