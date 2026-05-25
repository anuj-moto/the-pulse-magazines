import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

/**
 * Seamless horizontal marquee. Duplicates the row once so the CSS
 * `translateX(-50%)` loop is perfectly continuous. Pauses on hover.
 * Pure CSS — no JS framework needed.
 */
export function Marquee({
  children,
  className,
  gap = 'gap-10',
}: {
  children: ReactNode
  className?: string
  gap?: string
}) {
  return (
    <div className={cn('group/marquee flex w-full overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-max shrink-0 items-center animate-marquee',
          gap,
          'group-hover/marquee:[animation-play-state:paused]',
        )}
      >
        {children}
        <div aria-hidden className={cn('flex w-max shrink-0 items-center', gap)}>
          {children}
        </div>
      </div>
    </div>
  )
}
