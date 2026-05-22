import type { Magazine } from '@/payload-types'
import { buildMetadata } from '@/lib/seo'
import { getMagazines, PAGE_SIZE } from '@/lib/queries'
import { Container } from '@/components/layout/Container'
import { ArchiveHeader } from '@/components/content/ArchiveHeader'
import { MagazineCard } from '@/components/content/MagazineCard'
import { Pagination } from '@/components/content/Pagination'

export const revalidate = 300

export const metadata = buildMetadata({
  title: 'The Magazine',
  description:
    'Every issue of The Pulse Magazine — cover stories on the leaders, innovators and change-makers shaping business.',
  path: '/magazine',
})

export default async function MagazinePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const res = await getMagazines({ page, limit: PAGE_SIZE })

  return (
    <Container className="py-12 sm:py-16">
      <ArchiveHeader
        eyebrow="The Magazine"
        title="Cover Stories"
        description="In-depth conversations with the leaders, innovators and change-makers redefining their industries — one issue at a time."
        count={res.totalDocs}
      />
      {res.docs.length > 0 ? (
        <>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {(res.docs as Magazine[]).map((m, i) => (
              <MagazineCard key={m.id} magazine={m} priority={i < 4} />
            ))}
          </div>
          <Pagination page={page} totalPages={res.totalPages} basePath="/magazine" />
        </>
      ) : (
        <p className="mt-10 text-muted">No issues found.</p>
      )}
    </Container>
  )
}
