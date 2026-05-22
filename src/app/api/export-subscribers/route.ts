import { headers as nextHeaders } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'

/** Escape a value for a CSV cell. */
function csvCell(value: unknown): string {
  const s = String(value ?? '')
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/**
 * GET /api/export-subscribers
 * Returns the newsletter list as a CSV download. Requires a logged-in
 * CMS user — used by the "Export CSV" button on the Subscribers screen.
 */
export async function GET() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await nextHeaders() })

  if (!user) {
    return new Response('Unauthorized — please log in to the CMS.', { status: 401 })
  }

  const subscribers = await payload.find({
    collection: 'subscribers',
    depth: 0,
    limit: 100000,
    pagination: false,
    sort: '-subscribedAt',
  })

  const rows = [['Email', 'Status', 'Source', 'Subscribed At']]
  for (const s of subscribers.docs) {
    rows.push([
      s.email as string,
      (s.status as string) ?? '',
      (s.source as string) ?? '',
      (s.subscribedAt as string) ?? '',
    ])
  }

  // Prepend a BOM so Excel reads UTF-8 correctly.
  const csv = '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n')
  const date = new Date().toISOString().slice(0, 10)

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="pulse-subscribers-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
