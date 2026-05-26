'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import type { Article, Media } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { DotGridOverlay } from './DotGridOverlay'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { primaryCategory } from '@/lib/content'
import { formatDate, isoDate, readingTime } from '@/lib/format'

/**
 * Full-viewport cinematic hero — the MVP section of the homepage.
 * Layered: cover image (with parallax) → bottom-up gradient → dot-grid →
 * masthead-style metadata, serif headline, excerpt, magnetic CTA, scroll cue.
 */
export function CinematicHero({ article }: { article: Article }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  // Parallax — image drifts slowly upward as the hero scrolls past.
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.6])

  const cat = primaryCategory(article)
  const cover = article.featuredImage as Media | null
  const coverUrl =
    cover && typeof cover === 'object' && cover.url
      ? cover.url.startsWith('http')
        ? new URL(cover.url).pathname
        : cover.url
      : null
  const mins = readingTime(article.content)
  const href = `/${article.slug}`

  // Stagger reveal config
  const item = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0 },
  }
  const stagger = {
    hidden: {},
    show: {
      transition: { delayChildren: 0.15, staggerChildren: 0.09 },
    },
  }

  return (
    <section
      ref={ref}
      className="relative isolate -mt-px min-h-[calc(100svh-var(--chrome-h))] w-full overflow-hidden bg-paper"
    >
      {/* Cover image (with parallax) */}
      {coverUrl ? (
        <motion.div
          aria-hidden
          style={{ y: imageY }}
          className="absolute inset-0 -z-20 will-change-transform"
        >
          <Image
            src={coverUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
      ) : (
        <div aria-hidden className="absolute inset-0 -z-20 bg-paper-dim" />
      )}

      {/* Vertical gradient mask — image at top, paper at bottom for legible text */}
      <motion.div
        aria-hidden
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 -z-10 bg-gradient-to-b from-paper/0 via-paper/70 to-paper"
      />
      {/* Side gradient for headline contrast */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-paper/85 via-paper/30 to-transparent"
      />
      {/* Dot grid */}
      <DotGridOverlay className="-z-10 opacity-50" />

      {/* Content */}
      <Container className="relative flex min-h-[calc(100svh-var(--chrome-h))] flex-col justify-center py-10 sm:py-14">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          {/* Eyebrow row */}
          <motion.div
            variants={item}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 text-faint"
          >
            <span aria-hidden className="h-px w-8 bg-ink/30" />
            <span className="eyebrow text-ink">
              {cat ? cat.title : 'Featured'}
            </span>
            <span aria-hidden className="text-hairline">·</span>
            <span className="eyebrow text-faint">The Cover Story</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-serif font-normal leading-[1.02] tracking-[-0.022em] text-ink text-balance"
            style={{ fontSize: 'clamp(2rem, 4.4vw + 0.5rem, 5rem)' }}
          >
            {article.title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            variants={item}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 line-clamp-2 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {article.excerpt}
          </motion.p>

          {/* Meta row */}
          <motion.div
            variants={item}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-faint"
          >
            <span className="num text-ink">
              <time dateTime={isoDate(article.publishedDate)}>
                {formatDate(article.publishedDate)}
              </time>
            </span>
            <span aria-hidden className="text-hairline">·</span>
            <span className="num">{mins} min read</span>
            <span aria-hidden className="text-hairline">·</span>
            <span className="eyebrow text-faint">The Pulse Magazines</span>
          </motion.div>

          {/* CTA row */}
          <motion.div
            variants={item}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex flex-wrap items-center gap-5"
          >
            <MagneticButton>
              <Link
                href={href}
                className="group/cta inline-flex items-center gap-3 rounded-sharp bg-ink py-4 pl-7 pr-5 text-sm font-medium text-paper transition-colors hover:bg-electric"
              >
                Read the full story
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-paper/15 transition-transform group-hover/cta:translate-x-0.5">
                  <ArrowRight size={14} strokeWidth={2} />
                </span>
              </Link>
            </MagneticButton>
            <Link
              href="/blog"
              className="link-underline text-sm font-medium text-ink/70 hover:text-ink"
            >
              Browse all stories
            </Link>
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll cue */}
      {!reduce && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-faint sm:flex"
        >
          <span className="eyebrow text-faint">Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ChevronDown size={16} strokeWidth={1.5} />
          </motion.span>
        </motion.div>
      )}
    </section>
  )
}
