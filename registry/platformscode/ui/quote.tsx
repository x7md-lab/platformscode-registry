import { HugeiconsIcon } from "@hugeicons/react"
import { QuoteDownIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { BlockquoteHTMLAttributes, ReactNode } from "react"

/**
 * DGA quote: brand-tinted blockquote with quote mark and author caption.
 * Renders a `<figure>` wrapping a `<blockquote>` element.
 */
export function Quote({
  author,
  role,
  avatar,
  showMark = true,
  className,
  children,
  ...props
}: BlockquoteHTMLAttributes<HTMLQuoteElement> & {
  author?: string
  role?: string
  avatar?: ReactNode
  showMark?: boolean
}) {
  return (
    <figure className={cn("m-0 w-full", className)}>
      <blockquote
        className={cn(
          "m-0 flex flex-col gap-4 rounded-lg bg-primary-light p-6 text-start",
          "border-s-4 border-primary"
        )}
        {...props}
      >
        {showMark ? (
          <HugeiconsIcon
            icon={QuoteDownIcon}
            size={28}
            strokeWidth={1.5}
            className="text-primary/50"
            aria-hidden
          />
        ) : null}
        <p className="m-0 text-lg font-medium leading-8 text-foreground">
          {children}
        </p>
      </blockquote>
      {author ? (
        <figcaption className="mt-4 flex items-center gap-3">
          {avatar}
          <span className="flex flex-col">
            <span className="text-sm font-bold text-foreground">{author}</span>
            {role ? (
              <span className="text-xs text-muted-foreground">{role}</span>
            ) : null}
          </span>
        </figcaption>
      ) : null}
    </figure>
  )
}
