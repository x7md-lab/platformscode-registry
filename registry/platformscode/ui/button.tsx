import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

type Variant = "primary" | "secondary" | "outline" | "subtle" | "danger"
type Size = "sm" | "md" | "lg"

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active disabled:bg-muted disabled:text-muted-foreground",
  secondary:
    "bg-muted text-foreground hover:bg-border active:bg-neutral-border disabled:bg-border disabled:text-muted-foreground",
  outline:
    "bg-transparent text-foreground outline outline-1 -outline-offset-1 outline-border hover:bg-muted active:bg-border active:outline-neutral-border disabled:text-muted-foreground",
  subtle:
    "bg-transparent text-primary hover:bg-primary-light active:bg-primary-soft disabled:text-muted-foreground",
  danger:
    "bg-destructive text-primary-foreground hover:bg-destructive-strong active:bg-destructive-strong disabled:bg-muted disabled:text-muted-foreground",
}

const sizes: Record<Size, string> = {
  sm: "h-6 px-2 text-xs leading-[18px]",
  md: "h-8 px-3 text-sm leading-5",
  lg: "h-10 px-4 text-base leading-6",
}

export function Button({
  className,
  variant = "primary",
  size = "lg",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer appearance-none items-center justify-center gap-1 rounded-sm border-0 font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}
