'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { XIcon, LinkedInIcon } from '@/components/icons'

/** Social share + copy-link controls for article and magazine pages. */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  const share = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  const btn =
    'flex h-10 w-10 items-center justify-center rounded-sharp border border-hairline text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper'

  return (
    <div className="flex items-center gap-2">
      <span className="eyebrow mr-1 text-faint">Share</span>
      <a className={btn} href={share.x} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
        <XIcon size={15} />
      </a>
      <a
        className={btn}
        href={share.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon size={15} />
      </a>
      <button type="button" onClick={copy} className={btn} aria-label="Copy link">
        {copied ? <Check size={15} /> : <Link2 size={15} />}
      </button>
    </div>
  )
}
