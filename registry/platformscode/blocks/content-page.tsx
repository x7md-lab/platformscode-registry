"use client"

import {
  TableOfContent,
  type TocEntry,
} from "@/registry/platformscode/ui/table-of-content"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

/**
 * DGA «صفحة المحتوى» — prose column with a sticky table-of-content rail
 * (scroll-spy) on the side; the rail collapses under the content on mobile.
 */
export function ContentPage({
  title,
  description,
  toc,
  tocTitle = "في هذه الصفحة",
  className,
  children,
}: {
  title: string
  description?: string
  toc: TocEntry[]
  tocTitle?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("flex w-full flex-col gap-8", className)}>
      <header className="flex flex-col gap-3">
        <h1 className="m-0 text-3xl font-bold leading-10 tracking-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="m-0 max-w-2xl text-base leading-8 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </header>
      <div className="flex flex-col-reverse gap-10 lg:flex-row lg:items-start">
        <article className="min-w-0 grow text-sm leading-7 text-foreground [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2:first-child]:mt-0 [&_p]:my-2 [&_p]:leading-7 [&_p]:text-muted-foreground">
          {children}
        </article>
        <TableOfContent
          title={tocTitle}
          entries={toc}
          className="shrink-0 lg:sticky lg:top-24"
        />
      </div>
    </div>
  )
}
