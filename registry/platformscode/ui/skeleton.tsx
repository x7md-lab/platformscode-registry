import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

/**
 * Pulsing placeholder shown while content loads. Renders a `<div>` element.
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}
