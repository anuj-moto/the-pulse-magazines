import { RichText } from '@payloadcms/richtext-lexical/react'
import { cn } from '@/lib/utils'

/**
 * Renders Payload Lexical rich text with the "Ink & Paper" long-form
 * typography. `dropCap` adds the signature crimson opening capital.
 */
export function RichTextRenderer({
  data,
  className,
  dropCap = false,
}: {
  data: unknown
  className?: string
  dropCap?: boolean
}) {
  if (!data) return null
  return (
    <div
      className={cn(
        'prose prose-lg max-w-none prose-pulse',
        dropCap && 'drop-cap',
        className,
      )}
    >
      <RichText data={data as never} />
    </div>
  )
}
