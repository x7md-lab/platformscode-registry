"use client"

import { Progress } from "@base-ui/react/progress"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

type Tone = "brand" | "success" | "warning" | "error"

const tones: Record<Tone, string> = {
  brand: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
}

export function ProgressBar({
  label,
  tone = "brand",
  showValue = true,
  thickness = "md",
  className,
  ...props
}: ComponentProps<typeof Progress.Root> & {
  label?: string
  tone?: Tone
  showValue?: boolean
  thickness?: "sm" | "md" | "lg"
}) {
  return (
    <Progress.Root className={cn("flex w-full flex-col gap-2", className)} {...props}>
      {label || showValue ? (
        <div className="flex items-center justify-between gap-4">
          {label ? (
            <Progress.Label className="text-sm font-semibold text-foreground">
              {label}
            </Progress.Label>
          ) : (
            <span />
          )}
          {showValue ? (
            <Progress.Value className="font-mono text-xs text-muted-foreground" />
          ) : null}
        </div>
      ) : null}
      <Progress.Track
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted",
          thickness === "sm" ? "h-1" : thickness === "lg" ? "h-3" : "h-2"
        )}
      >
        <Progress.Indicator
          className={cn("h-full rounded-full transition-all duration-300", tones[tone])}
        />
      </Progress.Track>
    </Progress.Root>
  )
}
