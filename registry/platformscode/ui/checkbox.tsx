"use client"

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox"
import { Field } from "@base-ui/react/field"
import { HugeiconsIcon } from "@hugeicons/react"
import { MinusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

type Color = "brand" | "neutral"

const colors: Record<Color, string> = {
  brand:
    "data-[checked]:border-primary data-[checked]:bg-primary data-[indeterminate]:border-primary data-[indeterminate]:bg-primary",
  neutral:
    "data-[checked]:border-foreground data-[checked]:bg-foreground data-[indeterminate]:border-foreground data-[indeterminate]:bg-foreground",
}

export function Checkbox({
  label,
  helperText,
  alertText,
  color = "brand",
  className,
  ...props
}: ComponentProps<typeof BaseCheckbox.Root> & {
  label?: string
  helperText?: string
  alertText?: string
  color?: Color
}) {
  return (
    <Field.Root disabled={props.disabled} className="flex flex-col gap-1.5">
      <Field.Label className="flex cursor-pointer items-start gap-2 text-sm text-foreground data-[disabled]:cursor-not-allowed data-[disabled]:text-muted-foreground">
        <BaseCheckbox.Root
          className={cn(
            "group mt-px flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-neutral-border bg-card p-0 transition-colors",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            "data-[disabled]:cursor-not-allowed data-[disabled]:bg-muted",
            alertText ? "border-destructive" : undefined,
            colors[color],
            className
          )}
          {...props}
        >
          <BaseCheckbox.Indicator className="flex items-center justify-center text-primary-foreground">
            <HugeiconsIcon
              icon={Tick02Icon}
              size={14}
              strokeWidth={3}
              className="group-data-[indeterminate]:hidden"
            />
            <HugeiconsIcon
              icon={MinusSignIcon}
              size={14}
              strokeWidth={3}
              className="hidden group-data-[indeterminate]:block"
            />
          </BaseCheckbox.Indicator>
        </BaseCheckbox.Root>
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
