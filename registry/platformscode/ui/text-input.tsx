"use client"

import { Input } from "@base-ui/react/input"
import { Field } from "@base-ui/react/field"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { ComponentProps, ReactNode } from "react"

type Size = "sm" | "md" | "lg"
type Feedback = "success" | "error" | "warning"

const sizes: Record<Size, string> = {
  sm: "h-9 text-sm",
  md: "h-10 text-sm",
  lg: "h-12 text-base",
}

const feedbackIcons = {
  success: CheckmarkCircle02Icon,
  error: CancelCircleIcon,
  warning: Alert02Icon,
}

const feedbackColors: Record<Feedback, string> = {
  success: "text-primary",
  error: "text-destructive",
  warning: "text-warning",
}

export function TextInput({
  label,
  helperText,
  alertText,
  size = "md",
  error,
  feedback,
  icon,
  prefix,
  suffix,
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "size" | "prefix"> & {
  label?: string
  helperText?: string
  alertText?: string
  size?: Size
  error?: boolean
  feedback?: Feedback
  icon?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
}) {
  const invalid = error || Boolean(alertText)
  return (
    <Field.Root
      disabled={props.disabled}
      className="flex w-full flex-col gap-1.5"
    >
      {label ? (
        <Field.Label className="text-sm font-semibold text-foreground data-[disabled]:text-muted-foreground">
          {label}
        </Field.Label>
      ) : null}
      <div
        className={cn(
          "relative flex w-full items-center gap-2 overflow-hidden rounded-sm border bg-card px-4 transition-colors",
          "after:absolute after:bottom-0 after:start-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-ring after:transition-[width] after:duration-200 rtl:after:translate-x-1/2",
          "focus-within:after:w-full",
          invalid
            ? "border-destructive after:bg-destructive"
            : "border-neutral-strong/50 hover:border-neutral-strong",
          props.disabled ? "border-border bg-muted after:hidden" : undefined,
          props.readOnly ? "border-border after:hidden" : undefined,
          sizes[size]
        )}
      >
        {prefix ? (
          <span className="-ms-4 flex h-full items-center bg-muted px-3 text-sm text-muted-foreground">
            {prefix}
          </span>
        ) : null}
        {icon ? (
          <span className="flex shrink-0 items-center text-muted-foreground">
            {icon}
          </span>
        ) : null}
        <Input
          className={cn(
            "h-full w-full grow border-0 bg-transparent p-0 text-inherit text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:text-muted-foreground",
            className
          )}
          {...props}
        />
        {feedback ? (
          <span className={cn("flex shrink-0 items-center", feedbackColors[feedback])}>
            <HugeiconsIcon icon={feedbackIcons[feedback]} size={20} strokeWidth={2} />
          </span>
        ) : null}
        {suffix ? (
          <span className="-me-4 flex h-full items-center bg-muted px-3 text-sm text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
      {helperText ? (
        <Field.Description className="text-xs text-muted-foreground">
          {helperText}
        </Field.Description>
      ) : null}
      {alertText ? (
        <p className="m-0 text-xs font-semibold text-destructive">{alertText}</p>
      ) : null}
    </Field.Root>
  )
}
