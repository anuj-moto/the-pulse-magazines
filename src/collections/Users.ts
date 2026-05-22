import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access'

/** CMS login accounts (the site owner + developers). */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
    description: 'People who can log in to manage the website.',
  },
  auth: true,
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
    admin: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      admin: {
        description: 'Both roles have full access to manage content. For your records.',
      },
    },
  ],
}
