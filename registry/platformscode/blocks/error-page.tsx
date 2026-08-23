"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Alert01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/registry/platformscode/ui/button"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

/**
 * DGA «صفحة الخطأ» — centered illustration, 24/600 title, 18/400 description,
 * one primary action back home.
 */
export function ErrorPage({
  code = "404",
  title = "الصفحة غير موجودة",
  description = "الصفحة التي تبحث عنها غير متوفرة أو تم نقلها. تحقق من الرابط أو عد إلى الصفحة الرئيسية.",
  actionLabel = "العودة إلى الرئيسية",
  actionHref = "/",
  onAction,
  media,
  className,
}: {
  code?: string
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  media?: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "mx-auto flex w-full max-w-[460px] flex-col items-center gap-16 py-20 text-center",
        className
      )}
    >
      {media ?? (
        <div className="flex flex-col items-center gap-4">
          <span className="flex size-20 items-center justify-center rounded-full bg-destructive-light text-destructive">
            <HugeiconsIcon icon={Alert01Icon} size={40} strokeWidth={1.5} />
          </span>
          <span
            aria-hidden
            className="font-mono text-5xl font-bold tracking-widest text-border"
            dir="ltr"
          >
            {code}
          </span>
        </div>
      )}
      <div className="mx-10 flex flex-col items-center">
        <h2 className="m-0 mb-4 text-2xl font-semibold leading-8 text-foreground">
          {title}
        </h2>
        <p className="m-0 mb-8 text-lg font-normal leading-7 text-foreground">
          {description}
        </p>
        <Button
          size="lg"
          onClick={() => {
            if (onAction) onAction()
            else window.location.assign(actionHref)
          }}
        >
          {actionLabel}
        </Button>
      </div>
    </section>
  )
}
