import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

type Size = "tiny" | "xs" | "sm" | "md" | "lg" | "xl" | "huge"
type Tone = "neutral" | "brand" | "on-color"

const sizes: Record<Size, string> = {
  tiny: "size-5 border-2",
  xs: "size-6 border-2",
  sm: "size-7 border-2",
  md: "size-8 border-[3px]",
  lg: "size-9 border-[3px]",
  xl: "size-10 border-4",
  huge: "size-11 border-4",
}

const tones: Record<Tone, string> = {
  neutral: "border-border border-t-foreground",
  brand: "border-border border-t-primary",
  "on-color": "border-white/30 border-t-white",
}

/**
 * DGA loading indicator. Renders a `<div role="status">` with a spinning ring.
 */
export function Spinner({
  size = "md",
  tone = "brand",
  label = "جارٍ التحميل",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  size?: Size
  tone?: Tone
  label?: string
}) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "block animate-spin rounded-full border-solid",
          sizes[size],
          tones[tone]
        )}
      />
    </div>
  )
}
