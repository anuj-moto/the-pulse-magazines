'use client'

import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useRef, type ReactNode, type MouseEvent } from 'react'

/**
 * Pulls the inner content slightly toward the cursor on hover. Works as
 * a wrapper around buttons or links; pointer-events stay on the child.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.32,
}: {
  children: ReactNode
  className?: string
  /** Fraction of the cursor offset the element follows (0–1). */
  strength?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 240, damping: 22, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 240, damping: 22, mass: 0.6 })
  const reduce = useReducedMotion()

  function onMove(e: MouseEvent<HTMLSpanElement>) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = e.clientX - (rect.left + rect.width / 2)
    const cy = e.clientY - (rect.top + rect.height / 2)
    x.set(cx * strength)
    y.set(cy * strength)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`inline-block ${className ?? ''}`}
    >
      <motion.span style={{ x: springX, y: springY }} className="inline-block">
        {children}
      </motion.span>
    </span>
  )
}
