import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

type Variant = "primary-brand" | "primary-neutral" | "secondary-solid"
type Size = "small" | "large"
type Corner = "start" | "end"

const variants: Record<Variant, string> = {
  "primary-brand":
    "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed",
  "primary-neutral":
    "bg-neutral-strongest text-white hover:bg-foreground active:bg-muted-foreground",
  "secondary-solid":
    "bg-muted text-foreground hover:bg-border active:bg-border",
}

const onColorVariants: Record<Variant, string> = {
  "primary-brand":
    "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed",
  "primary-neutral":
    "bg-white text-foreground hover:bg-white/80 active:bg-white/60",
  "secondary-solid":
    "bg-white/20 text-white hover:bg-white/20 active:bg-white/40",
}

// DGA .floating-button-btn: 16px padding, 20px when large, fully rounded.
const sizes: Record<Size, string> = {
  small: "p-4",
  large: "p-5",
}

/**
 * DGA «الزر العائم»: pill-shaped action that floats above the page — icon
 * only or icon + label. Renders a `<button>` element.
 *
 * Documentation: [كود المنصات](https://x7md-lab.github.io/platformscode-registry/)
 */
export function FloatingButton({
  label,
  icon,
  variant = "primary-brand",
  size = "small",
  iconOnly = false,
  onColor = false,
  floating = false,
  corner = "end",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Visible text; used as the accessible name when `iconOnly`. */
  label?: string
  /** Leading icon. */
  icon?: IconSvgElement
  /**
   * Colour treatment.
   * @default "primary-brand"
   */
  variant?: Variant
  /**
   * DGA padding scale: small 16px, large 20px.
   * @default "small"
   */
  size?: Size
  /**
   * Hides the label and renders a circular button.
   * @default false
   */
  iconOnly?: boolean
  /**
   * Flips the palette for placement on a coloured surface.
   * @default false
   */
  onColor?: boolean
  /**
   * Pins the button to a viewport corner above the safe area.
   * @default false
   */
  floating?: boolean
  /**
   * Corner used while `floating`.
   * @default "end"
   */
  corner?: Corner
}) {
  const palette = onColor ? onColorVariants : variants
  return (
    <button
      type="button"
      aria-label={iconOnly ? label : undefined}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-0 text-base font-medium leading-6 shadow-lg transition-colors",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
        "disabled:cursor-not-allowed disabled:bg-border disabled:text-muted-foreground disabled:shadow-none",
        sizes[size],
        palette[variant],
        floating &&
          cn(
            "fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-40",
            corner === "end" ? "end-4" : "start-4"
          ),
        className
      )}
      {...props}
    >
      {icon ? (
        <HugeiconsIcon
          icon={icon}
          className="size-[17.5px] shrink-0"
          strokeWidth={2}
          aria-hidden
        />
      ) : null}
      {iconOnly ? null : label}
    </button>
  )
}
