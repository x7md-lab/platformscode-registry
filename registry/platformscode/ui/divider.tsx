"use client"

import { Separator } from "@base-ui/react/separator"
import { cn } from "@/lib/utils"
import type { ComponentProps, ReactNode } from "react"

/**
 * DGA separator, horizontal or vertical, with an optional centered label.
 * Renders a Base UI `Separator` element.
 */
export function Divider({
  orientation = "horizontal",
  label,
  className,
  ...props
}: ComponentProps<typeof Separator> & { label?: ReactNode }) {
  if (label && orientation === "horizontal") {
    return (
      <div className={cn("flex w-full items-center gap-3", className)}>
        <Separator className="h-px grow bg-border" {...props} />
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">
          {label}
        </span>
        <Separator className="h-px grow bg-border" />
      </div>
    )
  }

  return (
    <Separator
      orientation={orientation}
      className={cn(
        "bg-border",
        orientation === "vertical" ? "h-full w-px self-stretch" : "h-px w-full",
        className
      )}
      {...props}
    />
  )
}
