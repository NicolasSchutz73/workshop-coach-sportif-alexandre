export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}) {
  return (
    <div
      className={
        align === 'center'
          ? 'mx-auto max-w-2xl text-center'
          : 'max-w-2xl text-left'
      }
    >
      {eyebrow && (
        <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance font-heading text-3xl font-extrabold leading-[1.04] tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}
