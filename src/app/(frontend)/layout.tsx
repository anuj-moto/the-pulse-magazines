import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Instrument_Serif, Inter, IBM_Plex_Mono } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JsonLd } from '@/components/seo/JsonLd'
import { MarketTicker } from '@/components/market/MarketTicker'
import { ScrollProgress } from '@/components/motion/ScrollProgress'
import { organizationSchema, websiteSchema } from '@/lib/jsonld'
import { SITE } from '@/lib/site'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-instrument',
  style: ['normal', 'italic'],
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-paper text-ink">
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <ScrollProgress />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sharp focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-paper"
        >
          Skip to content
        </a>
        {/* Live ticker. Suspense so the rest of the layout streams even if
            market APIs are slow on first render. */}
        <Suspense fallback={null}>
          <MarketTicker />
        </Suspense>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
