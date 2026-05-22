'use client'

import { useActionState } from 'react'
import { Check, Loader2, Send } from 'lucide-react'
import { submitContact, type ContactState } from '@/actions/submitContact'

const initialState: ContactState = { status: 'idle', message: '' }

const fieldClass =
  'h-12 w-full rounded-sharp border border-hairline bg-paper px-3.5 text-sm text-ink ' +
  'outline-none transition-colors placeholder:text-faint focus-visible:border-crimson'

/** Contact form with loading / success / error states. */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState)

  if (state.status === 'success') {
    return (
      <div className="flex flex-col items-start gap-3 rounded-sharp border border-hairline bg-paper-dim p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-crimson text-paper">
          <Check size={20} strokeWidth={2.5} />
        </span>
        <h3 className="font-serif text-xl font-semibold">Message sent</h3>
        <p className="text-sm text-muted">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* Honeypot */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="eyebrow mb-1.5 block text-faint">
            Name
          </label>
          <input id="name" name="name" required placeholder="Your name" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className="eyebrow mb-1.5 block text-faint">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="eyebrow mb-1.5 block text-faint">
          Subject <span className="normal-case">(optional)</span>
        </label>
        <input
          id="subject"
          name="subject"
          placeholder="What is this about?"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="eyebrow mb-1.5 block text-faint">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell us a little more…"
          className={fieldClass.replace('h-12', 'min-h-32 py-3') + ' resize-y'}
        />
      </div>

      {state.status === 'error' && (
        <p className="text-sm text-crimson" role="alert">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-sharp bg-ink px-7 text-sm font-medium text-paper transition-colors hover:bg-crimson disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send message <Send size={15} />
          </>
        )}
      </button>
    </form>
  )
}
