"use client"

import { Avatar as BaseAvatar } from "@base-ui/react/avatar"
import { cn } from "@/lib/utils"
import type { ComponentProps, ReactNode } from "react"

type Size = 24 | 32 | 40 | 48 | 68 | 80 | 120

const sizes: Record<Size, string> = {
  24: "size-6 text-[10px]",
  32: "size-8 text-xs",
  40: "size-10 text-sm",
  48: "size-12 text-base",
  68: "size-17 text-xl",
  80: "size-20 text-2xl",
  120: "size-30 text-4xl",
}

export function Avatar({
  size = 40,
  square = false,
  border = false,
  src,
  alt,
  text,
  icon,
  className,
  ...props
}: ComponentProps<typeof BaseAvatar.Root> & {
  size?: Size
  square?: boolean
  border?: boolean
  src?: string
  alt?: string
  text?: string
  icon?: ReactNode
}) {
  return (
    <BaseAvatar.Root
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center overflow-hidden bg-muted font-bold text-muted-foreground",
        square ? "rounded-md" : "rounded-full",
        border ? "border-2 border-card ring-1 ring-border" : undefined,
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <BaseAvatar.Image
          src={src}
          alt={alt}
          className="size-full object-cover"
        />
      ) : null}
      <BaseAvatar.Fallback className="flex size-full items-center justify-center">
        {icon ?? text}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  )
}

export function AvatarGroup({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center ltr:-space-x-3 rtl:space-x-reverse rtl:-space-x-3",
        className
      )}
      {...props}
    />
  )
}
