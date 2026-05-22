/**
 * Custom admin component — an "Export CSV" button shown above the
 * Subscribers list. Downloads the newsletter list via the auth-protected
 * /api/export-subscribers route.
 */
export function ExportSubscribersButton() {
  return (
    <div style={{ marginBottom: 'var(--base, 1.25rem)' }}>
      <a
        href="/api/export-subscribers"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.55rem 1rem',
          borderRadius: '2px',
          border: '1px solid var(--theme-elevation-150)',
          background: 'var(--theme-elevation-50)',
          color: 'var(--theme-elevation-800)',
          fontSize: '0.8rem',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        ↓ Export CSV
      </a>
    </div>
  )
}
