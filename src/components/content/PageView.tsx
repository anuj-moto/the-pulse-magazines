import type { Page } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { RichTextRenderer } from './RichTextRenderer'

/** Standalone page (About, legal) reading view. */
export function PageView({ page }: { page: Page }) {
  return (
    <article className="py-12 sm:py-16">
      <Container className="max-w-[760px]">
        <header className="border-b border-ink pb-8">
          <h1 className="font-serif text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="mt-4 text-lg leading-relaxed text-muted">{page.subtitle}</p>
          )}
        </header>
      </Container>
      <Container className="mt-10 max-w-[720px]">
        <RichTextRenderer data={page.content} />
      </Container>
    </article>
  )
}
