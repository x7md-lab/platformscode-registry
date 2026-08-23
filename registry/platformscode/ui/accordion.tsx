"use client"

import { Accordion as BaseAccordion } from "@base-ui/react/accordion"
import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

/**
 * Groups all parts of the accordion. Renders a Base UI `Accordion.Root`
 * (`<div>` element).
 */
export function Accordion({
  className,
  ...props
}: ComponentProps<typeof BaseAccordion.Root>) {
  return <BaseAccordion.Root className={cn("w-full", className)} {...props} />
}

/**
 * A single collapsible entry. Renders a Base UI `Accordion.Item` element.
 */
export function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof BaseAccordion.Item>) {
  return (
    <BaseAccordion.Item
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
  )
}

/**
 * Header button that toggles its item, with a rotating chevron.
 * Renders a Base UI `Accordion.Trigger` (`<button>` element).
 */
export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof BaseAccordion.Trigger>) {
  return (
    <BaseAccordion.Header className="m-0">
      <BaseAccordion.Trigger
        className={cn(
          "group flex w-full items-center justify-between gap-4 bg-transparent py-4 text-start text-base font-semibold",
          "cursor-pointer border-0 text-foreground outline-none transition-colors hover:text-primary",
          "focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        {...props}
      >
        {children}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[panel-open]:rotate-180"
          aria-hidden
        />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  )
}

/**
 * Collapsible body with a framer-motion height entrance.
 * Renders a Base UI `Accordion.Panel` element.
 */
export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof BaseAccordion.Panel>) {
  return (
    <BaseAccordion.Panel className={cn("overflow-hidden", className)} {...props}>
      {}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <div className="pb-4 text-sm leading-7 text-muted-foreground">{children}</div>
      </motion.div>
    </BaseAccordion.Panel>
  )
}
