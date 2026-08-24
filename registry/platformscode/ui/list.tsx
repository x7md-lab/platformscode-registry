import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import type { HTMLAttributes, LiHTMLAttributes } from "react"

type Tone = "brand" | "neutral" | "on-color"

const markers: Record<Tone, string> = {
  brand: "marker:text-primary-accent",
  neutral: "marker:text-muted-foreground",
  "on-color": "marker:text-white",
}

/**
 * DGA list: ordered, unordered or icon-led, with brand markers.
 * Renders a `<ul>` or `<ol>` element.
 */
export function List({
  variant = "unordered",
  tone = "brand",
  className,
  ...props
}: HTMLAttributes<HTMLUListElement | HTMLOListElement> & {
  variant?: "ordered" | "unordered" | "with-icon"
  tone?: Tone
}) {
  const shared = cn(
    "m-0 flex flex-col gap-2 text-sm leading-7 text-muted-foreground",
    variant === "with-icon" ? "list-none ps-0" : "ps-6",
    variant === "ordered" ? "list-decimal" : undefined,
    variant === "unordered" ? "list-disc" : undefined,
    markers[tone],
    className
  )

  return variant === "ordered" ? (
    <ol className={shared} {...(props as HTMLAttributes<HTMLOListElement>)} />
  ) : (
    <ul className={shared} {...(props as HTMLAttributes<HTMLUListElement>)} />
  )
}

/**
 * A single list entry with an optional leading brand icon.
 * Renders an `<li>` element.
 */
export function ListItem({
  icon,
  className,
  children,
  ...props
}: LiHTMLAttributes<HTMLLIElement> & { icon?: IconSvgElement }) {
  return (
    <li className={cn(icon ? "flex items-start gap-2" : undefined, className)} {...props}>
      {icon ? (
        <span className="mt-1 flex shrink-0 text-primary-accent">
          <HugeiconsIcon icon={icon} size={16} strokeWidth={2} />
        </span>
      ) : null}
      {icon ? <span className="min-w-0">{children}</span> : children}
    </li>
  )
}
