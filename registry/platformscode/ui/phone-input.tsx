"use client"

import { Select } from "@/registry/platformscode/ui/select"
import { TextInput } from "@/registry/platformscode/ui/text-input"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

export type PhoneCode = { label: string; value: string }

const defaultCodes: PhoneCode[] = [
  { label: "+966", value: "+966" },
  { label: "+971", value: "+971" },
  { label: "+973", value: "+973" },
  { label: "+974", value: "+974" },
  { label: "+965", value: "+965" },
  { label: "+968", value: "+968" },
]

/**
 * DGA contact-template phone group: country-code select + LTR tel input,
 * as composed in the official «قالب صفحة التواصل».
 */
export function PhoneInput({
  label = "رقم الجوال",
  required = false,
  codes = defaultCodes,
  code,
  defaultCode = "+966",
  onCodeChange,
  size = "lg",
  alertText,
  helperText,
  className,
  ...props
}: Omit<
  ComponentProps<typeof TextInput>,
  "label" | "prefix" | "suffix" | "dir" | "type" | "size"
> & {
  label?: string
  codes?: PhoneCode[]
  code?: string
  defaultCode?: string
  onCodeChange?: (code: string) => void
  size?: "sm" | "md" | "lg"
}) {
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label ? (
        <span className="flex items-start gap-1 text-sm font-semibold text-foreground">
          {required ? (
            <span aria-hidden className="text-destructive-strong">
              *
            </span>
          ) : null}
          {label}
        </span>
      ) : null}
      <div dir="ltr" className="flex items-start gap-2">
        <div className="w-28 shrink-0">
          <Select
            size={size}
            options={codes}
            value={code}
            defaultValue={code === undefined ? defaultCode : undefined}
            onValueChange={(value) => onCodeChange?.(String(value ?? ""))}
          />
        </div>
        <div className="grow">
          <TextInput
            size={size}
            dir="ltr"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            aria-label={label}
            required={required}
            placeholder="5X XXX XXXX"
            alertText={alertText}
            helperText={helperText}
            {...props}
          />
        </div>
      </div>
    </div>
  )
}
