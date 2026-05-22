/**
 * Static site constants and fallbacks.
 *
 * Most of this is also editable by the owner through the SiteSettings /
 * Navigation globals in the CMS — these values are the build-time defaults
 * and the fallback used before the globals are seeded.
 */

export const SITE = {
  name: 'The Pulse Magazines',
  shortName: 'The Pulse',
  tagline: 'Where Every Story Matters',
  description:
    'Showcasing the journeys, strategies, and influence of those redefining business, leadership, and innovation.',
  /** No trailing slash. */
  url: (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, ''),
  locale: 'en_US',
}

export type NavItem = {
  label: string
  href: string
}

/** Header navigation — the editorial sections, mirrors the original site. */
export const PRIMARY_NAV: NavItem[] = [
  { label: 'Magazine', href: '/magazine' },
  { label: 'Featured', href: '/category/featured' },
  { label: 'News', href: '/category/news' },
  { label: 'Business', href: '/category/business' },
  { label: 'Health & Wellness', href: '/category/health-wellness' },
  { label: 'Industry', href: '/category/industry' },
  { label: 'Tech', href: '/category/tech' },
]

/** Footer link columns. */
export const FOOTER_NAV: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Sections',
    items: [
      { label: 'Featured', href: '/category/featured' },
      { label: 'Business', href: '/category/business' },
      { label: 'News', href: '/category/news' },
      { label: 'Industry', href: '/category/industry' },
      { label: 'Health & Wellness', href: '/category/health-wellness' },
    ],
  },
  {
    heading: 'The Magazine',
    items: [
      { label: 'Latest Issues', href: '/magazine' },
      { label: 'All Articles', href: '/blog' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    items: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Use', href: '/terms-of-use' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
]

export const SOCIAL = {
  linkedin: 'https://www.linkedin.com/company/the-pulse-magazines',
}
