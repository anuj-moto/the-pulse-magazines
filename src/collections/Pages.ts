import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '@/access'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { wpIdField } from '@/fields/wpId'

/** Standalone pages — About, Privacy Policy, Terms of Use, Disclaimer. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
    group: 'Content',
    description: 'Standalone pages such as About, Privacy Policy and Terms.',
    preview: (doc) => (doc?.slug ? `/${doc.slug as string}` : null),
  },
  versions: {
    drafts: {
      autosave: { interval: 800 },
    },
    maxPerDoc: 10,
  },
  access: {
    read: publishedOrAuthenticated,
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
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Optional intro line shown beneath the page title.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    seoField,
    slugField('title'),
    wpIdField,
  ],
}
