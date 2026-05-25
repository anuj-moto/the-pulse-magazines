import { cn } from '@/lib/utils'

/** Subtle dot-grid overlay — a touch of futurist atmosphere. */
export function DotGridOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(13,13,13,0.16) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        maskImage:
          'radial-gradient(ellipse 60% 80% at 50% 30%, black 35%, transparent 100%)',
      }}
    />
  )
}
