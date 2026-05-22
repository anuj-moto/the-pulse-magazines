import path from 'path'
import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'

/** Image library — featured images, magazine covers, in-article photos, avatars. */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    description: 'All images used across the site. Re-used by articles, magazine issues and authors.',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768 },
      { name: 'feature', width: 1280 },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image in a few words — used by screen readers and search engines.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption shown beneath the image.',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Optional photo credit or source.',
      },
    },
  ],
}
