'use client'

import { useActionState } from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { subscribe, type SubscribeState } from '@/actions/subscribe'
import { cn } from '@/lib/utils'

const initialState: SubscribeState = { status: 'idle', message: '' }

/** Newsletter signup form. `tone` adapts it for light or dark backgrounds. */
export function NewsletterForm({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const [state, formAction, pending] = useActionState(subscribe, initialState)
  const dark = tone === 'dark'
  const done = state.status === 'success' || state.status === 'duplicate'

  if (done) {
    return (
      <p
        className={cn(
          'flex items-center gap-2 text-sm font-medium',
          dark ? 'text-paper' : 'text-ink',
        )}
      >
        <span
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full',
            dark ? 'bg-paper text-ink' : 'bg-crimson text-paper',
          )}
        >
          <Check size={14} strokeWidth={3} />
        </span>
        {state.message}
      </p>
    )
  }

  return (
    <form action={formAction} className="w-full">
      {/* Honeypot — hidden from users, catches bots. */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          className={cn(
            'h-12 flex-1 rounded-sharp border px-4 text-sm outline-none transition-colors',
            'focus-visible:border-crimson',
            dark
              ? 'border-paper/30 bg-transparent text-paper placeholder:text-paper/45'
              : 'border-hairline bg-paper text-ink placeholder:text-faint',
          )}
        />
        <button
          type="submit"
          disabled={pending}
          className={cn(
            'flex h-12 items-center justify-center gap-2 rounded-sharp px-6 text-sm font-medium transition-colors disabled:opacity-60',
            dark
              ? 'bg-paper text-ink hover:bg-crimson hover:text-paper'
              : 'bg-ink text-paper hover:bg-crimson',
          )}
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : <>Subscribe<ArrowRight size={15} /></>}
        </button>
      </div>

      {state.status === 'error' && (
        <p className="mt-2 text-sm text-crimson" role="alert">
          {state.message}
        </p>
      )}
    </form>
  )
}
