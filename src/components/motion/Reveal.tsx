'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  /** Stagger this element by N (typically the index in a grid). */
  delay?: number
  /** Horizontal slide instead of vertical. */
  direction?: 'up' | 'right'
  /** How tall the slide is, in pixels. */
  distance?: number
  className?: string
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'span'
}

/**
 * Fade + slide on scroll-into-view. Honours prefers-reduced-motion by
 * rendering the final state immediately with no animation.
 */
export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  distance = 18,
  className,
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] as typeof motion.div

  if (reduce) {
    const StaticTag = as as 'div'
    return <StaticTag className={className}>{children}</StaticTag>
  }

  const offset = direction === 'right' ? { x: -distance } : { y: distance }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -60px 0px' }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: delay * 0.06,
      }}
    >
      {children}
    </MotionTag>
  )
}
