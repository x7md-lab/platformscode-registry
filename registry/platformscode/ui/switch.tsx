"use client"

import { Switch as BaseSwitch } from "@base-ui/react/switch"
import { Field } from "@base-ui/react/field"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

export function Switch({
  label,
  helperText,
  alertText,
  className,
  ...props
}: ComponentProps<typeof BaseSwitch.Root> & {
  label?: string
  helperText?: string
  alertText?: string
}) {
  return (
    <Field.Root disabled={props.disabled} className="flex flex-col gap-1.5">
      <Field.Label className="flex cursor-pointer items-center gap-3 text-sm text-foreground has-[[data-checked]]:text-primary data-[disabled]:cursor-not-allowed data-[disabled]:text-muted-foreground">
        <BaseSwitch.Root
          className={cn(
            "group relative h-6 w-12 shrink-0 cursor-pointer rounded-full bg-card p-1 transition-colors",
            "border border-solid border-foreground data-[checked]:border-primary data-[checked]:bg-primary",
            "hover:ring-4 hover:ring-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
            "data-[disabled]:cursor-not-allowed data-[disabled]:border-input data-[disabled]:bg-card data-[disabled]:ring-0",
            className
          )}
          {...props}
        >
          <BaseSwitch.Thumb
            className={cn(
              "block size-4 rounded-full bg-foreground transition-[transform,background-color] duration-300",
              "data-[checked]:bg-card ltr:data-[checked]:translate-x-6 rtl:data-[checked]:-translate-x-6",
              "group-data-[disabled]:bg-input"
            )}
          />
        </BaseSwitch.Root>
        {label ? <span className="leading-5">{label}</span> : null}
      </Field.Label>
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
