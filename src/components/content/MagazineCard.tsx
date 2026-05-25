import Link from 'next/link'
import type { Magazine } from '@/payload-types'
import { PayloadImage } from './PayloadImage'
import { formatMonth } from '@/lib/format'
import { cn } from '@/lib/utils'

/** Portrait magazine-issue cover card. */
export function MagazineCard({
  magazine,
  priority = false,
  className,
}: {
  magazine: Magazine
  priority?: boolean
  className?: string
}) {
  const href = `/magazine/${magazine.slug}`

  return (
    <article className={cn('group', className)}>
      <Link
        href={href}
        className="relative block overflow-hidden rounded-sharp border border-hairline"
      >
        <PayloadImage
          media={magazine.coverImage}
          ratio="3 / 4"
          priority={priority}
          sizes="(min-width:1024px) 280px, (min-width:640px) 33vw, 80vw"
          className="transition-transform duration-700 ease-editorial group-hover:scale-[1.05]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </Link>
      <p className="eyebrow mt-4 text-faint">{formatMonth(magazine.issueDate)}</p>
      <h3 className="mt-1.5 font-serif text-base leading-snug font-normal">
        <Link href={href} className="transition-colors group-hover:text-electric">
          {magazine.title}
        </Link>
      </h3>
    </article>
  )
}
