import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { sendContactNotification } from '@/hooks/contactEmail'

/** Messages sent through the site's contact form. */
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Contact Message',
    plural: 'Contact Messages',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'subject', 'handled', 'submittedAt'],
    group: 'Inbox',
    description: 'Messages sent through the contact form.',
  },
  access: {
    // Anyone may submit the form; only logged-in users can read messages.
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: '-submittedAt',
  hooks: {
    afterChange: [sendContactNotification],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'handled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Tick once you have replied to this message.',
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { displayFormat: 'd MMM yyyy, HH:mm' },
      },
    },
  ],
}
