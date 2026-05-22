/**
 * Export the newsletter list to a CSV file.
 *
 *   pnpm export:subscribers
 *
 * A command-line alternative to the "Export CSV" button in the CMS.
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

function csvCell(value: unknown): string {
  const s = String(value ?? '')
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

async function main() {
  const payload = await getPayload({ config })

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
      String(s.email ?? ''),
      String(s.status ?? ''),
      String(s.source ?? ''),
      String(s.subscribedAt ?? ''),
    ])
  }

  const csv = '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n'
  const file = path.resolve(
    process.cwd(),
    `subscribers-${new Date().toISOString().slice(0, 10)}.csv`,
  )
  fs.writeFileSync(file, csv)

  console.log(`Exported ${subscribers.docs.length} subscriber(s) → ${file}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Export failed:', err)
  process.exit(1)
})
