import Link from 'next/link'
import { Camera, MessageCircle, Activity } from 'lucide-react'
import { getFooter } from '@/lib/footer'

export async function SiteFooter() {
  const content = await getFooter()
  const socials = [
    { href: content.instagramUrl, label: 'Instagram', icon: Camera },
    { href: content.whatsappUrl, label: 'WhatsApp', icon: MessageCircle },
    { href: content.nolioUrl, label: 'Nolio', icon: Activity },
  ]

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-18">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="font-heading text-xl font-medium tracking-[-0.05em]">
                {content.brandName}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-background/65">
              {content.description}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex size-10 items-center justify-center rounded-full border border-background/25 text-background/65 transition-colors hover:border-background hover:text-background"
                >
                  <s.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {content.columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.16em] text-background/55">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/75 transition-colors hover:text-background"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-background/20 pt-6 text-sm text-background/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {content.copyrightText}
          </p>
          <p className="font-mono text-xs uppercase tracking-wider">
            {content.locationText}
          </p>
        </div>
      </div>
    </footer>
  )
}
