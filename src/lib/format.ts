/** Display helpers — dates, reading time, plain-text extraction. */

/** "18 May 2026" */
export function formatDate(input: string | Date | null | undefined): string {
  if (!input) return ''
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** "May 2026" — for magazine issues. */
export function formatMonth(input: string | Date | null | undefined): string {
  if (!input) return ''
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

/** ISO date for <time dateTime> attributes. */
export function isoDate(input: string | Date | null | undefined): string {
  if (!input) return ''
  const d = new Date(input)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString()
}

/** Estimate reading time in minutes from a Lexical rich-text value. */
export function readingTime(content: unknown): number {
  let words = 0
  const walk = (node: any) => {
    if (!node || typeof node !== 'object') return
    if (typeof node.text === 'string') {
      words += node.text.trim().split(/\s+/).filter(Boolean).length
    }
    if (Array.isArray(node.children)) node.children.forEach(walk)
  }
  walk((content as any)?.root)
  return Math.max(1, Math.round(words / 200))
}

/** Truncate plain text to a length on a word boundary. */
export function truncate(text: string, max = 160): string {
  if (!text || text.length <= max) return text || ''
  return text.slice(0, text.lastIndexOf(' ', max)).trimEnd() + '…'
}
