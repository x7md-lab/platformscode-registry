"use client"

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox"
import { Field } from "@base-ui/react/field"
import { HugeiconsIcon } from "@hugeicons/react"
import { MinusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

type Color = "brand" | "neutral"
type BoxSize = "sm" | "md" | "lg"

const boxSizes: Record<BoxSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
}

const colors: Record<Color, string> = {
  brand:
    "data-[checked]:border-primary data-[checked]:bg-primary data-[checked]:hover:border-primary-active data-[checked]:hover:bg-primary-active data-[indeterminate]:border-primary data-[indeterminate]:bg-primary",
  neutral:
    "data-[checked]:border-foreground data-[checked]:bg-foreground data-[indeterminate]:border-foreground data-[indeterminate]:bg-foreground",
}

/**
 * DGA checkbox over Base UI, with label, helper and alert text and the
 * official press ripple. Renders a labelled Base UI `Checkbox.Root`.
 *
 * Documentation: [كود المنصات](https://x7md-lab.github.io/platformscode-registry/)
 */
export function Checkbox({
  label,
  helperText,
  alertText,
  color = "brand",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof BaseCheckbox.Root> & {
  /** Visible label rendered beside the box. */
  label?: string
  /** Muted helper line under the label. */
  helperText?: string
  /** Error line; also paints the box border red. */
  alertText?: string
  /**
   * Checked fill: brand green or neutral black.
   * @default "brand"
   */
  color?: Color
  /**
   * DGA box sizes: sm 16px, md 20px, lg 24px.
   * @default "md"
   */
  size?: BoxSize
}) {
  return (
    <Field.Root disabled={props.disabled} className="flex flex-col gap-1.5">
      <Field.Label className="flex cursor-pointer items-start gap-3 text-sm text-foreground data-[disabled]:cursor-not-allowed data-[disabled]:text-muted-foreground">
        <BaseCheckbox.Root
          className={cn(
            "group relative mt-px flex shrink-0 cursor-pointer items-center justify-center rounded-sm border border-muted-foreground bg-card p-0 transition-colors",
            "before:absolute before:left-1/2 before:top-1/2 before:-z-10 before:size-10 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-0 before:rounded-full before:bg-border before:transition-transform before:duration-300",
            "active:before:scale-100",
            boxSizes[size],
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
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
