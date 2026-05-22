import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Editorial section header — eyebrow + serif title, with optional link. */
export function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel = 'View all',
  className,
}: {
  eyebrow?: string
  title: string
  href?: string
  linkLabel?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-end justify-between gap-4 border-b border-ink pb-3',
        className,
      )}
    >
      <div>
        {eyebrow && <p className="eyebrow text-crimson">{eyebrow}</p>}
        <h2 className="mt-1.5 font-serif text-2xl leading-none font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 pb-1 text-xs font-medium whitespace-nowrap text-ink hover:text-crimson"
        >
          {linkLabel}
          <ArrowRight
            size={13}
            strokeWidth={2}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  )
}
