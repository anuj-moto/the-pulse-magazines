import type { Field } from 'payload'

/**
 * Optional per-document SEO overrides. Every field falls back to a sensible
 * default (title, excerpt, featured image) when left blank — see lib/seo.ts.
 */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO & Social Sharing',
  admin: {
    description: 'Optional. Leave blank to use the title, excerpt and featured image.',
  },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Meta title',
      admin: {
        description: 'Overrides the browser-tab and search-result title. Aim for ~60 characters.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Meta description',
      admin: {
        description: 'The search-result summary. Aim for ~155 characters.',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Social share image',
      admin: {
        description: 'Shown when the page is shared on social media. Defaults to the featured image.',
      },
    },
  ],
}
