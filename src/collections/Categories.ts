import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'
import { wpIdField } from '@/fields/wpId'

/** Editorial sections — Business, Featured, News, Health & Wellness, etc. */
export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    group: 'Site Structure',
    description: 'The sections articles and magazine issues are filed under.',
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
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'A short intro shown at the top of the section page.',
      },
    },
    wpIdField,
  ],
}
