import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, BookOpen01Icon } from "@hugeicons/core-free-icons"
import apiMap from "virtual:api-docs"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"

/** Shared column track, applied to both the header row and every prop row. */
const COLUMNS =
  "sm:grid sm:grid-cols-[minmax(7rem,1.2fr)_minmax(8rem,2fr)_minmax(4rem,1fr)_2rem]"

/**
 * Below `sm` each cell stacks and labels itself from its `data-name`
 * (PocketBase's responsive-table trick), so the header row can be dropped.
 */
const CELL_LABEL =
  "before:mb-0.5 before:block before:text-[10px] before:font-bold before:uppercase before:tracking-wide before:text-muted-foreground before:content-[attr(data-name)] sm:before:hidden"

type DocEntry = { en: string | null; ar: string | null }

function doc(entry: DocEntry | undefined) {
  if (!entry) return null
  return entry.ar ?? entry.en
}

const HEADER_CELL =
  "px-3 py-1.5 text-[11px] font-semibold text-muted-foreground"

function PropRow({
  prop,
}: {
  prop: {
    name: string
    type: string
    optional: boolean
    default: string | null
    doc: DocEntry
  }
}) {
  const description = doc(prop.doc)
  return (
    <details className="group border-0 border-b border-solid border-border last:border-b-0">
      <summary
        className={`relative flex cursor-pointer list-none flex-col gap-2 p-3 pe-10 transition-colors hover:bg-muted/60 [&::-webkit-details-marker]:hidden sm:items-center sm:gap-0 sm:p-0 sm:pe-0 ${COLUMNS} ${FOCUS_RING}`}
      >
        <span
          data-name="Prop"
          className={`block w-full sm:overflow-x-auto sm:whitespace-nowrap sm:px-3 sm:py-2 sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden ${CELL_LABEL}`}
        >
          <code className="font-mono text-xs text-foreground">
            {prop.name}
            {prop.optional ? (
              <span className="text-muted-foreground">?</span>
            ) : null}
          </code>
        </span>
        <span
          data-name="Type"
          className={`block w-full sm:overflow-x-auto sm:whitespace-nowrap sm:px-3 sm:py-2 sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden ${CELL_LABEL}`}
        >
          <code className="break-all font-mono text-[11px] text-primary-hover sm:break-normal">
            {prop.type}
          </code>
        </span>
        <span
          data-name="Default"
          className={`block w-full sm:px-3 sm:py-2 ${CELL_LABEL}`}
        >
          <code className="font-mono text-[11px] text-muted-foreground">
            {prop.default ?? "—"}
          </code>
        </span>
        <span className="absolute end-3 top-3 flex items-center justify-center text-muted-foreground sm:static sm:end-auto sm:top-auto">
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={14}
            strokeWidth={2}
            className="transition-transform duration-200 group-open:rotate-180"
          />
        </span>
      </summary>
      <dl className="m-0 flex flex-col gap-0 border-0 border-t border-solid border-border bg-muted/30 px-3 py-2 text-xs">
        <div className="grid grid-cols-1 gap-0.5 py-1 sm:grid-cols-[5rem_1fr] sm:items-baseline sm:gap-2">
          <dt className="font-semibold text-muted-foreground">Name</dt>
          <dd className="m-0">
            <code className="font-mono text-xs text-info-strong">
              {prop.name}
            </code>
          </dd>
        </div>
        {description ? (
          <div className="grid grid-cols-1 gap-0.5 border-0 border-t border-solid border-border/60 py-1.5 sm:grid-cols-[5rem_1fr] sm:items-baseline sm:gap-2">
            <dt className="font-semibold text-muted-foreground">الوصف</dt>
            <dd dir="rtl" className="m-0 text-start leading-5 text-foreground">
              {description}
            </dd>
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-0.5 border-0 border-t border-solid border-border/60 py-1.5 sm:grid-cols-[5rem_1fr] sm:items-baseline sm:gap-2">
          <dt className="font-semibold text-muted-foreground">Type</dt>
          <dd className="m-0 overflow-x-auto">
            <code className="break-all font-mono text-[11px] text-primary-hover sm:whitespace-pre sm:break-normal">
              {prop.type}
              {prop.optional ? " | undefined" : ""}
            </code>
          </dd>
        </div>
      </dl>
    </details>
  )
}

export function ApiReference({ name }: { name: string }) {
  const parts = apiMap[name]
  const [open, setOpen] = useState(false)
  if (!parts?.length) return null

  const documented = parts.filter(
    (part) => part.doc.en || part.props.length || part.inherits.length
  )
  if (!documented.length) return null

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 border-0 bg-muted/60 px-3 py-2 text-start transition-colors hover:bg-muted ${FOCUS_RING}`}
      >
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <HugeiconsIcon icon={BookOpen01Icon} size={14} strokeWidth={2} />
          مرجع الواجهة
        </span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={16}
          strokeWidth={2}
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-6 border-0 border-t border-solid border-border p-3 sm:p-4">
            {documented.map((part) => (
              <section key={part.name} className="flex flex-col gap-2">
                <h4
                  dir="ltr"
                  className="m-0 self-end font-mono text-sm font-bold text-foreground"
                >
                  {part.name}
                </h4>
                {doc(part.doc) ? (
                  <p className="m-0 text-sm leading-6 text-muted-foreground">
                    {doc(part.doc)}
                  </p>
                ) : null}
                {part.inherits.length ? (
                  <p className="m-0 text-xs text-muted-foreground">
                    يرث خصائص{" "}
                    <code
                      dir="ltr"
                      className="inline-block max-w-full overflow-x-auto break-all rounded-sm bg-muted px-1 py-0.5 align-bottom font-mono text-[11px] sm:break-normal"
                    >
                      {part.inherits.join(" & ")}
                    </code>
                  </p>
                ) : null}
                {part.props.length ? (
                  <div
                    dir="ltr"
                    className="overflow-hidden rounded-md border border-border text-start"
                  >
                    <div
                      aria-hidden
                      className={`hidden border-0 border-b border-solid border-border bg-muted/60 ${COLUMNS}`}
                    >
                      <span className={HEADER_CELL}>Prop</span>
                      <span className={HEADER_CELL}>Type</span>
                      <span className={HEADER_CELL}>Default</span>
                      <span />
                    </div>
                    {part.props.map((prop) => (
                      <PropRow key={prop.name} prop={prop} />
                    ))}
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
