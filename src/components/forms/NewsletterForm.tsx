'use client'

import { useActionState } from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { subscribe, type SubscribeState } from '@/actions/subscribe'
import { MagneticButton } from '@/components/motion/MagneticButton'
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
          'flex items-center gap-3 text-sm font-medium',
          dark ? 'text-paper' : 'text-ink',
        )}
      >
        <span
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-full',
            dark ? 'bg-electric text-paper' : 'bg-electric text-paper',
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

      <div className="flex flex-col gap-3 sm:flex-row">
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
            'focus-visible:border-electric',
            dark
              ? 'border-paper/25 bg-transparent text-paper placeholder:text-paper/45'
              : 'border-hairline bg-paper text-ink placeholder:text-faint',
          )}
        />
        <MagneticButton>
          <button
            type="submit"
            disabled={pending}
            className={cn(
              'inline-flex h-12 items-center justify-center gap-2 rounded-sharp px-7 text-sm font-medium transition-colors disabled:opacity-60',
              dark
                ? 'bg-electric text-paper hover:bg-paper hover:text-ink'
                : 'bg-ink text-paper hover:bg-electric',
            )}
          >
            {pending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Subscribe <ArrowRight size={15} />
              </>
            )}
          </button>
        </MagneticButton>
      </div>

      {state.status === 'error' && (
        <p
          className={cn(
            'mt-2 text-sm',
            dark ? 'text-down' : 'text-down',
          )}
          role="alert"
        >
          {state.message}
        </p>
      )}
    </form>
  )
}
