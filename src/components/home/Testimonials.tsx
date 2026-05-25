import type { Testimonial } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/content/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'

/** Reader testimonials grid with hairline dividers. */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null

  return (
    <section>
      <Container className="py-16 sm:py-24">
        <Reveal>
          <SectionHeading eyebrow="Readers · 05" title="What Our Audience Says" />
        </Reveal>
        <div className="mt-10 grid border border-hairline sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.id}
              delay={i}
              as="div"
              className="flex flex-col border-hairline p-8 transition-colors hover:bg-paper-dim [&:not(:last-child)]:border-b sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:not(:nth-child(3n))]:border-r"
            >
              <span className="num mb-5 text-[0.7rem] text-electric">
                {String(i + 1).padStart(2, '0')}
              </span>
              <blockquote className="flex-1 font-serif text-lg leading-[1.45] text-ink">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-hairline pt-4">
                <p className="text-sm font-medium text-ink">{t.authorName}</p>
                {t.authorTitle && (
                  <p className="mt-1 text-xs text-faint">{t.authorTitle}</p>
                )}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
