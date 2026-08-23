import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { ArrowUpRight01Icon, ArrowDownRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

export function Metric({
  label,
  value,
  helperText,
  trend,
  trendLabel,
  icon,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  label: string
  value: string
  helperText?: string
  trend?: "up" | "down"
  trendLabel?: string
  icon?: IconSvgElement
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 rounded-lg border border-border bg-card p-6",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold text-muted-foreground">{label}</span>
        {icon ? (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
            <HugeiconsIcon icon={icon} size={18} strokeWidth={2} />
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </span>
        {trend && trendLabel ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              trend === "up"
                ? "bg-success-light text-success"
                : "bg-destructive-light text-destructive"
            )}
          >
            <HugeiconsIcon
              icon={trend === "up" ? ArrowUpRight01Icon : ArrowDownRight01Icon}
              size={14}
              strokeWidth={2.5}
            />
            {trendLabel}
          </span>
        ) : null}
      </div>
      {helperText ? (
        <p className="m-0 text-xs leading-5 text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  )
}
