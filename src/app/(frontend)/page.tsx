import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { buttonVariants } from '@/components/ui/button'
import { SITE } from '@/lib/site'

/**
 * Placeholder homepage — the data-driven homepage (Editor's Choice,
 * Latest Issue, Top Headlines, Testimonials, Latest Posts) is built in
 * Phase 6 once the WordPress content has been migrated.
 */
export default function HomePage() {
  return (
    <Container className="flex flex-col items-center py-24 text-center sm:py-32">
      <p className="eyebrow text-crimson">Business · Leadership · Innovation</p>
      <h1 className="mt-6 max-w-4xl font-serif text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-ink sm:text-6xl lg:text-7xl">
        Where every story matters.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
        {SITE.description}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="/blog" className={buttonVariants({ variant: 'primary' })}>
          Read the latest
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
        <Link href="/magazine" className={buttonVariants({ variant: 'outline' })}>
          Browse the magazine
        </Link>
      </div>
      <hr className="rule mt-20 w-full max-w-md" />
      <p className="mt-6 max-w-md text-sm text-faint">
        The redesigned homepage is assembled section by section in the next build
        phase, once existing articles and magazine issues have been migrated.
      </p>
    </Container>
  )
}
