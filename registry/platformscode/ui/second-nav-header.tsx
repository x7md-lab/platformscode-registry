import { cn } from "@/lib/utils"
import type { HTMLAttributes, ReactNode } from "react"

type Variant = "gray" | "white" | "dark"

const variants: Record<Variant, string> = {
  gray: "bg-muted text-muted-foreground",
  white: "bg-card text-muted-foreground border-b border-border",
  dark: "bg-[#104631] text-white/80",
}

/**
 * DGA «شريط التنقل الثانوي» — the slim utility bar above the main header
 * (weather, date, language switch, accessibility actions in the templates).
 */
export function SecondNavHeader({
  variant = "gray",
  content,
  actions,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  variant?: Variant
  content?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className={cn("w-full", variants[variant], className)} {...props}>
      <div className="mx-auto flex h-9 w-full max-w-3xl items-center justify-between gap-4 px-4 text-xs sm:px-5 lg:max-w-5xl">
        <div className="flex min-w-0 items-center gap-4 overflow-x-auto whitespace-nowrap">
          {content}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  )
}

export function SecondNavHeaderItem({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-xs", className)}
      {...props}
    />
  )
}
