"use client"

import { useState, type ComponentProps, type FormEvent } from "react"
import { Input } from "@base-ui/react/input"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type Size = "sm" | "md" | "lg"

const sizes: Record<Size, string> = {
  sm: "h-9 text-sm",
  md: "h-11 text-sm",
  lg: "h-13 text-base",
}

export function SearchBox({
  size = "md",
  placeholder = "ابحث",
  label = "البحث",
  buttonLabel,
  defaultValue = "",
  onSearch,
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "size" | "defaultValue"> & {
  size?: Size
  label?: string
  buttonLabel?: string
  defaultValue?: string
  onSearch?: (query: string) => void
}) {
  const [query, setQuery] = useState(defaultValue)

  function submit(event: FormEvent) {
    event.preventDefault()
    onSearch?.(query)
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn("flex w-full items-center gap-2", className)}
    >
      <div
        className={cn(
          "flex grow items-center gap-2 rounded-sm border border-input bg-card px-4 transition-colors",
          "focus-within:border-ring hover:border-neutral-strong",
          sizes[size]
        )}
      >
        <HugeiconsIcon
          icon={Search01Icon}
          size={18}
          strokeWidth={2}
          className="shrink-0 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          aria-label={label}
          placeholder={placeholder}
          value={query}
          onValueChange={setQuery}
          className="h-full w-full grow border-0 bg-transparent p-0 text-inherit text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
          {...props}
        />
        {query ? (
          <button
            type="button"
            aria-label="مسح البحث"
            onClick={() => setQuery("")}
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-muted text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2.5} />
          </button>
        ) : null}
      </div>
      {buttonLabel ? (
        <button
          type="submit"
          className={cn(
            "shrink-0 cursor-pointer rounded-sm border-0 bg-primary px-5 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
            sizes[size]
          )}
        >
          {buttonLabel}
        </button>
      ) : null}
    </form>
  )
}
