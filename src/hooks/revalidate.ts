import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Revalidate the whole public site. Wrapped in try/catch because Payload
 * hooks also run from the migration script, where there is no Next.js
 * request scope — there the call simply no-ops.
 */
function revalidateSite() {
  try {
    revalidatePath('/', 'layout')
  } catch {
    /* outside a request scope — ignore */
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidateSite()
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateSite()
  return doc
}

export const revalidateAfterGlobalChange: GlobalAfterChangeHook = ({ doc }) => {
  revalidateSite()
  return doc
}
