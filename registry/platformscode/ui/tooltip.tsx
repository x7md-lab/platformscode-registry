"use client"

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip"
import { cn } from "@/lib/utils"
import type { ComponentProps, ReactNode } from "react"

type Theme = "dark" | "light"

const themes: Record<Theme, string> = {
  dark: "bg-foreground text-background",
  light: "bg-card text-foreground border border-border shadow-lg",
}

const arrows: Record<Theme, string> = {
  dark: "fill-foreground",
  light: "fill-card stroke-border",
}

export function Tooltip({
  children,
  title,
  helperText,
  theme = "dark",
  side = "top",
  align = "center",
  arrow = true,
  className,
  ...props
}: Omit<ComponentProps<typeof BaseTooltip.Root>, "children"> & {
  children: ReactNode
  title?: string
  helperText?: string
  theme?: Theme
  side?: ComponentProps<typeof BaseTooltip.Positioner>["side"]
  align?: ComponentProps<typeof BaseTooltip.Positioner>["align"]
  arrow?: boolean
  className?: string
}) {
  return (
    <BaseTooltip.Root {...props}>
      <BaseTooltip.Trigger
        render={<span className="inline-flex cursor-help" />}
      >
        {children}
      </BaseTooltip.Trigger>
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          side={side}
          align={align}
          sideOffset={8}
          className="z-50 outline-none"
        >
          <BaseTooltip.Popup
            className={cn(
              "max-w-64 rounded-md px-3 py-2 text-xs leading-5 outline-none",
              "origin-[var(--transform-origin)] transition-[transform,opacity] duration-150",
              "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
              "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
              themes[theme],
              className
            )}
          >
            {arrow ? (
              <BaseTooltip.Arrow
                className={cn(
                  "data-[side=bottom]:top-[-8px] data-[side=bottom]:rotate-180",
                  "data-[side=left]:right-[-13px] data-[side=left]:rotate-90",
                  "data-[side=right]:left-[-13px] data-[side=right]:-rotate-90",
                  "data-[side=top]:bottom-[-8px]"
                )}
              >
                <svg width="20" height="10" viewBox="0 0 20 10">
                  <path
                    d="M9.66 9.06 4.3 3.7A2 2 0 0 0 2.89 3.1H0v-1h20v1h-2.9a2 2 0 0 0-1.4.58l-5.37 5.37a1 1 0 0 1-1.42 0Z"
                    className={arrows[theme]}
                  />
                </svg>
              </BaseTooltip.Arrow>
            ) : null}
            {title ? <p className="m-0 font-bold">{title}</p> : null}
            {helperText ? (
              <p
                className={cn(
                  "m-0",
                  title ? "mt-1 opacity-80" : undefined
                )}
              >
                {helperText}
              </p>
            ) : null}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}

export const TooltipProvider = BaseTooltip.Provider
