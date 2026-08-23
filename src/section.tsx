import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
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
import { ApiReference } from "./api-reference"
import usageMap from "virtual:mdx-usage"

const CodeView = lazy(() => import("./code-view"))

const REGISTRY_URL = "https://x7md-lab.github.io/platformscode-registry/r"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"

// ---- package-manager choice, shared across every section ----

type Pm = "pnpm" | "npm" | "yarn" | "bun"

const PM_RUNNERS: Record<Pm, string> = {
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
}

let currentPm: Pm = "npm"
const pmListeners = new Set<() => void>()
const pmStore = {
  get: () => currentPm,
  set(pm: Pm) {
    currentPm = pm
    pmListeners.forEach((listener) => listener())
  },
  subscribe(listener: () => void) {
    pmListeners.add(listener)
    return () => {
      pmListeners.delete(listener)
    }
  },
}

// ---- shared bits ----

function CopyButton({ text, label = "نسخ" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "تم النسخ" : label}
        className={`flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-muted-foreground transition-colors hover:bg-card hover:text-foreground active:bg-border ${FOCUS_RING}`}
      >
        <HugeiconsIcon
          icon={copied ? Tick02Icon : Copy01Icon}
          size={15}
          strokeWidth={2}
          className={copied ? "text-success" : undefined}
        />
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "تم النسخ" : ""}
      </span>
    </>
  )
}

function cnSwitch(active: boolean) {
  return [
    "cursor-pointer rounded-sm border-0 px-3 py-1 text-xs font-semibold transition-colors",
    FOCUS_RING,
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

// ---- install panel: pm tabs over a dark terminal strip ----

function InstallCommand({ name }: { name: string }) {
  const pm = useSyncExternalStore(pmStore.subscribe, pmStore.get, pmStore.get)
  const command = `${PM_RUNNERS[pm]} shadcn@latest add ${REGISTRY_URL}/${name}.json`

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="flex items-center justify-between gap-3 border-0 border-b border-solid border-border bg-muted/60 px-2 py-1.5">
        <span className="flex items-center gap-1.5 ps-1 text-xs font-semibold text-muted-foreground">
          <HugeiconsIcon icon={TerminalIcon} size={14} strokeWidth={2} />
          التثبيت
        </span>
        <div dir="ltr" className="flex items-center gap-1">
          <div
            role="tablist"
            aria-label="مدير الحزم"
            className="flex items-center gap-0.5 rounded-sm bg-muted p-0.5"
          >
            {(Object.keys(PM_RUNNERS) as Pm[]).map((value) => (
              <button
                key={value}
                role="tab"
                type="button"
                aria-selected={pm === value}
                onClick={() => pmStore.set(value)}
                className={[
                  "cursor-pointer rounded-[3px] border-0 px-2 py-0.5 font-mono text-[11px] transition-colors",
                  FOCUS_RING,
                  pm === value
                    ? "bg-card font-semibold text-foreground shadow-sm"
                    : "bg-transparent text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {value}
              </button>
            ))}
          </div>
          <CopyButton text={command} label="نسخ الأمر" />
        </div>
      </div>
      <div
        dir="ltr"
        className="flex items-center gap-2 bg-[#0c111b] px-3 py-2.5"
      >
        <span
          aria-hidden
          className="select-none font-mono text-xs text-primary-bright"
        >
          $
        </span>
        <code className="grow overflow-x-auto whitespace-nowrap font-mono text-xs text-neutral-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {command}
        </code>
      </div>
    </div>
  )
}

// ---- usage panel: collapsible original MDX demo source ----

function UsageBlock({ source }: { source: string }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  function toggle() {
    setOpen((value) => !value)
    setMounted(true)
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="flex items-center gap-2 bg-muted/60 pe-2">
        <button
          type="button"
          aria-expanded={open}
          onClick={toggle}
          className={`flex grow cursor-pointer items-center justify-between gap-2 border-0 bg-transparent px-3 py-2 text-start transition-colors hover:bg-muted ${FOCUS_RING}`}
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <HugeiconsIcon icon={SourceCodeIcon} size={14} strokeWidth={2} />
            الاستخدام
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={16}
            strokeWidth={2}
            className={`shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open ? <CopyButton text={source} label="نسخ كود الاستخدام" /> : null}
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div dir="ltr" className="border-0 border-t border-solid border-border text-start">
            {mounted ? (
              <Suspense
                fallback={<Skeleton className="h-24 w-full rounded-none" />}
              >
                <CodeView code={source} />
              </Suspense>
            ) : null}
          </div>
        </div>
      </div>
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
      <div className="mt-auto flex flex-col gap-3">
        <InstallCommand name={name} />
        {usage ? <UsageBlock source={usage} /> : null}
        <ApiReference name={refKey} />
      </div>
    </div>
  )
}
