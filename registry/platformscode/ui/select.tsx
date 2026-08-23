"use client"

import { Select as BaseSelect } from "@base-ui/react/select"
import { Field } from "@base-ui/react/field"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

type Option = { label: string; value: string }

type Size = "sm" | "md" | "lg"

const sizes: Record<Size, string> = {
  sm: "h-7 text-xs",
  md: "h-8 text-sm",
  lg: "h-10 text-base",
}

export function Select({
  options,
  label,
  placeholder = "اختر",
  helperText,
  alertText,
  error,
  size = "md",
  className,
  ...props
}: Omit<ComponentProps<typeof BaseSelect.Root>, "items"> & {
  options: Option[]
  label?: string
  placeholder?: string
  helperText?: string
  alertText?: string
  error?: boolean
  size?: Size
  className?: string
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
      <BaseSelect.Root items={options} {...props}>
        <BaseSelect.Trigger
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-2 rounded-sm border bg-card px-4 text-start transition-colors",
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
            "data-[disabled]:cursor-not-allowed data-[disabled]:border-border data-[disabled]:bg-muted data-[disabled]:text-muted-foreground",
            invalid
              ? "border-destructive"
              : "border-input hover:border-neutral-strong",
            sizes[size],
            className
          )}
        >
          <BaseSelect.Value className="truncate text-foreground">
            {(value: unknown) =>
              value == null || (Array.isArray(value) && value.length === 0) ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : Array.isArray(value) ? (
                options
                  .filter((option) => value.includes(option.value))
                  .map((option) => option.label)
                  .join("، ")
              ) : (
                options.find((option) => option.value === value)?.label
              )
            }
          </BaseSelect.Value>
          <BaseSelect.Icon className="flex shrink-0 text-muted-foreground transition-transform data-[popup-open]:rotate-180">
            <HugeiconsIcon icon={ArrowDown01Icon} size={18} strokeWidth={2} />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner sideOffset={4} className="z-50 outline-none">
            <BaseSelect.Popup
              className={cn(
                "max-h-72 min-w-[var(--anchor-width)] overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-lg outline-none",
                "origin-[var(--transform-origin)] transition-[transform,opacity] duration-150",
                "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
                "data-[ending-style]:scale-95 data-[ending-style]:opacity-0"
              )}
            >
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  className="flex cursor-pointer select-none items-center justify-between gap-2 rounded-sm px-3 py-2 text-sm text-popover-foreground outline-none data-[highlighted]:bg-muted data-[selected]:font-semibold"
                >
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className="flex text-primary">
                    <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2.5} />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
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
