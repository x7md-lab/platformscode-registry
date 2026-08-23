"use client"

import { Radio } from "@base-ui/react/radio"
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group"
import { Field } from "@base-ui/react/field"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

export function RadioGroup({
  className,
  ...props
}: ComponentProps<typeof BaseRadioGroup>) {
  return (
    <BaseRadioGroup className={cn("flex flex-col gap-3", className)} {...props} />
  )
}

export function RadioItem({
  label,
  helperText,
  alertText,
  className,
  ...props
}: ComponentProps<typeof Radio.Root> & {
  label?: string
  helperText?: string
  alertText?: string
}) {
  return (
    <Field.Root disabled={props.disabled} className="flex flex-col gap-1.5">
      <Field.Label className="flex cursor-pointer items-start gap-3 text-sm text-foreground data-[disabled]:cursor-not-allowed data-[disabled]:text-muted-foreground">
        <Radio.Root
          className={cn(
            "relative mt-px flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border border-muted-foreground bg-card p-0 transition-colors",
            "before:absolute before:left-1/2 before:top-1/2 before:-z-10 before:size-12 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-0 before:rounded-full before:bg-border before:transition-transform before:duration-300",
            "active:before:scale-100",
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
            "data-[checked]:border-primary data-[checked]:bg-card data-[checked]:hover:border-primary-active",
            "data-[disabled]:cursor-not-allowed data-[disabled]:bg-muted",
            alertText ? "border-destructive" : undefined,
            className
          )}
          {...props}
        >
          <Radio.Indicator className="size-3.5 rounded-full bg-primary-active" />
        </Radio.Root>
        {label ? <span className="leading-5">{label}</span> : null}
      </Field.Label>
      {helperText ? (
        <Field.Description className="ms-7 text-xs text-muted-foreground">
          {helperText}
        </Field.Description>
      ) : null}
      {alertText ? (
        <p className="ms-7 m-0 text-xs font-semibold text-destructive">
          {alertText}
        </p>
      ) : null}
    </Field.Root>
  )
}
