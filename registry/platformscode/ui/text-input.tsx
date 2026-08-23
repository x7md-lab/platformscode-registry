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
  sm: "h-7 text-xs",
  md: "h-8 text-sm",
  lg: "h-10 text-base",
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

/**
 * DGA text field over Base UI Input: 1px border, center-out focus underline
 * and focus shadow, prefix/suffix slots and feedback icons.
 * Renders a labelled field wrapping an `<input>` element.
 *
 * Documentation: [كود المنصات](https://x7md-lab.github.io/platformscode-registry/)
 */
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
  dir,
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "size" | "prefix"> & {
  /** Semibold label above the field; `required` adds the red marker. */
  label?: string
  /** Muted helper line under the field. */
  helperText?: string
  /** Error line; also paints the border and underline red. */
  alertText?: string
  /**
   * DGA field heights: sm 28px, md 32px, lg 40px.
   * @default "md"
   */
  size?: Size
  /** Forces the error border without an error message. */
  error?: boolean
  /** Trailing status icon: success, error or warning. */
  feedback?: Feedback
  /** Leading icon inside the field. */
  icon?: ReactNode
  /** Filled slot on the start edge (e.g. a phone country code). */
  prefix?: ReactNode
  /** Filled slot on the end edge. */
  suffix?: ReactNode
}) {
  const invalid = error || Boolean(alertText)
  return (
    <Field.Root
      disabled={props.disabled}
      className="flex w-full flex-col gap-1.5"
    >
      {label ? (
        <Field.Label className="flex items-start gap-1 text-sm font-semibold text-foreground data-[disabled]:text-muted-foreground">
          {props.required ? (
            <span aria-hidden className="text-destructive-strong">
              *
            </span>
          ) : null}
          {label}
        </Field.Label>
      ) : null}
      <div
        dir={dir}
        className={cn(
          "relative flex w-full items-center gap-2 overflow-hidden rounded-sm border bg-card px-2 transition-[color,background-color,border-color,box-shadow]",
          "focus-within:shadow-[0_2px_4px_-2px_rgba(16,24,40,0.06),0_4px_8px_-2px_rgba(16,24,40,0.1)]",
          "after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-ring after:transition-[width] after:duration-200",
          "focus-within:after:w-full",
          invalid
            ? "border-destructive after:bg-destructive"
            : "border-input hover:border-neutral-strong",
          props.disabled ? "border-border bg-muted after:hidden" : undefined,
          props.readOnly ? "border-border after:hidden" : undefined,
          sizes[size]
        )}
      >
        {prefix ? (
          <span className="-ms-2 flex h-full items-center bg-muted px-3 text-sm text-muted-foreground">
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
          <span className="-me-2 flex h-full items-center bg-muted px-3 text-sm text-muted-foreground">
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
