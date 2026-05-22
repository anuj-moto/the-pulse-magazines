import type { Field } from 'payload'

/** Combining diacritical marks (U+0300–U+036F) — stripped after NFKD normalize. */
const COMBINING_MARKS = /[̀-ͯ]/g

/** Convert arbitrary text into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize('NFKD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * A sidebar slug field that auto-fills from a source field (default `title`)
 * when left empty. Existing slugs are preserved verbatim — important for the
 * WordPress migration, which sets slugs explicitly to keep SEO URLs intact.
 */
export function slugField(source = 'title'): Field {
  return {
    name: 'slug',
    type: 'text',
    index: true,
    unique: true,
    admin: {
      position: 'sidebar',
      description:
        'The URL path for this entry. Auto-filled from the title — change it only with care, as it alters the public link.',
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === 'string' && value.trim().length > 0) {
            return slugify(value)
          }
          const fromSource = data?.[source]
          if (typeof fromSource === 'string' && fromSource.trim().length > 0) {
            return slugify(fromSource)
          }
          return value
        },
      ],
    },
  }
}
