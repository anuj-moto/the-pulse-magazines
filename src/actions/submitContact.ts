'use server'

import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.'),
  email: z.email('Please enter a valid email address.'),
  subject: z.string().trim().optional(),
  message: z
    .string()
    .trim()
    .min(10, 'Your message is a little short — please add more detail.'),
})

/** Contact form handler — stores the message and triggers the owner email. */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot.
  if (formData.get('company')) {
    return { status: 'success', message: 'Thank you — your message has been sent.' }
  }

  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Please check the form and try again.',
    }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-submissions',
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        subject: parsed.data.subject || undefined,
        message: parsed.data.message,
      },
    })
    return {
      status: 'success',
      message: 'Thank you — your message has been sent. We’ll be in touch soon.',
    }
  } catch {
    return {
      status: 'error',
      message: 'Something went wrong sending your message. Please try again in a moment.',
    }
  }
}
