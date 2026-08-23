"use client"

import { Toast } from "@base-ui/react/toast"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  Cancel01Icon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type Tone = "neutral" | "info" | "success" | "warning" | "critical"

const icons = {
  neutral: InformationCircleIcon,
  info: InformationCircleIcon,
  success: CheckmarkCircle02Icon,
  warning: Alert02Icon,
  critical: CancelCircleIcon,
}

const bars: Record<Tone, string> = {
  neutral: "before:bg-neutral-strong",
  info: "before:bg-info",
  success: "before:bg-success",
  warning: "before:bg-warning",
  critical: "before:bg-destructive",
}

const iconTones: Record<Tone, string> = {
  neutral: "text-neutral-strong",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  critical: "text-destructive",
}

export const ToastProvider = Toast.Provider
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = Toast.useToastManager

/**
 * Portalled viewport rendering the queued toasts in the start corner.
 * Renders a Base UI `Toast.Viewport` element.
 */
export function Toaster() {
  return (
    <Toast.Portal>
      <Toast.Viewport className="fixed bottom-4 z-[60] flex w-[calc(100vw-2rem)] max-w-[484px] flex-col-reverse gap-2 outline-none ltr:right-4 rtl:left-4">
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  )
}

function ToastList() {
  const { toasts } = Toast.useToastManager()
  return toasts.map((toast) => {
    const tone = ((toast.data as { tone?: Tone } | undefined)?.tone ??
      "neutral") as Tone
    return (
      <Toast.Root
        key={toast.id}
        toast={toast}
        className={cn(
          // DGA dga-notification-toast: white, 8px radius, 3xl shadow,
          // 8px tone bar on the start edge, 16x24 padding
          "relative flex w-full flex-col items-start gap-1 overflow-hidden rounded-md bg-card py-4 shadow-2xl outline-none ltr:pl-8 ltr:pr-10 rtl:pl-10 rtl:pr-8",
          "before:absolute before:inset-y-0 before:w-2 before:content-[''] ltr:before:left-0 rtl:before:right-0",
          "transition-[transform,opacity] duration-300 ease-out",
          "data-starting-style:translate-y-3 data-starting-style:opacity-0",
          "data-ending-style:translate-y-3 data-ending-style:opacity-0",
          bars[tone]
        )}
      >
        <div className="flex w-full items-start gap-3">
          <span className={cn("mt-0.5 flex shrink-0", iconTones[tone])}>
            <HugeiconsIcon icon={icons[tone]} size={20} strokeWidth={2} />
          </span>
          <div className="flex min-w-0 grow flex-col gap-0.5">
            <Toast.Title className="m-0 text-sm font-bold text-foreground" />
            <Toast.Description className="m-0 text-sm leading-6 text-muted-foreground" />
          </div>
          <Toast.Close
            aria-label="إغلاق الإشعار"
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
          </Toast.Close>
        </div>
      </Toast.Root>
    )
  })
}

/** Convenience wrapper: `<ToastProvider><Toaster />…</ToastProvider>` around the app,
 * then `const toast = useToast(); toast.add({ title, description, data: { tone: "success" } })`. */
export function ToastRegion({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <Toaster />
    </ToastProvider>
  )
}
