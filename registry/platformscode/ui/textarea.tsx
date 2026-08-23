"use client"

import { Field } from "@base-ui/react/field"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

export function Textarea({
  label,
  helperText,
  alertText,
  error,
  resize = false,
  className,
  rows = 4,
  ...props
}: ComponentProps<"textarea"> & {
  label?: string
  helperText?: string
  alertText?: string
  error?: boolean
  resize?: boolean
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
      <Field.Control
        render={
          <textarea
            rows={rows}
            className={cn(
              "w-full rounded-sm border bg-card px-4 py-3 font-sans text-sm text-foreground transition-colors",
              "placeholder:text-muted-foreground focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-ring",
              "disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground",
              invalid
                ? "border-destructive"
                : "border-neutral-strong/50 hover:border-neutral-strong",
              resize ? "resize-y" : "resize-none",
              className
            )}
            {...props}
          />
        }
      />
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
