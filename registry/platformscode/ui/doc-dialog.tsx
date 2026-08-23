"use client"

import { useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/platformscode/ui/drawer"
import { Skeleton } from "@/registry/platformscode/ui/skeleton"
import {
  PHONE_QUERY,
  useMediaQuery,
} from "@/registry/platformscode/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, File02Icon } from "@hugeicons/core-free-icons"
import type { ReactNode } from "react"

const TRIGGER_CLASS =
  "inline cursor-pointer border-0 bg-transparent p-0 align-baseline font-[inherit] text-[length:inherit] font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"

export type DocPage = {
  src: string
  width: number
  height: number
}

function PageImage({ page, alt }: { page: DocPage; alt: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div
      style={loaded ? undefined : { aspectRatio: `${page.width} / ${page.height}` }}
      className="relative w-full rounded-sm border border-border bg-white"
    >
      {!loaded && <Skeleton className="absolute inset-0 rounded-[inherit]" />}
      <img
        src={page.src}
        alt={alt}
        width={page.width}
        height={page.height}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn("h-auto w-full rounded-[inherit]", !loaded && "invisible")}
      />
    </div>
  )
}

function Pages({ title, pages }: { title: string; pages: DocPage[] }) {
  return (
    <>
      {pages.map((page, i) => (
        <PageImage key={page.src} page={page} alt={`${title} — صفحة ${i + 1}`} />
      ))}
    </>
  )
}

export function DocDialog({
  label,
  title,
  pages,
  className,
}: {
  label: ReactNode
  title: string
  pages: DocPage[]
  className?: string
}) {
  const isPhone = useMediaQuery(PHONE_QUERY)

  if (isPhone) {
    return (
      <Drawer showSwipeHandle>
        <DrawerTrigger className={cn(TRIGGER_CLASS, className)}>{label}</DrawerTrigger>
        <DrawerContent dir="rtl">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="flex items-center justify-center gap-2 text-sm font-bold">
              <HugeiconsIcon
                icon={File02Icon}
                className="size-4 shrink-0 text-primary"
                aria-hidden
              />
              {title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain bg-muted p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Pages title={title} pages={pages} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className={cn(TRIGGER_CLASS, className)}>{label}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/50" />
        <Dialog.Popup
          dir="rtl"
          className="fixed inset-x-4 top-[5dvh] z-50 mx-auto flex max-h-[90dvh] w-auto max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl"
        >
          <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
            <Dialog.Title className="m-0 flex items-center gap-2 text-sm font-bold">
              <HugeiconsIcon icon={File02Icon} className="size-4 text-primary" aria-hidden />
              {title}
            </Dialog.Title>
            <Dialog.Close
              aria-label="إغلاق"
              className="flex size-8 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-4" aria-hidden />
            </Dialog.Close>
          </header>
          <div className="flex flex-col gap-3 overflow-y-auto bg-muted p-4">
            <Pages title={title} pages={pages} />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
