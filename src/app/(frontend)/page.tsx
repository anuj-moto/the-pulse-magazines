import { getHomepageData } from '@/lib/queries'
import { Hero } from '@/components/home/Hero'
import { EditorsChoice } from '@/components/home/EditorsChoice'
import { LatestIssueHeadlines } from '@/components/home/LatestIssueHeadlines'
import { LatestPosts } from '@/components/home/LatestPosts'
import { Testimonials } from '@/components/home/Testimonials'
import { NewsletterCTA } from '@/components/home/NewsletterCTA'

/** Re-generate the homepage at most every 5 minutes (plus on content edits). */
export const revalidate = 300

export default async function HomePage() {
  const data = await getHomepageData()

  return (
    <>
      {data.hero && <Hero article={data.hero} />}
      <EditorsChoice articles={data.editorsChoice} />
      <LatestIssueHeadlines magazine={data.latestIssue} headlines={data.topHeadlines} />
      <LatestPosts articles={data.latestPosts} />
      <Testimonials testimonials={data.testimonials} />
      <NewsletterCTA heading={data.newsletterHeading} text={data.newsletterText} />
    </>
  )
}
