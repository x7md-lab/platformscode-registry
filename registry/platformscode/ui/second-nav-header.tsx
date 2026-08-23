import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import type { HTMLAttributes, ReactNode } from "react"

type Variant = "gray" | "white" | "dark"

const variants: Record<Variant, string> = {
  gray: "bg-muted text-neutral-strong",
  white: "bg-card text-neutral-strong",
  dark: "bg-[#104631] text-white/80",
}

/**
 * DGA «شريط التنقل الثانوي» — the 40px utility bar above the main header
 * (weather, date, location + language/accessibility actions in the templates).
 * Full-bleed with 32px inline padding and space-between, as in the OG
 * dga-second-nav-header.
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
    <div
      aria-label="شريط تنقل ثانوي"
      className={cn("w-full", variants[variant], className)}
      {...props}
    >
      <div
        className={cn(
          "flex h-10 w-full items-center justify-between gap-4 px-4 sm:px-8",
          variant === "dark"
            ? "border-0 border-b border-solid border-white/15"
            : "border-0 border-b border-solid border-border"
        )}
      >
        <div className="flex min-w-0 items-center gap-4 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
  icon,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { icon?: IconSvgElement }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center gap-1 text-sm", className)}
      {...props}
    >
      {icon ? (
        <HugeiconsIcon
          icon={icon}
          size={16}
          strokeWidth={2}
          className="shrink-0 opacity-80"
          aria-hidden
        />
      ) : null}
      {children}
    </span>
  )
}
