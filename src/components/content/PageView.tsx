import type { Page } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { RichTextRenderer } from './RichTextRenderer'

/** Standalone page (About, legal) reading view. */
export function PageView({ page }: { page: Page }) {
  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-[780px]">
        <header className="border-b border-hairline-strong pb-10">
          <h1 className="font-serif text-[2.4rem] leading-[1.04] font-normal tracking-[-0.022em] sm:text-[3.5rem]">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="mt-5 text-lg leading-relaxed text-muted">{page.subtitle}</p>
          )}
        </header>
      </Container>
      <Container className="mt-12 max-w-[720px]">
        <RichTextRenderer data={page.content} />
      </Container>
    </article>
  )
}
