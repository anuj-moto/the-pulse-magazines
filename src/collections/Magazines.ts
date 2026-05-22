import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '@/access'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { wpIdField } from '@/fields/wpId'

/** Magazine issues — each has a cover and a feature story. */
export const Magazines: CollectionConfig = {
  slug: 'magazines',
  labels: {
    singular: 'Magazine Issue',
    plural: 'Magazine Issues',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'issueDate', '_status'],
    group: 'Content',
    description: 'Cover stories published as magazine issues.',
    preview: (doc) => (doc?.slug ? `/magazine/${doc.slug as string}` : null),
  },
  versions: {
    drafts: {
      autosave: { interval: 800 },
    },
    maxPerDoc: 20,
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
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'A short summary shown on the magazine grid and the issue page.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'The issue cover — shown portrait on the magazine grid.',
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    seoField,
    // ── Sidebar ──────────────────────────────────────────────
    slugField('title'),
    {
      name: 'issueDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'MMMM yyyy' },
        description: 'The issue month.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    wpIdField,
  ],
}
