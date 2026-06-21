export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className="border-b border-border/60 bg-card">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
        <h1 className="max-w-3xl text-balance font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  )
}
