"use client"

import { Field } from "@base-ui/react/field"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

/**
 * DGA multi-line text field with label, helper and alert text.
 * Renders a labelled `<textarea>` element.
 */
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
  /** Semibold label above the field; `required` adds the red marker. */
  label?: string
  /** Muted helper line under the field. */
  helperText?: string
  /** Error line; also paints the border red. */
  alertText?: string
  /** Forces the error border without an error message. */
  error?: boolean
  /** Allows vertical resizing by the user. */
  resize?: boolean
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
      <Field.Control
        render={
          <textarea
            rows={rows}
            className={cn(
              "w-full rounded-sm border bg-card px-4 py-3 font-sans text-sm text-foreground transition-[color,background-color,border-color,box-shadow] any-pointer-coarse:text-base",
              "placeholder:text-muted-foreground focus:outline-none focus:border-neutral-strong",
              "focus:shadow-[0_2px_4px_-2px_rgba(16,24,40,0.06),0_4px_8px_-2px_rgba(16,24,40,0.1)]",
              "disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground",
              invalid
                ? "border-destructive"
                : "border-input hover:border-neutral-strong",
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
