import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'

/** Newsletter sign-ups. Created publicly by the signup form; managed by the owner. */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'source', 'subscribedAt'],
    group: 'Inbox',
    description: 'Newsletter sign-ups. Use the "Export CSV" button to download the full list.',
  },
  access: {
    // Anyone may subscribe; only logged-in users can read or manage the list.
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: '-subscribedAt',
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'website',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Where the sign-up came from.',
      },
    },
    {
      name: 'subscribedAt',
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
