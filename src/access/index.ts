import type { Access } from 'payload'

/** Public — anyone can read. */
export const anyone: Access = () => true

/** Any logged-in CMS user. */
export const authenticated: Access = ({ req }) => Boolean(req.user)

/**
 * Read access for collections with draft/published status:
 * logged-in users see everything, the public sees only published docs.
 */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}
