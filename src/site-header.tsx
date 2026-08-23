import { useCallback, useSyncExternalStore } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { GithubIcon, Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"
import { previewPrefs, usePreviewPrefs } from "./preview-prefs"

const REPO = "x7md-lab/platformscode-registry"
const REPO_URL = `https://github.com/${REPO}`

/** Tracks whether the page has scrolled past the header's own height. */
function useScrolled(threshold = 8) {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("scroll", onChange, { passive: true })
    return () => window.removeEventListener("scroll", onChange)
  }, [])
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false
  )
}

function ModeToggle() {
  const { mode } = usePreviewPrefs()
  const dark = mode === "dark"
  return (
    <button
      type="button"
      aria-pressed={dark}
      aria-label={dark ? "الوضع الفاتح" : "الوضع الداكن"}
      title={dark ? "الوضع الفاتح" : "الوضع الداكن"}
      onClick={() => previewPrefs.set({ mode: dark ? "light" : "dark" })}
      className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
    >
      <HugeiconsIcon
        icon={dark ? Sun03Icon : Moon02Icon}
        size={16}
        strokeWidth={2}
      />
    </button>
  )
}

export function SiteHeader() {
  const scrolled = useScrolled()

  return (
    <header
      data-scrolled={scrolled || undefined}
      className={[
        "sticky top-0 z-50 w-full transition-colors duration-300",
        // transparent at rest, frosted once the page moves
        "bg-transparent data-[scrolled]:bg-background/70 data-[scrolled]:backdrop-blur-md",
        // hairline that fades in from the edges instead of a flat border
        "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-l after:from-transparent after:via-border after:to-transparent after:opacity-0 after:transition-opacity after:duration-300 data-[scrolled]:after:opacity-100",
      ].join(" ")}
    >
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-4 px-4 lg:max-w-5xl xl:max-w-6xl">
        <a
          href="#top"
          className="group flex shrink-0 items-center gap-2.5 no-underline"
        >
          <span
            aria-hidden
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-black leading-none text-primary-foreground transition-transform duration-300 group-hover:-rotate-6"
          >
            م
          </span>
          <span className="flex min-w-0 flex-col gap-0.5 leading-none">
            <span className="truncate text-sm font-bold text-foreground">
              كود المنصات
            </span>
            <span className="truncate text-[10px] text-muted-foreground">
              سجل مكوّنات shadcn
            </span>
          </span>
        </a>

        <div className="flex min-w-0 shrink items-center gap-2">
          <ModeToggle />
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            dir="ltr"
            aria-label={`مستودع ${REPO} على GitHub`}
            className="group inline-flex min-w-0 shrink items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 font-mono text-xs text-muted-foreground no-underline transition-colors hover:border-primary/40 hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
          >
            <HugeiconsIcon
              icon={GithubIcon}
              size={15}
              strokeWidth={2}
              className="shrink-0 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="truncate">
              <span className="hidden sm:inline">x7md-lab/</span>
              platformscode-registry
            </span>
          </a>
        </div>
      </div>
    </header>
  )
}
