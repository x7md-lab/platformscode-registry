import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

type Variant = "primary" | "outline" | "subtle" | "danger"
type Size = "md" | "lg"

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-hover disabled:bg-muted disabled:text-muted-foreground",
  outline:
    "bg-transparent text-foreground outline outline-1 -outline-offset-1 outline-border hover:bg-muted disabled:text-muted-foreground",
  subtle:
    "bg-transparent text-primary hover:bg-primary-light disabled:text-muted-foreground",
  danger:
    "bg-destructive text-primary-foreground hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground",
}

const sizes: Record<Size, string> = {
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-3 text-base",
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer appearance-none items-center justify-center gap-1 rounded-sm border-0 font-semibold transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}
