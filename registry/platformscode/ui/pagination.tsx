"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type Size = "small" | "medium" | "large"

const sizes: Record<Size, string> = {
  small: "size-6 text-xs",
  medium: "size-8 text-sm",
  large: "size-10 text-sm",
}

const DOTS = "..."

function paginationRange(
  totalPageCount: number,
  currentPage: number,
  siblingCount = 1
): (number | typeof DOTS)[] {
  const totalSlots = siblingCount * 2 + 5
  if (totalPageCount <= totalSlots) {
    return Array.from({ length: totalPageCount }, (_, index) => index + 1)
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1)
  const rightSibling = Math.min(currentPage + siblingCount, totalPageCount)
  const showLeftDots = leftSibling > 2
  const showRightDots = rightSibling < totalPageCount - 1

  if (!showLeftDots && showRightDots) {
    const count = 3 + siblingCount * 2
    return [
      ...Array.from({ length: count }, (_, index) => index + 1),
      DOTS,
      totalPageCount,
    ]
  }

  if (showLeftDots && !showRightDots) {
    const count = 3 + siblingCount * 2
    return [
      1,
      DOTS,
      ...Array.from(
        { length: count },
        (_, index) => totalPageCount - count + 1 + index
      ),
    ]
  }

  return [
    1,
    DOTS,
    ...Array.from(
      { length: rightSibling - leftSibling + 1 },
      (_, index) => leftSibling + index
    ),
    DOTS,
    totalPageCount,
  ]
}

/**
 * DGA pagination with sibling/ellipsis ranges and the brand underline on
 * the current page. Renders a `<nav>` element with page buttons.
 *
 * Documentation: [كود المنصات](https://x7md-lab.github.io/platformscode-registry/)
 */
export function Pagination({
  totalPageCount,
  page,
  defaultPage = 1,
  siblingCount = 1,
  size = "medium",
  onChange,
  label = "ترقيم الصفحات",
  className,
}: {
  /** Total number of pages. */
  totalPageCount: number
  /** Controlled current page (1-based). */
  page?: number
  /**
   * Initial page when uncontrolled.
   * @default 1
   */
  defaultPage?: number
  /**
   * Pages shown on each side of the current page.
   * @default 1
   */
  siblingCount?: number
  /**
   * DGA cell sizes: small 24px, medium 32px, large 40px.
   * @default "medium"
   */
  size?: Size
  /** Called with the new page on navigation. */
  onChange?: (page: number) => void
  /** Accessible name of the navigation landmark. */
  label?: string
  className?: string
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultPage)
  const current = page ?? uncontrolled

  function go(next: number) {
    const clamped = Math.min(Math.max(next, 1), totalPageCount)
    if (clamped === current) return
    if (page === undefined) setUncontrolled(clamped)
    onChange?.(clamped)
  }

  const cell = cn(
    "relative flex cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
    "disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent",
    sizes[size]
  )

  return (
    <nav aria-label={label} className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        aria-label="الصفحة السابقة"
        disabled={current === 1}
        onClick={() => go(current - 1)}
        className={cn(cell, "text-foreground hover:bg-muted active:bg-border")}
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={18}
          strokeWidth={2}
          className="rtl:rotate-0 ltr:rotate-180"
        />
      </button>
      {paginationRange(totalPageCount, current, siblingCount).map((item, index) =>
        item === DOTS ? (
          <span
            key={`dots-${index}`}
            aria-hidden
            className={cn(cell, "cursor-default text-muted-foreground")}
          >
            {DOTS}
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`الصفحة ${item}`}
            aria-current={item === current ? "page" : undefined}
            onClick={() => go(item)}
            className={cn(
              cell,
              "text-foreground hover:bg-muted active:bg-border",
              item === current &&
                "text-primary after:absolute after:inset-x-1 after:-bottom-px after:h-[3px] after:rounded-full after:bg-primary"
            )}
          >
            {item}
          </button>
        )
      )}
      <button
        type="button"
        aria-label="الصفحة التالية"
        disabled={current === totalPageCount}
        onClick={() => go(current + 1)}
        className={cn(cell, "text-foreground hover:bg-muted active:bg-border")}
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          size={18}
          strokeWidth={2}
          className="rtl:rotate-0 ltr:rotate-180"
        />
      </button>
    </nav>
  )
}
