'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/** Pinned 2px electric progress bar that fills as the page scrolls. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.4,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px] bg-electric"
    />
  )
}
