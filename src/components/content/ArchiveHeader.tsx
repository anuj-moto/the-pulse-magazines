/** Page header for listing/archive pages. */
export function ArchiveHeader({
  eyebrow,
  title,
  description,
  count,
}: {
  eyebrow?: string
  title: string
  description?: string | null
  count?: number
}) {
  return (
    <header className="border-b border-ink pb-8">
      {eyebrow && <p className="eyebrow text-crimson">{eyebrow}</p>}
      <h1 className="mt-2 font-serif text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          {description}
        </p>
      )}
      {count != null && (
        <p className="eyebrow mt-4 text-faint">
          {count} {count === 1 ? 'story' : 'stories'}
        </p>
      )}
    </header>
  )
}
