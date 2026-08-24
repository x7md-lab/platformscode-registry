"use client"

import { useRef, useState, type DragEvent } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CloudUploadIcon,
  Delete02Icon,
  File01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

const DASHED =
  "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='4' ry='4' stroke='%23D2D6DBFF' stroke-width='2' stroke-dasharray='12%2c6.5' stroke-dashoffset='5' stroke-linecap='square'/%3e%3c/svg%3e\")"
const DASHED_ACTIVE =
  "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='4' ry='4' stroke='%231B8354FF' stroke-width='2' stroke-dasharray='12%2c6.5' stroke-dashoffset='5' stroke-linecap='square'/%3e%3c/svg%3e\")"

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} بايت`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} ك.ب`
  return `${(bytes / (1024 * 1024)).toFixed(1)} م.ب`
}

export function FileUpload({
  label = "المرفقات",
  heading = "اسحب الملفات هنا للرفع",
  helper = "الصيغ المدعومة: PDF",
  browseLabel = "استعراض الملفات",
  accept,
  multiple = true,
  maxSizeMB,
  onFilesChange,
  className,
}: {
  label?: string
  heading?: string
  helper?: string
  browseLabel?: string
  accept?: string
  multiple?: boolean
  maxSizeMB?: number
  onFilesChange?: (files: File[]) => void
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)

  function addFiles(incoming: FileList | null) {
    if (!incoming) return
    const accepted: File[] = []
    const rejected: string[] = []
    for (const file of Array.from(incoming)) {
      if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
        rejected.push(`${file.name} — يتجاوز الحد الأقصى (${maxSizeMB} م.ب).`)
      } else {
        accepted.push(file)
      }
    }
    const next = multiple ? [...files, ...accepted] : accepted.slice(0, 1)
    setFiles(next)
    setErrors(rejected)
    onFilesChange?.(next)
  }

  function remove(index: number) {
    const next = files.filter((_, i) => i !== index)
    setFiles(next)
    onFilesChange?.(next)
  }

  function onDrop(event: DragEvent) {
    event.preventDefault()
    setDragging(false)
    addFiles(event.dataTransfer.files)
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {label ? (
        <span className="text-sm font-semibold text-foreground">{label}</span>
      ) : null}
      <div
        role="button"
        tabIndex={0}
        aria-label={heading}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          // DGA dga-file-upload drop area: gray fill + dashed SVG border,
          // turns brand-tinted while dragging
          "flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-sm p-6 text-center transition-colors",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
          dragging ? "bg-primary-light" : "bg-muted"
        )}
        style={{ backgroundImage: dragging ? DASHED_ACTIVE : DASHED }}
      >
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-full",
            dragging
              ? "bg-primary-soft text-primary-accent"
              : "bg-card text-muted-foreground"
          )}
        >
          <HugeiconsIcon icon={CloudUploadIcon} size={22} strokeWidth={2} />
        </span>
        <span className="text-sm font-bold text-foreground">{heading}</span>
        <span className="text-xs text-muted-foreground">{helper}</span>
        <span className="text-sm font-semibold text-primary-accent">
          {browseLabel}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(event) => addFiles(event.target.files)}
        />
      </div>

      {files.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="flex w-full items-center gap-2 rounded-sm border border-border bg-muted p-2"
        >
          <span className="flex shrink-0 text-muted-foreground">
            <HugeiconsIcon icon={File01Icon} size={18} strokeWidth={2} />
          </span>
          <span className="min-w-0 grow truncate text-sm text-foreground" dir="ltr">
            {file.name}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatSize(file.size)}
          </span>
          <button
            type="button"
            aria-label={`حذف ${file.name}`}
            onClick={() => remove(index)}
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-muted-foreground transition-colors hover:bg-card hover:text-destructive focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={2} />
          </button>
        </div>
      ))}

      {errors.map((message) => (
        <p key={message} className="m-0 text-xs font-semibold text-destructive">
          {message}
        </p>
      ))}
    </div>
  )
}
