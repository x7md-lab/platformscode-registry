"use client"

import { Switch as BaseSwitch } from "@base-ui/react/switch"
import { Field } from "@base-ui/react/field"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

/**
 * DGA switch over Base UI: 48x24 track, dark thumb when off, brand track
 * with white thumb when on, hover halo. Renders a labelled `Switch.Root`.
 */
export function Switch({
  label,
  helperText,
  alertText,
  className,
  ...props
}: ComponentProps<typeof BaseSwitch.Root> & {
  /** Visible label; turns brand-colored while the switch is on. */
  label?: string
  /** Muted helper line under the control. */
  helperText?: string
  /** Error line under the control. */
  alertText?: string
}) {
  return (
    <Field.Root disabled={props.disabled} className="flex flex-col gap-1.5">
      <Field.Label className="flex cursor-pointer items-center gap-3 text-sm text-foreground has-[[data-checked]]:text-primary-accent data-[disabled]:cursor-not-allowed data-[disabled]:text-muted-foreground">
        <BaseSwitch.Root
          className={cn(
            "group relative h-6 w-12 shrink-0 cursor-pointer rounded-full bg-card p-1 transition-colors",
            "border border-solid border-foreground data-[checked]:border-primary data-[checked]:bg-primary",
            // dark: the track takes the light end of the ramp so the thumb can
            // go dark — see checkbox.tsx for the measurements behind this
            "dark:data-[checked]:border-primary-accent dark:data-[checked]:bg-primary-accent",
            "hover:ring-4 hover:ring-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
            "data-[disabled]:cursor-not-allowed data-[disabled]:border-input data-[disabled]:bg-card data-[disabled]:ring-0",
            className
          )}
          {...props}
        >
          <BaseSwitch.Thumb
            className={cn(
              "block size-4 rounded-full bg-foreground transition-[transform,background-color] duration-300",
              // white on the brand track in light (4.75:1, as DGA ships it);
              // dark ink on the lightened track in dark (11.13:1)
              "data-[checked]:bg-primary-foreground dark:data-[checked]:bg-background",
              "ltr:data-[checked]:translate-x-6 rtl:data-[checked]:-translate-x-6",
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
