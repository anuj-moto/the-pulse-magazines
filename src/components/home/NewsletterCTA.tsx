import { Container } from '@/components/layout/Container'
import { NewsletterForm } from '@/components/forms/NewsletterForm'

/** Full-width dark newsletter band. */
export function NewsletterCTA({
  heading,
  text,
}: {
  heading: string
  text: string
}) {
  return (
    <section className="bg-ink text-paper">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow text-paper/55">The Pulse Newsletter</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
              {heading}
            </h2>
            <p className="mt-3 max-w-md text-paper/70">{text}</p>
          </div>
          <div>
            <NewsletterForm tone="dark" />
            <p className="mt-3 text-xs text-paper/45">
              No spam — just the stories that matter. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
