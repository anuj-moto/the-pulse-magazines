import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ContactForm } from '@/components/forms/ContactForm'
import { LinkedInIcon } from '@/components/icons'
import { getSiteSettings } from '@/lib/queries'
import { SOCIAL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with The Pulse Magazines — share a story, propose a collaboration, or simply say hello.',
}

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const email = settings?.contactEmail
  const linkedin = settings?.social?.linkedin || SOCIAL.linkedin

  return (
    <Container className="py-12 sm:py-16">
      <header className="max-w-[760px] border-b border-ink pb-8">
        <p className="eyebrow text-crimson">Contact</p>
        <h1 className="mt-2 font-serif text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl">
          Get in touch
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          We’re not just a magazine — we’re a movement. Whether you’re a reader
          with a story, a brand with a vision, or a creator looking to
          collaborate, we’d love to hear from you.
        </p>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
        {/* Contact details */}
        <div className="flex flex-col gap-8">
          {email && (
            <div>
              <h2 className="eyebrow text-faint">Email</h2>
              <a
                href={`mailto:${email}`}
                className="mt-2 inline-flex items-center gap-2 font-serif text-lg text-ink hover:text-crimson"
              >
                <Mail size={17} strokeWidth={1.75} />
                {email}
              </a>
            </div>
          )}
          {linkedin && (
            <div>
              <h2 className="eyebrow text-faint">Follow</h2>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 font-serif text-lg text-ink hover:text-crimson"
              >
                <LinkedInIcon size={16} />
                LinkedIn
              </a>
            </div>
          )}
          <div>
            <h2 className="eyebrow text-faint">Have a story?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              We profile leaders, innovators and change-makers across business
              and beyond. Use the form to pitch a feature or nominate someone
              worth spotlighting.
            </p>
          </div>
        </div>

        {/* Form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </Container>
  )
}
