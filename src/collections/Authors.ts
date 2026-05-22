import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'
import { wpIdField } from '@/fields/wpId'

/** Bylined writers. */
export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role'],
    group: 'Site Structure',
    description: 'Writers and contributors credited on articles.',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField('name'),
    {
      name: 'role',
      type: 'text',
      admin: {
        description: 'e.g. "Staff Writer", "Editor", "Contributor".',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'A short biography shown on the author page.',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    wpIdField,
  ],
}
