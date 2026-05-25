import { Container } from '@/components/layout/Container'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { Reveal } from '@/components/motion/Reveal'

/** Full-width newsletter band — Signal panel with electric accent. */
export function NewsletterCTA({
  heading,
  text,
}: {
  heading: string
  text: string
}) {
  return (
    <section className="relative overflow-hidden border-y border-hairline bg-night text-paper">
      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(245,245,242,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Electric accent strip */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-electric" />

      <Container className="relative py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-16">
          <Reveal>
            <p className="eyebrow text-electric">The Pulse Newsletter · 06</p>
            <h2 className="mt-4 font-serif text-[2.25rem] leading-[1.05] font-normal tracking-[-0.018em] text-balance sm:text-[2.75rem]">
              {heading}
            </h2>
            <p className="mt-4 max-w-md text-paper/70">{text}</p>
          </Reveal>
          <Reveal delay={2}>
            <NewsletterForm tone="dark" />
            <p className="mt-3 text-xs text-paper/50">
              No spam — just the stories that matter. Unsubscribe anytime.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
