'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Animates a numeric value from a start to an end on first paint, then
 * tweens whenever the target changes (used by live ticker chips).
 */
export function CountUp({
  value,
  decimals = 2,
  duration = 0.9,
  prefix = '',
  suffix = '',
  className,
}: {
  value: number
  decimals?: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(value)
  const lastValueRef = useRef(value)

  useEffect(() => {
    if (reduce) {
      lastValueRef.current = value
      // Schedule the state write so it doesn't fire synchronously inside
      // the effect body (the lint rule that flags cascading renders).
      const id = requestAnimationFrame(() => setDisplay(value))
      return () => cancelAnimationFrame(id)
    }

    const start = lastValueRef.current
    const end = value
    if (start === end) return
    const startTs = performance.now()
    let frame = 0

    function tick(now: number) {
      const t = Math.min(1, (now - startTs) / (duration * 1000))
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      const next = start + (end - start) * eased
      setDisplay(next)
      if (t < 1) frame = requestAnimationFrame(tick)
      else lastValueRef.current = end
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration, reduce])

  const formatted = display.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
