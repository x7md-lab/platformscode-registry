import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

export type Crumb = {
  label: string
  href?: string
  disabled?: boolean
}

export function Breadcrumbs({
  items,
  label = "مسار التنقل",
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  items: Crumb[]
  label?: string
}) {
  return (
    <nav aria-label={label} className={cn("w-full", className)} {...props}>
      <ol className="m-0 flex flex-wrap items-center gap-1 p-0">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={item.label} className="flex list-none items-center gap-1">
              {index > 0 ? (
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  size={16}
                  strokeWidth={2}
                  className="shrink-0 text-muted-foreground ltr:rotate-180"
                  aria-hidden
                />
              ) : null}
              {last || !item.href || item.disabled ? (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(
                    "px-1 text-sm",
                    last ? "text-muted-foreground" : "text-foreground",
                    item.disabled ? "cursor-not-allowed opacity-60" : undefined
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="rounded-sm px-1 text-sm text-foreground no-underline hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
                >
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
