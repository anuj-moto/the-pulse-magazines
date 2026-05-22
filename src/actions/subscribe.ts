'use server'

import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'

export type SubscribeState = {
  status: 'idle' | 'success' | 'duplicate' | 'error'
  message: string
}

const schema = z.object({
  email: z.email('Please enter a valid email address.'),
})

/** Newsletter signup — writes to the Subscribers collection. */
export async function subscribe(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  // Honeypot: bots fill hidden fields; humans leave them empty.
  if (formData.get('company')) {
    return { status: 'success', message: 'Thank you for subscribing.' }
  }

  const parsed = schema.safeParse({ email: formData.get('email') })
  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Please enter a valid email address.',
    }
  }

  const email = parsed.data.email.toLowerCase().trim()

  try {
    const payload = await getPayloadClient()
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return { status: 'duplicate', message: 'You are already on the list — thank you.' }
    }

    await payload.create({
      collection: 'subscribers',
      data: { email, status: 'active', source: 'website' },
    })

    return { status: 'success', message: 'Thank you for subscribing.' }
  } catch {
    return {
      status: 'error',
      message: 'Something went wrong. Please try again in a moment.',
    }
  }
}
