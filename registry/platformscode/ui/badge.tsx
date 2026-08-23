import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

type Variant = "default" | "outline" | "success" | "destructive"
type Size = "sm" | "md" | "lg"

const variants: Record<Variant, string> = {
  default: "border-border bg-muted text-foreground",
  outline: "border-neutral-border bg-card text-foreground",
  success: "border-success-border bg-success-light text-success-strong",
  destructive:
    "border-destructive-border bg-destructive-light text-destructive-strong",
}

const sizes: Record<Size, string> = {
  sm: "h-5 px-2 text-[11px]",
  md: "h-6 px-3 text-xs",
  lg: "h-8 px-3 text-xs",
}

const interactives: Record<Variant, string> = {
  default: "hover:bg-border hover:text-ring active:bg-neutral-border",
  outline: "hover:bg-muted active:bg-border",
  success: "hover:bg-success-border active:bg-success-border",
  destructive: "hover:bg-destructive-border active:bg-destructive-border",
}

const selecteds: Record<Variant, string> = {
  default: "border-neutral-strong bg-neutral-strong text-white",
  outline: "border-foreground bg-foreground text-white",
  success: "border-primary bg-primary text-primary-foreground",
  destructive: "border-destructive bg-destructive text-primary-foreground",
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  rounded = false,
  interactive = false,
  selected = false,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant
  size?: Size
  rounded?: boolean
  interactive?: boolean
  selected?: boolean
}) {
  return (
    <span
      data-selected={selected || undefined}
      className={cn(
        "inline-flex items-center gap-1 border border-solid font-medium leading-[18px] transition-colors",
        rounded ? "rounded-full" : "rounded-sm",
        variants[variant],
        sizes[size],
        interactive &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
        interactive && !selected && interactives[variant],
        selected && selecteds[variant],
        className
      )}
      {...props}
    />
  )
}
