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
      <Field.Label className="flex cursor-pointer items-center gap-3 text-sm text-foreground data-[disabled]:cursor-not-allowed data-[disabled]:text-muted-foreground">
        <BaseSwitch.Root
          className={cn(
            "relative h-6 w-11 shrink-0 cursor-pointer rounded-full border-0 bg-neutral-border p-0.5 transition-colors",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            "data-[checked]:bg-primary data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60",
            className
          )}
          {...props}
        >
          <BaseSwitch.Thumb className="block size-5 rounded-full bg-card shadow-sm transition-transform ltr:data-[checked]:translate-x-5 rtl:data-[checked]:-translate-x-5" />
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
