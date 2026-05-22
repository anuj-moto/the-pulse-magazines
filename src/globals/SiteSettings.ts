import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { revalidateAfterGlobalChange } from '@/hooks/revalidate'

/** Site-wide identity, contact details, social links and analytics. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description: 'Site name, logo, contact email, social links and analytics.',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateAfterGlobalChange],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'The Pulse Magazines',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Where Every Story Matters',
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Default description used for SEO and social sharing.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional logo image. The wordmark is used if left blank.',
      },
    },
    {
      name: 'contactEmail',
      type: 'email',
      admin: {
        description: 'Contact-form messages are emailed here. Also shown on the Contact page.',
      },
    },
    {
      name: 'social',
      type: 'group',
      label: 'Social Links',
      admin: {
        description: 'Leave a field blank to hide that icon.',
      },
      fields: [
        { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
        { name: 'twitter', type: 'text', label: 'X / Twitter URL' },
        { name: 'instagram', type: 'text', label: 'Instagram URL' },
        { name: 'facebook', type: 'text', label: 'Facebook URL' },
        { name: 'youtube', type: 'text', label: 'YouTube URL' },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      label: 'Analytics',
      fields: [
        {
          name: 'gaMeasurementId',
          type: 'text',
          label: 'Google Analytics 4 ID',
          admin: {
            description: 'Format G-XXXXXXX. Leave blank to disable analytics entirely.',
          },
        },
      ],
    },
  ],
}
