import Image from 'next/image'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

type PayloadImageProps = {
  media?: number | Media | null
  alt?: string
  /** Classes for the wrapper box. */
  className?: string
  /** next/image `sizes` hint. */
  sizes?: string
  priority?: boolean
  /** CSS aspect-ratio for the wrapper, e.g. "16 / 10". */
  ratio?: string
}

/**
 * next/image wrapper for Payload media. Falls back to a branded
 * placeholder when an image is missing.
 */
export function PayloadImage({
  media,
  alt,
  className,
  sizes = '100vw',
  priority = false,
  ratio,
}: PayloadImageProps) {
  const m = media && typeof media === 'object' ? media : null
  // Payload may emit an absolute URL (it depends on serverURL); next/image
  // wants a same-origin path, so reduce it to a relative one.
  const raw = m?.url
  const url = raw?.startsWith('http')
    ? new URL(raw).pathname + new URL(raw).search
    : raw
  // Explicit ratio crops; otherwise use the image's own dimensions.
  const effectiveRatio =
    ratio ?? (m?.width && m?.height ? `${m.width} / ${m.height}` : '16 / 10')
  const style = { aspectRatio: effectiveRatio }

  if (!url) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-paper-dim',
          className,
        )}
        style={style}
      >
        <span className="font-serif text-xl text-hairline">The Pulse</span>
      </div>
    )
  }

  return (
    <div
      className={cn('relative overflow-hidden bg-paper-dim', className)}
      style={style}
    >
      <Image
        src={url}
        alt={alt ?? m?.alt ?? ''}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  )
}
