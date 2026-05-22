import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-28 text-center sm:py-36">
      <p className="eyebrow text-crimson">Error 404</p>
      <h1 className="mt-5 font-serif text-5xl leading-none font-semibold tracking-tight sm:text-6xl">
        Page not found
      </h1>
      <p className="mt-5 max-w-md text-muted">
        The story you’re looking for may have moved, been renamed, or never
        existed. Let’s get you back on track.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={buttonVariants({ variant: 'primary' })}>
          Back to home
        </Link>
        <Link href="/blog" className={buttonVariants({ variant: 'outline' })}>
          Browse all stories
        </Link>
      </div>
    </Container>
  )
}
