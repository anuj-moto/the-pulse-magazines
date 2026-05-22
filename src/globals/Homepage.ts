import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '@/access'

/**
 * Homepage curation. Every section has an automatic fallback, so the
 * homepage is never empty — the owner only fills these in to override.
 */
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  admin: {
    group: 'Settings',
    description: 'Choose the stories featured in each homepage section.',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Hero',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'heroArticle',
          type: 'relationship',
          relationTo: 'articles',
          admin: {
            description: 'The lead story. Leave blank to use the most recent article.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: "Editor's Choice",
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'editorsChoice',
          type: 'relationship',
          relationTo: 'articles',
          hasMany: true,
          admin: {
            description: 'Pick around six standout articles. Leave blank to use recent featured articles.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Latest Magazine Issue',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'featuredIssue',
          type: 'relationship',
          relationTo: 'magazines',
          admin: {
            description: 'Leave blank to use the most recent magazine issue.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Top Headlines',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'topHeadlines',
          type: 'relationship',
          relationTo: 'articles',
          hasMany: true,
          admin: {
            description: 'Pick around five news stories. Leave blank to use the latest Business & News articles.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Newsletter Section',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'newsletterHeading',
          type: 'text',
          defaultValue: 'Subscribe for exclusive content',
        },
        {
          name: 'newsletterText',
          type: 'textarea',
          defaultValue:
            'Get the journeys, strategies and ideas of those redefining business — delivered to your inbox.',
        },
      ],
    },
  ],
}
