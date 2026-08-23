"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export type TocEntry = {
  label: string
  target: string
  children?: TocEntry[]
}

/**
 * DGA «قائمة المحتويات» — side rail listing page sections, 2px start-edge
 * rail per entry that turns brand for the active section (scroll-spy).
 */
export function TableOfContent({
  title = "في هذه الصفحة",
  subtitle,
  entries,
  spy = true,
  className,
}: {
  title?: string
  subtitle?: string
  entries: TocEntry[]
  spy?: boolean
  className?: string
}) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!spy) return
    const targets = entries
      .flatMap((entry) => [entry, ...(entry.children ?? [])])
      .map((entry) => document.getElementById(entry.target.replace(/^#/, "")))
      .filter((element): element is HTMLElement => Boolean(element))
    if (!targets.length) return
    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (record.isIntersecting) setActive(`#${record.target.id}`)
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    )
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [entries, spy])

  const renderEntry = (entry: TocEntry, depth: number) => {
    const isActive = active === entry.target
    return (
      <li key={entry.target} className="list-none">
        <a
          href={entry.target}
          aria-current={isActive ? "location" : undefined}
          onClick={() => setActive(entry.target)}
          className={cn(
            "relative block border-0 border-s-2 border-solid py-1.5 text-sm no-underline transition-colors",
            depth === 0 ? "ps-4" : "ps-8",
            isActive
              ? "border-primary font-semibold text-primary"
              : "border-neutral-border text-muted-foreground hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
          )}
        >
          {entry.label}
        </a>
        {entry.children?.length ? (
          <ul className="m-0 p-0">
            {entry.children.map((child) => renderEntry(child, depth + 1))}
          </ul>
        ) : null}
      </li>
    )
  }

  return (
    <nav
      aria-label={title}
      className={cn("flex w-[228px] flex-col gap-2", className)}
    >
      <div className="flex flex-col gap-1 ps-4">
        <span className="text-sm font-bold text-foreground">{title}</span>
        {subtitle ? (
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        ) : null}
      </div>
      <ul className="m-0 flex flex-col p-0">
        {entries.map((entry) => renderEntry(entry, 0))}
      </ul>
    </nav>
  )
}
