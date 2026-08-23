import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  Copy01Icon,
  SourceCodeIcon,
  Tick02Icon,
  TerminalIcon,
} from "@hugeicons/core-free-icons"
import { Skeleton } from "@/registry/platformscode/ui/skeleton"
import usageMap from "virtual:mdx-usage"

const CodeView = lazy(() => import("./code-view"))

const REGISTRY_URL = "https://x7md-lab.github.io/platformscode-registry/r"

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

function InstallCommand({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const command = `npx shadcn@latest add ${REGISTRY_URL}/${name}.json`

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(command)
    } catch {
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-auto flex flex-col gap-2">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <HugeiconsIcon icon={TerminalIcon} size={14} strokeWidth={2} />
        التثبيت
      </span>
      <div
        dir="ltr"
        className="group flex items-center gap-2 rounded-md border border-border bg-muted/60 py-1.5 pe-1.5 ps-3 transition-colors hover:border-primary/40"
      >
        <span aria-hidden className="select-none font-mono text-xs text-primary">
          $
        </span>
        <code className="grow overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground">
          {command}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "تم النسخ" : "نسخ الأمر"}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        >
          <HugeiconsIcon
            icon={copied ? Tick02Icon : Copy01Icon}
            size={15}
            strokeWidth={2}
            className={copied ? "text-success" : undefined}
          />
        </button>
      </div>
      <span aria-live="polite" className="sr-only">
        {copied ? "تم نسخ الأمر" : ""}
      </span>
    </div>
  )
}

function UsageBlock({ source }: { source: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex cursor-pointer items-center gap-1.5 self-start rounded-sm border-0 bg-transparent p-0 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
      >
        <HugeiconsIcon icon={SourceCodeIcon} size={14} strokeWidth={2} />
        الاستخدام
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={14}
          strokeWidth={2}
          className={open ? "rotate-180 transition-transform" : "transition-transform"}
        />
      </button>
      {open ? (
        <div
          dir="ltr"
          className="overflow-hidden rounded-md border border-border text-start"
        >
          <Suspense fallback={<Skeleton className="h-24 w-full rounded-none" />}>
            <CodeView code={source} />
          </Suspense>
        </div>
      ) : null}
    </div>
  )
}

export function Section({
  name,
  code,
  children,
  "data-ref": dataRef,
}: {
  name: string
  code: string
  children: ReactNode
  "data-ref"?: string
}) {
  const [view, setView] = useState<"preview" | "code">("preview")
  const refKey = dataRef ?? name
  const usage = usageMap[refKey]
  return (
    <div
      data-ref={refKey}
      className="relative my-4 flex min-h-[300px] flex-col gap-4 rounded-lg border border-border bg-card p-4"
    >
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
      <InstallCommand name={name} />
      {usage ? <UsageBlock source={usage} /> : null}
    </div>
  )
}
