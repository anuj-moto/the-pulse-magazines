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
        'flex items-end justify-between gap-4 border-b border-hairline-strong pb-4',
        className,
      )}
    >
      <div>
        {eyebrow && <p className="eyebrow text-electric">{eyebrow}</p>}
        <h2 className="mt-2 font-serif text-[1.75rem] leading-none font-normal tracking-[-0.018em] sm:text-[2rem]">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 pb-1 text-xs font-medium whitespace-nowrap text-ink hover:text-electric"
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
