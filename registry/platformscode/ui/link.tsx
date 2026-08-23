import { HugeiconsIcon } from "@hugeicons/react"
import { LinkSquare02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { AnchorHTMLAttributes, ReactNode } from "react"

type Tone = "brand" | "neutral" | "on-color"
type Size = "sm" | "md" | "lg"

const tones: Record<Tone, string> = {
  brand: "text-primary decoration-primary/40 hover:decoration-primary",
  neutral: "text-foreground decoration-foreground/40 hover:decoration-foreground",
  "on-color": "text-white decoration-white/50 hover:decoration-white",
}

const sizes: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
}

export function Link({
  tone = "brand",
  size = "md",
  external = false,
  inline = false,
  icon,
  disabled = false,
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  tone?: Tone
  size?: Size
  external?: boolean
  inline?: boolean
  icon?: ReactNode
  disabled?: boolean
}) {
  return (
    <a
      aria-disabled={disabled || undefined}
      target={external ? "_blank" : props.target}
      rel={external ? "noreferrer noopener" : props.rel}
      className={cn(
        "cursor-pointer gap-1 rounded-sm font-semibold underline underline-offset-4 transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        inline ? "inline" : "inline-flex items-center",
        disabled
          ? "pointer-events-none text-muted-foreground no-underline"
          : tones[tone],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
      {external ? (
        <HugeiconsIcon
          icon={LinkSquare02Icon}
          size={14}
          strokeWidth={2}
          className="shrink-0"
          aria-hidden
        />
      ) : null}
    </a>
  )
}
