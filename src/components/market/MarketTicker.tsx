import { getMarketSnapshot } from '@/lib/market'
import { Marquee } from '@/components/motion/Marquee'
import { TickerChip } from './TickerChip'

/** Re-fetch the snapshot at most once a minute. */
export const revalidate = 60

/** Live market ticker — dark band, mono numerics, marquee scroll. */
export async function MarketTicker() {
  const snapshot = await getMarketSnapshot()
  const items = [...snapshot.stocks, ...snapshot.crypto]

  // Nothing came back from either provider — hide the band rather than
  // shipping an empty bar.
  if (items.length === 0) return null

  return (
    <div
      role="region"
      aria-label="Live market data"
      className="relative border-b border-night-2 bg-night text-paper"
    >
      {/* Faint pulse stripe for "live" feel */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-px bg-electric"
      />
      <div className="flex items-stretch">
        <span className="flex shrink-0 items-center gap-2 border-r border-night-2 px-4 py-2 text-[0.6875rem] font-mono uppercase tracking-wider text-paper/65">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-up opacity-75" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-up" />
          </span>
          Live
        </span>
        <Marquee className="py-2 flex-1" gap="gap-9">
          {items.map((item) => (
            <TickerChip key={`${item.source}-${item.symbol}`} item={item} />
          ))}
        </Marquee>
      </div>
    </div>
  )
}
