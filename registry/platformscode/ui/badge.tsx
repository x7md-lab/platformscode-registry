import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

type Variant = "default" | "outline" | "success" | "destructive"

const variants: Record<Variant, string> = {
  default: "bg-muted text-muted-foreground",
  outline: "border border-border bg-card text-muted-foreground",
  success: "bg-success-light text-success",
  destructive: "bg-destructive-light text-destructive",
}

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
