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
      <Link href={href} className="block">
        <PayloadImage
          media={magazine.coverImage}
          ratio="3 / 4"
          priority={priority}
          sizes="(min-width:1024px) 280px, (min-width:640px) 33vw, 80vw"
          className="rounded-sharp border border-hairline transition-transform duration-300 group-hover:-translate-y-1"
        />
      </Link>
      <p className="eyebrow mt-3 text-faint">{formatMonth(magazine.issueDate)}</p>
      <h3 className="mt-1 font-serif text-base leading-snug font-semibold">
        <Link href={href} className="transition-colors group-hover:text-crimson">
          {magazine.title}
        </Link>
      </h3>
    </article>
  )
}
