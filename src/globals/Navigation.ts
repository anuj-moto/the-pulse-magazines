import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '@/access'

/** Header and footer menus. */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation Menus',
  admin: {
    group: 'Settings',
    description: 'The links shown in the header and footer.',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'headerLinks',
      type: 'array',
      label: 'Header Menu',
      admin: {
        description: 'The section links in the main navigation bar.',
        initCollapsed: true,
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: { description: 'A path such as /category/business or /magazine.' },
        },
      ],
    },
    {
      name: 'footerColumns',
      type: 'array',
      label: 'Footer Columns',
      admin: {
        description: 'Grouped link columns shown in the footer.',
        initCollapsed: true,
      },
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
