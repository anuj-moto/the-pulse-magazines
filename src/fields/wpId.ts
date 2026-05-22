import type { Field } from 'payload'

/**
 * Hidden reference to the original WordPress post/term ID.
 * Used by the migration script (scripts/migrate-wp.ts) as the idempotency
 * key so the import can be safely re-run. Not shown to CMS users.
 */
export const wpIdField: Field = {
  name: 'wpId',
  type: 'number',
  index: true,
  admin: {
    hidden: true,
  },
}
