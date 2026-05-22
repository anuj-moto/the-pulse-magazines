import { Search } from 'lucide-react'
import { searchArticles } from '@/lib/queries'
import { Container } from '@/components/layout/Container'
import { ArticleGrid } from '@/components/content/ArticleGrid'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Search',
  description: 'Search articles across The Pulse Magazines.',
  path: '/search',
  noindex: true,
})

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = (q ?? '').trim()
  const results = query ? await searchArticles(query) : []

  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-[760px]">
        <p className="eyebrow text-crimson">Search</p>
        <h1 className="mt-2 font-serif text-4xl leading-none font-semibold tracking-tight sm:text-5xl">
          Find a story
        </h1>

        <form action="/search" method="get" className="mt-8">
          <div className="flex items-center gap-2 border-b-2 border-ink pb-2">
            <Search size={20} className="shrink-0 text-faint" strokeWidth={1.75} />
            <label htmlFor="q" className="sr-only">
              Search articles
            </label>
            <input
              id="q"
              type="search"
              name="q"
              defaultValue={query}
              autoFocus
              placeholder="Search articles, people, topics…"
              className="h-10 w-full bg-transparent text-lg outline-none placeholder:text-faint"
            />
            <button
              type="submit"
              className="shrink-0 text-sm font-medium text-ink hover:text-crimson"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {query && (
        <p className="eyebrow mt-8 text-faint">
          {results.length} {results.length === 1 ? 'result' : 'results'} for “{query}”
        </p>
      )}

      {query && results.length > 0 && (
        <ArticleGrid articles={results} className="mt-6" />
      )}

      {query && results.length === 0 && (
        <p className="mt-6 text-muted">
          No stories matched your search. Try a different term.
        </p>
      )}
    </Container>
  )
}
