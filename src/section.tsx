import { lazy, Suspense, useState, type ReactNode } from "react"
import { Skeleton } from "@/registry/platformscode/ui/skeleton"

const CodeView = lazy(() => import("./code-view"))

function cnSwitch(active: boolean) {
  return [
    "cursor-pointer rounded-sm border-0 px-3 py-1 text-xs font-semibold transition-colors",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
    active
      ? "bg-card text-foreground shadow-sm"
      : "bg-transparent text-muted-foreground hover:text-foreground",
  ].join(" ")
}

function ViewSwitcher({
  view,
  onChange,
}: {
  view: "preview" | "code"
  onChange: (view: "preview" | "code") => void
}) {
  return (
    <div
      role="tablist"
      aria-label="طريقة العرض"
      className="flex shrink-0 items-center gap-1 rounded-sm bg-muted p-1"
    >
      {(
        [
          ["preview", "معاينة"],
          ["code", "الكود"],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          role="tab"
          type="button"
          aria-selected={view === value}
          onClick={() => onChange(value)}
          className={cnSwitch(view === value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export function Section({
  name,
  code,
  children,
}: {
  name: string
  code: string
  children: ReactNode
}) {
  const [view, setView] = useState<"preview" | "code">("preview")
  return (
    <div className="relative my-4 flex min-h-[300px] flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-4">
        <span dir="ltr" className="font-mono text-xs text-muted-foreground">
          {name}.tsx
        </span>
        <ViewSwitcher view={view} onChange={setView} />
      </div>
      {view === "preview" ? (
        <div className="relative flex min-h-[220px] flex-1 items-center justify-center p-4">
          {children}
        </div>
      ) : (
        <div dir="ltr" className="overflow-hidden rounded-md border border-border text-start">
          <Suspense fallback={<Skeleton className="h-40 w-full rounded-none" />}>
            <CodeView code={code} />
          </Suspense>
        </div>
      )}
    </div>
  )
}
