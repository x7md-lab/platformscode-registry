"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  Cancel01Icon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { HTMLAttributes, ReactNode } from "react"

type Tone = "neutral" | "info" | "success" | "warning" | "error"

const icons = {
  neutral: InformationCircleIcon,
  info: InformationCircleIcon,
  success: CheckmarkCircle02Icon,
  warning: Alert02Icon,
  error: CancelCircleIcon,
}

const tones: Record<Tone, { plain: string; colored: string; icon: string }> = {
  neutral: {
    plain: "border-neutral-border bg-card",
    colored: "border-neutral-border bg-card",
    icon: "text-neutral-strong",
  },
  info: {
    plain: "border-border bg-card",
    colored: "border-info-border bg-info-light",
    icon: "text-info",
  },
  success: {
    plain: "border-border bg-card",
    colored: "border-success-border bg-success-light",
    icon: "text-success",
  },
  warning: {
    plain: "border-border bg-card",
    colored: "border-warning-border bg-warning-light",
    icon: "text-warning",
  },
  error: {
    plain: "border-border bg-card",
    colored: "border-destructive-border bg-destructive-light",
    icon: "text-destructive",
  },
}

/**
 * DGA inline notification with tone icon, lead/helper text, optional
 * actions and dismiss. Renders a `<div role="alert">` element.
 */
export function InlineAlert({
  tone = "neutral",
  leadText,
  helperText,
  colored = true,
  onClose,
  actions,
  className,
  children,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  tone?: Tone
  leadText: string
  helperText?: string
  colored?: boolean
  onClose?: () => void
  actions?: ReactNode
}) {
  const style = tones[tone]
  return (
    <div
      role="alert"
      className={cn(
        "flex w-full items-start gap-3 rounded-md border px-6 py-4",
        colored ? style.colored : style.plain,
        className
      )}
      {...props}
    >
      <span className={cn("mt-0.5 flex shrink-0", style.icon)}>
        <HugeiconsIcon icon={icons[tone]} size={20} strokeWidth={2} />
      </span>
      <div className="flex min-w-0 grow flex-col gap-1">
        <p className="m-0 text-sm font-bold text-foreground">{leadText}</p>
        {helperText ? (
          <p className="m-0 text-sm leading-6 text-muted-foreground">
            {helperText}
          </p>
        ) : null}
        {children}
        {actions ? (
          <div className="mt-2 flex flex-wrap items-center gap-3">{actions}</div>
        ) : null}
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق التنبيه"
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
        </button>
      ) : null}
    </div>
  )
}
