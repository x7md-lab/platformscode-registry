"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type Size = "small" | "medium" | "large"

const sizes: Record<Size, number> = {
  small: 18,
  medium: 24,
  large: 32,
}

export function Rating({
  value = 0,
  onChange,
  max = 5,
  size = "medium",
  readOnly = false,
  label = "التقييم",
  className,
}: {
  value?: number
  onChange?: (value: number) => void
  max?: number
  size?: Size
  readOnly?: boolean
  label?: string
  className?: string
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const shown = hovered ?? value

  if (readOnly) {
    return (
      <div
        role="img"
        aria-label={`${label}: ${value} من ${max}`}
        className={cn("inline-flex items-center gap-1", className)}
      >
        {Array.from({ length: max }, (_, index) => (
          <Star key={index} filled={index < value} size={sizes[size]} />
        ))}
      </div>
    )
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex items-center gap-1", className)}
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1
        return (
          <button
            key={index}
            type="button"
            role="radio"
            aria-checked={value === starValue}
            aria-label={`${starValue} من ${max}`}
            onClick={() => onChange?.(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onFocus={() => setHovered(starValue)}
            onBlur={() => setHovered(null)}
            className="cursor-pointer rounded-sm border-0 bg-transparent p-0.5 leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Star filled={starValue <= shown} size={sizes[size]} />
          </button>
        )
      })}
    </div>
  )
}

function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <HugeiconsIcon
      icon={StarIcon}
      size={size}
      strokeWidth={1.5}
      className={cn(
        "transition-colors",
        filled ? "fill-secondary text-secondary" : "fill-transparent text-neutral-border"
      )}
    />
  )
}
