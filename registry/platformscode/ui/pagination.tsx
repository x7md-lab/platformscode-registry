"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type Size = "small" | "medium" | "large"

const sizes: Record<Size, string> = {
  small: "size-8 text-xs",
  medium: "size-10 text-sm",
  large: "size-12 text-base",
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
  totalPageCount: number
  page?: number
  defaultPage?: number
  siblingCount?: number
  size?: Size
  onChange?: (page: number) => void
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
    "flex cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent font-semibold transition-colors",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
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
        className={cn(cell, "text-foreground hover:bg-muted")}
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
              item === current
                ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                : "text-foreground hover:bg-muted"
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
        className={cn(cell, "text-foreground hover:bg-muted")}
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
