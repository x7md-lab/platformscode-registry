import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

export function Card({
  selectable = false,
  selected = false,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  selectable?: boolean
  selected?: boolean
}) {
  return (
    <div
      data-selected={selected || undefined}
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-colors",
        selectable &&
          "cursor-pointer hover:bg-neutral-light active:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
        selected && "border-primary bg-primary-light",
        className
      )}
      {...props}
    />
  )
}
