import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'

/** Reader testimonials shown in the homepage "What our audience says" section. */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'authorTitle', 'featured', 'order'],
    group: 'Content',
    description: 'Quotes from readers, displayed on the homepage.',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'authorTitle',
      type: 'text',
      admin: {
        description: 'Role or profession, e.g. "Media Professional", "Entrepreneur".',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Show this testimonial on the homepage.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Display order — lower numbers appear first.',
      },
    },
  ],
}
