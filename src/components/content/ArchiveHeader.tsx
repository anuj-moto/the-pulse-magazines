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
    <header className="border-b border-hairline-strong pb-10">
      {eyebrow && <p className="eyebrow text-electric">{eyebrow}</p>}
      <h1 className="mt-3 font-serif text-[2.4rem] leading-[1.04] font-normal tracking-[-0.022em] sm:text-[3.5rem]">
        {title}
      </h1>
      {description && (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          {description}
        </p>
      )}
      {count != null && (
        <p className="eyebrow mt-5 text-faint">
          <span className="num">{count}</span> {count === 1 ? 'story' : 'stories'}
        </p>
      )}
    </header>
  )
}
