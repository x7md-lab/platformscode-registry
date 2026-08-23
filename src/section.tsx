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
import { usePreviewPrefs } from "./preview-prefs"
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

// ---- layout shell ----
//
// Previews are contained by default. Turning the container off (preview
// settings sheet) drops the section out of the page container on mobile
// portrait — `w-screen` + negative inline margins — so a demo can use the
// full screen width; the card chrome returns at `sm` or in landscape.

const SHELL = "relative my-4 flex min-h-[300px] flex-col gap-4 rounded-lg border border-border bg-card py-4"

const SHELL_BLEED = [
  "max-sm:portrait:mx-[calc(50%-50vw)] max-sm:portrait:w-screen",
  "max-sm:portrait:rounded-none max-sm:portrait:border-x-0",
].join(" ")

/** Horizontal gutter shared by everything that is text, not demo. */
const GUTTER = "px-4"

const PREVIEW = "relative flex min-h-[220px] flex-1 items-center justify-center"

/**
 * Page-chrome demos (navbars, shells, footers) always run edge to edge and
 * unpadded — a navbar boxed inside a padded card reads wrong. The container
 * and padding preferences only govern the regular component previews.
 */
const SHELL_LIKE = new Set([
  "navigation-header",
  "second-nav-header",
  "footer",
  "page-shell",
])

function SectionToolbar({
  name,
  view,
  onChange,
}: {
  name: string
  view: "preview" | "code"
  onChange: (view: "preview" | "code") => void
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${GUTTER}`}>
      <span dir="ltr" className="font-mono text-xs text-muted-foreground">
        {name}.tsx
      </span>
      <ViewSwitcher view={view} onChange={onChange} />
    </div>
  )
}

function SectionCode({ code }: { code: string }) {
  return (
    <div className={GUTTER}>
      <div
        dir="ltr"
        className="overflow-hidden rounded-md border border-border text-start"
      >
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-none" />}>
          <CodeView code={code} />
        </Suspense>
      </div>
    </div>
  )
}

function SectionMeta({
  name,
  refKey,
  usage,
}: {
  name: string
  refKey: string
  usage?: string
}) {
  return (
    <div className={`mt-auto flex flex-col gap-3 ${GUTTER}`}>
      <InstallCommand name={name} />
      {usage ? <UsageBlock source={usage} /> : null}
      <ApiReference name={refKey} />
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
  const { contained, padded } = usePreviewPrefs()
  const refKey = dataRef ?? name
  const usage = usageMap[refKey]

  // Shell-like demos opt out of both preferences.
  const isShell = SHELL_LIKE.has(refKey)
  const bleeds = isShell || !contained
  const pads = isShell ? false : padded

  return (
    <div
      data-ref={refKey}
      data-contained={!bleeds || undefined}
      data-shell={isShell || undefined}
      className={`${SHELL} ${bleeds ? SHELL_BLEED : ""}`}
    >
      <SectionToolbar name={name} view={view} onChange={setView} />
      {view === "preview" ? (
        <div
          className={[
            PREVIEW,
            pads ? "p-4" : "p-0",
            bleeds ? "max-sm:portrait:px-0" : "",
          ].join(" ")}
        >
          {children}
        </div>
      ) : (
        <SectionCode code={code} />
      )}
      <SectionMeta name={name} refKey={refKey} usage={usage} />
    </div>
  )
}
