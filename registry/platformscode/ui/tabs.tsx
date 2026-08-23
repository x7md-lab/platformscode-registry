"use client"

import { Tabs as BaseTabs } from "@base-ui/react/tabs"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

export function Tabs({
  className,
  ...props
}: ComponentProps<typeof BaseTabs.Root>) {
  return <BaseTabs.Root className={cn("w-full", className)} {...props} />
}

export function TabsList({
  className,
  divider = true,
  ...props
}: ComponentProps<typeof BaseTabs.List> & { divider?: boolean }) {
  return (
    <BaseTabs.List
      className={cn(
        "relative flex w-full items-center gap-1 overflow-x-auto",
        divider
          ? "after:absolute after:inset-x-0 after:bottom-0 after:z-20 after:block after:h-[3px] after:rounded-full after:bg-neutral-border"
          : undefined,
        className
      )}
      {...props}
    >
      {props.children}
      <BaseTabs.Indicator className="absolute bottom-0 left-0 z-30 h-[3px] w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] rounded-full bg-primary transition-all duration-200" />
    </BaseTabs.List>
  )
}

export function Tab({ className, ...props }: ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      className={cn(
        "relative z-10 flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-sm border-0 bg-transparent px-4 py-3 text-sm font-medium text-neutral-strong transition-colors",
        "hover:bg-muted hover:text-foreground active:bg-border",
        "after:absolute after:inset-x-4 after:bottom-0 after:z-20 after:h-[3px] after:rounded-full after:bg-primary/40 after:opacity-0 after:transition-opacity",
        "hover:after:opacity-100 data-[active]:after:opacity-0",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
        "data-[active]:bg-transparent data-[active]:text-primary",
        className
      )}
      {...props}
    />
  )
}

export function TabPanel({
  className,
  ...props
}: ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel
      className={cn("py-4 text-sm leading-7 text-muted-foreground outline-none", className)}
      {...props}
    />
  )
}
