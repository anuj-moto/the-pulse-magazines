import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import { getMagazineBySlug, getAllMagazineSlugs } from '@/lib/queries'
import { Container } from '@/components/layout/Container'
import { PayloadImage } from '@/components/content/PayloadImage'
import { RichTextRenderer } from '@/components/content/RichTextRenderer'
import { ShareButtons } from '@/components/content/ShareButtons'
import { formatMonth } from '@/lib/format'
import { buildMetadata, mediaUrl } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const revalidate = 300

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllMagazineSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const magazine = await getMagazineBySlug(slug)
  if (!magazine) return { title: 'Not found', robots: { index: false } }
  return buildMetadata({
    title: magazine.seo?.metaTitle || magazine.title,
    description: magazine.seo?.metaDescription || magazine.excerpt,
    path: `/magazine/${magazine.slug}`,
    image: mediaUrl(magazine.seo?.ogImage) || mediaUrl(magazine.coverImage),
    type: 'article',
    publishedTime: magazine.issueDate || undefined,
  })
}

export default async function MagazineDetailPage({ params }: Params) {
  const { slug } = await params
  const magazine = await getMagazineBySlug(slug)
  if (!magazine) notFound()

  const url = `${SITE.url}/magazine/${magazine.slug}`

  return (
    <article className="py-10 sm:py-14">
      <Container>
        <Link
          href="/magazine"
          className="group inline-flex items-center gap-2 text-sm font-medium text-faint hover:text-crimson"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
          The Magazine
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <PayloadImage
              media={magazine.coverImage}
              priority
              sizes="(min-width:1024px) 460px, 100vw"
              className="rounded-sharp border border-hairline"
            />
          </div>
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="eyebrow text-crimson">
              {formatMonth(magazine.issueDate)} · Issue
            </p>
            <h1 className="mt-3 font-serif text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.9rem]">
              {magazine.title}
            </h1>
            {magazine.excerpt && (
              <p className="mt-5 text-lg leading-relaxed text-muted">
                {magazine.excerpt}
              </p>
            )}
            <div className="mt-7">
              <ShareButtons url={url} title={magazine.title} />
            </div>
          </div>
        </div>
      </Container>

      {magazine.content ? (
        <Container className="mt-14 max-w-[720px]">
          <RichTextRenderer data={magazine.content} />
        </Container>
      ) : null}
    </article>
  )
}
