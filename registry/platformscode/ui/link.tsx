import { HugeiconsIcon } from "@hugeicons/react"
import { LinkSquare02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { AnchorHTMLAttributes, ReactNode } from "react"

type Tone = "brand" | "neutral" | "on-color"
type Size = "sm" | "md" | "lg"

const tones: Record<Tone, string> = {
  brand: "text-primary hover:text-primary-bright active:text-primary-bright",
  neutral: "text-foreground hover:text-muted-foreground active:text-neutral-border",
  "on-color": "text-white hover:text-white/80 active:text-white/60",
}

const sizes: Record<Size, string> = {
  sm: "text-sm leading-5",
  md: "text-base leading-6",
  lg: "text-lg leading-7",
}

export function Link({
  tone = "brand",
  size = "md",
  external = false,
  inline = false,
  icon,
  disabled = false,
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  tone?: Tone
  size?: Size
  external?: boolean
  inline?: boolean
  icon?: ReactNode
  disabled?: boolean
}) {
  return (
    <a
      aria-disabled={disabled || undefined}
      target={external ? "_blank" : props.target}
      rel={external ? "noreferrer noopener" : props.rel}
      className={cn(
        "cursor-pointer gap-2 rounded-[2px] font-normal no-underline underline-offset-4 transition-colors hover:underline",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
        inline ? "inline underline" : "inline-flex items-center",
        disabled
          ? "pointer-events-none text-muted-foreground no-underline"
          : tones[tone],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
      {external ? (
        <HugeiconsIcon
          icon={LinkSquare02Icon}
          size={14}
          strokeWidth={2}
          className="shrink-0"
          aria-hidden
        />
      ) : null}
    </a>
  )
}
