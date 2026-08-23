"use client"

import { Tabs } from "@base-ui/react/tabs"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type Size = "sm" | "md" | "lg"

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
}

export type SwitcherItem = {
  label: ReactNode
  content: ReactNode
}

/**
 * DGA segmented switcher over Base UI Tabs with a sliding pill indicator.
 * Renders a Base UI `Tabs.Root` with a tablist and panels.
 */
export function ContentSwitcher({
  items,
  size = "md",
  onColor = false,
  label = "تبديل المحتوى",
  className,
}: {
  items: SwitcherItem[]
  size?: Size
  onColor?: boolean
  label?: string
  className?: string
}) {
  return (
    <Tabs.Root defaultValue={0} className={cn("w-full", className)}>
      <Tabs.List
        aria-label={label}
        className={cn(
          "relative inline-flex items-center gap-1 rounded-md p-1",
          onColor ? "bg-white/20" : "bg-muted"
        )}
      >
        {items.map((item, index) => (
          <Tabs.Tab
            key={index}
            value={index}
            className={cn(
              "relative z-10 flex cursor-pointer items-center justify-center whitespace-nowrap rounded-sm border-0 bg-transparent font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
              onColor
                ? "text-white/80 data-[active]:text-white"
                : "text-muted-foreground hover:text-foreground data-[active]:text-foreground",
              sizes[size]
            )}
          >
            {item.label}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator
          className={cn(
            "absolute left-0 top-1 z-0 h-[calc(100%-8px)] w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] rounded-sm transition-all duration-200",
            onColor ? "bg-white/30" : "bg-card shadow-sm"
          )}
        />
      </Tabs.List>
      {items.map((item, index) => (
        <Tabs.Panel
          key={index}
          value={index}
          className="py-4 text-sm leading-7 text-muted-foreground outline-none"
        >
          {item.content}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  )
}
