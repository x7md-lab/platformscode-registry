"use client"

import { useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { ArrowDown01Icon, Stamp02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export type StampItem = {
  icon: IconSvgElement
  title: string
  description: ReactNode
  ok?: boolean
}

/**
 * DGA digital-signature bar: collapsible verification list with staggered
 * circular check items. Renders a `<div>` element.
 */
export function DigitalStamp({
  heading,
  items,
  registration,
  showLabel = "كيف تتحقق",
  hideLabel = "إخفاء التفاصيل",
  className,
}: {
  heading: string
  items: StampItem[]
  registration?: ReactNode
  showLabel?: ReactNode
  hideLabel?: ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className={cn("rounded-md bg-muted px-6 pt-2", open ? "pb-6" : "pb-2", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-2.5 border-0 bg-transparent py-2 text-start focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
      >
        <HugeiconsIcon
          icon={Stamp02Icon}
          className="size-4 shrink-0 text-primary-accent sm:size-5"
          aria-hidden
        />
        <p className="m-0 grow text-[13px] font-medium leading-[18px] text-foreground sm:text-sm sm:leading-5">
          {heading}
        </p>
        <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[13px] text-primary-accent sm:gap-2 sm:text-sm">
          {open ? hideLabel : showLabel}
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className={cn(
              "size-4 shrink-0 transition-transform duration-200 sm:size-5",
              open && "rotate-180"
            )}
            aria-hidden
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-wrap items-start gap-4 pb-4 sm:mt-6 sm:gap-[18px] sm:pb-6">
              {items.map(({ icon: Icon, title, description, ok = true }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.08 + i * 0.05 }}
                  className="flex w-full items-start gap-4 sm:w-[calc(50%-9px)] sm:gap-6"
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border shadow-sm sm:size-9",
                      ok
                        ? "border-success text-success"
                        : "border-destructive text-destructive"
                    )}
                  >
                    <HugeiconsIcon icon={Icon} className="size-4" aria-hidden />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">{title}</span>
                    <span className="text-xs leading-5 text-muted-foreground">
                      {description}
                    </span>
                  </span>
                </motion.div>
              ))}
              {registration && <div className="w-full">{registration}</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
