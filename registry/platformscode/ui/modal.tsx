"use client"

import { Dialog } from "@base-ui/react/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { ComponentProps, ReactNode } from "react"

/**
 * Groups all parts of the modal and holds its open state.
 * Renders a Base UI `Dialog.Root` (no HTML element of its own).
 */
export function Modal(props: ComponentProps<typeof Dialog.Root>) {
  return <Dialog.Root {...props} />
}

/** Opens the modal. Renders a Base UI `Dialog.Trigger` (`<button>`). */
export const ModalTrigger = Dialog.Trigger
/** Closes the modal. Renders a Base UI `Dialog.Close` (`<button>`). */
export const ModalClose = Dialog.Close

/**
 * The DGA modal surface: 600px card with title, description and stacked
 * actions, backdrop and viewport included. Renders a portalled Base UI
 * `Dialog.Popup` element.
 */
export function ModalContent({
  title,
  description,
  actions,
  showClose = true,
  className,
  children,
  ...props
}: ComponentProps<typeof Dialog.Popup> & {
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  showClose?: boolean
}) {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-50 min-h-dvh bg-black/40 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
      <Dialog.Viewport className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
        <Dialog.Popup
          className={cn(
            // DGA dga-modal: 600px, 24px padding, 8px radius, 24px gap, 3xl shadow
            "flex w-full max-w-[600px] flex-col gap-6 rounded-t-md bg-card p-6 shadow-2xl outline-none sm:rounded-md",
            "max-h-[calc(100dvh-3rem)] overflow-y-auto overscroll-contain",
            "transition-[transform,opacity] duration-200 ease-out",
            "data-starting-style:translate-y-4 data-starting-style:opacity-0 data-ending-style:translate-y-4 data-ending-style:opacity-0",
            "sm:data-starting-style:translate-y-0 sm:data-starting-style:scale-95 sm:data-ending-style:translate-y-0 sm:data-ending-style:scale-95",
            className
          )}
          {...props}
        >
          {(title || showClose) && (
            <div className="flex w-full items-start justify-between gap-4">
              {title ? (
                <Dialog.Title className="m-0 text-lg font-bold text-foreground">
                  {title}
                </Dialog.Title>
              ) : (
                <span />
              )}
              {showClose && (
                <Dialog.Close
                  aria-label="إغلاق"
                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-border focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
                </Dialog.Close>
              )}
            </div>
          )}
          <div className="flex w-full flex-col gap-2">
            {description ? (
              <Dialog.Description className="m-0 text-sm leading-7 text-muted-foreground">
                {description}
              </Dialog.Description>
            ) : null}
            {children}
          </div>
          {actions ? (
            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3 [&>button]:w-full sm:[&>button]:w-auto">
              {actions}
            </div>
          ) : null}
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  )
}
