import type { Testimonial } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/content/SectionHeading'

/** Reader testimonials grid with hairline dividers. */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null

  return (
    <section>
      <Container className="py-14 sm:py-20">
        <SectionHeading eyebrow="Readers" title="What Our Audience Says" />
        <div className="mt-8 grid border border-hairline sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col border-hairline p-7 [&:not(:last-child)]:border-b sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:not(:nth-child(3n))]:border-r"
            >
              <blockquote className="flex-1 font-serif text-lg leading-relaxed text-ink italic">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-hairline pt-4">
                <p className="text-sm font-semibold text-ink">{t.authorName}</p>
                {t.authorTitle && (
                  <p className="mt-0.5 text-xs text-faint">{t.authorTitle}</p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  )
}
