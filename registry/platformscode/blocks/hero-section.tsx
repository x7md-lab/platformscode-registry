"use client"

import { Badge } from "@/registry/platformscode/ui/badge"
import { SearchBox } from "@/registry/platformscode/ui/search-box"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export function HeroSection({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  search,
  searchPlaceholder = "ابحث عن خدمة",
  searchButtonLabel = "بحث",
  onSearch,
  media,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  primaryAction?: ReactNode
  secondaryAction?: ReactNode
  search?: boolean
  searchPlaceholder?: string
  searchButtonLabel?: string
  onSearch?: (query: string) => void
  media?: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "w-full rounded-xl bg-primary-light px-6 py-12 lg:px-12 lg:py-16",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-center">
        <div className="flex w-full flex-col gap-5">
          {eyebrow ? (
            <Badge variant="success" className="self-start">
              {eyebrow}
            </Badge>
          ) : null}
          <h1 className="m-0 text-3xl font-bold leading-tight tracking-tight text-foreground lg:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="m-0 max-w-xl text-base leading-8 text-muted-foreground lg:text-lg">
              {description}
            </p>
          ) : null}
          {search ? (
            <SearchBox
              className="max-w-xl"
              size="lg"
              placeholder={searchPlaceholder}
              buttonLabel={searchButtonLabel}
              onSearch={onSearch}
            />
          ) : null}
          {primaryAction || secondaryAction ? (
            <div className="flex flex-wrap items-center gap-3">
              {primaryAction ?? null}
              {secondaryAction ?? null}
            </div>
          ) : null}
        </div>
        {media ? (
          <div className="flex w-full max-w-md shrink-0 justify-center">
            {media}
          </div>
        ) : null}
      </div>
    </section>
  )
}

