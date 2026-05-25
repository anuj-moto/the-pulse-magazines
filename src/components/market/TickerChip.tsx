'use client'

import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { TickerData } from '@/lib/market'
import { CountUp } from '@/components/motion/CountUp'
import { cn } from '@/lib/utils'

/** A single price chip on the marquee. */
export function TickerChip({ item }: { item: TickerData }) {
  const isUp = item.change >= 0
  const Arrow = isUp ? ArrowUpRight : ArrowDownRight
  const decimals = item.source === 'crypto' && item.price < 10 ? 4 : 2

  return (
    <span className="flex items-center gap-2.5 whitespace-nowrap text-[0.78rem]">
      <span className="font-mono uppercase tracking-wider text-paper/55">
        {item.label}
      </span>
      <CountUp
        className="num text-paper"
        value={item.price}
        decimals={decimals}
        prefix={item.source === 'crypto' ? '$' : ''}
      />
      <span
        className={cn(
          'inline-flex items-center gap-0.5 num font-medium',
          isUp ? 'text-up' : 'text-down',
        )}
      >
        <Arrow size={12} strokeWidth={2.5} aria-hidden />
        {item.changePercent >= 0 ? '+' : ''}
        {item.changePercent.toFixed(2)}%
      </span>
    </span>
  )
}
