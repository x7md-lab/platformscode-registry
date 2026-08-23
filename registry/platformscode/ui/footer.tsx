import { cn } from "@/lib/utils"
import type { HTMLAttributes, ReactNode } from "react"

export type FooterLink = {
  label: string
  href: string
}

export type FooterGroup = {
  title: string
  links: FooterLink[]
}

type Tone = "default" | "brand"

const tones: Record<Tone, string> = {
  default: "bg-muted text-foreground",
  brand: "bg-[#104631] text-white",
}

export function Footer({
  logo,
  groups = [],
  actions = [],
  extraActions = [],
  copyright,
  tone = "default",
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  logo?: ReactNode
  groups?: FooterGroup[]
  actions?: FooterLink[]
  extraActions?: FooterLink[]
  copyright?: string
  tone?: Tone
}) {
  const onBrand = tone === "brand"
  const linkClass = cn(
    "rounded-sm text-sm no-underline underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-[3px]",
    onBrand
      ? "text-white/80 hover:text-white focus-visible:ring-white/60"
      : "text-muted-foreground hover:text-foreground focus-visible:ring-ring/40"
  )
  const dividerClass = onBrand ? "border-white/20" : "border-border"

  return (
    <footer className={cn("w-full", tones[tone], className)} {...props}>
      <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-8 sm:px-5 lg:max-w-5xl">
        {groups.length ? (
          <div className="flex flex-wrap gap-8 pb-8">
            {groups.map((group) => (
              <div key={group.title} className="flex min-w-45 flex-col gap-3">
                <span
                  className={cn(
                    "border-0 border-b border-solid pb-2 text-sm font-bold",
                    dividerClass,
                    onBrand ? "text-white" : "text-foreground"
                  )}
                >
                  {group.title}
                </span>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={linkClass}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}

        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-6 border-0 border-t border-solid py-6",
            dividerClass
          )}
        >
          <div className="flex flex-1 flex-col gap-4">
            {actions.length ? (
              <ul className="m-0 flex list-none flex-wrap items-center gap-5 p-0">
                {actions.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className={cn(linkClass, "font-semibold")}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {extraActions.length ? (
              <ul className="m-0 flex list-none flex-wrap items-center gap-4 p-0">
                {extraActions.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className={cn(linkClass, "text-xs")}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {copyright ? (
              <p
                className={cn(
                  "m-0 text-xs",
                  onBrand ? "text-white/70" : "text-muted-foreground"
                )}
              >
                {copyright}
              </p>
            ) : null}
          </div>
          {logo ? <div className="flex items-center gap-4">{logo}</div> : null}
        </div>
      </div>
    </footer>
  )
}
