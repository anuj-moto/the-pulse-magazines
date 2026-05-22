import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'
import { wpIdField } from '@/fields/wpId'

/** Topic tags — finer-grained than categories. */
export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    group: 'Site Structure',
    description: 'Keywords used to group related articles.',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField('title'),
    wpIdField,
  ],
}
