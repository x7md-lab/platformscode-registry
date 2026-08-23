"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/registry/platformscode/ui/button"
import { Checkbox } from "@/registry/platformscode/ui/checkbox"
import { InlineAlert } from "@/registry/platformscode/ui/inline-alert"
import { Textarea } from "@/registry/platformscode/ui/textarea"
import { cn } from "@/lib/utils"

const defaultReasons = {
  yes: [
    "المحتوى واضح ومفيد",
    "وجدت ما أبحث عنه بسرعة",
    "الخطوات سهلة التنفيذ",
    "سبب آخر",
  ],
  no: [
    "المحتوى غير واضح",
    "المعلومة غير دقيقة",
    "لم أجد ما أبحث عنه",
    "سبب آخر",
  ],
}

export function FeedbackSection({
  heading = "هل كانت هذه الصفحة مفيدة؟",
  reasons = defaultReasons,
  onSubmit,
  className,
}: {
  heading?: string
  reasons?: { yes: string[]; no: string[] }
  onSubmit?: (result: {
    useful: boolean
    reasons: string[]
    comment: string
  }) => void
  className?: string
}) {
  const [useful, setUseful] = useState<boolean | null>(null)
  const [picked, setPicked] = useState<string[]>([])
  const [comment, setComment] = useState("")
  const [sent, setSent] = useState(false)

  function choose(value: boolean) {
    setUseful(value)
    setPicked([])
  }

  function toggle(reason: string) {
    setPicked((current) =>
      current.includes(reason)
        ? current.filter((item) => item !== reason)
        : [...current, reason]
    )
  }

  if (sent) {
    return (
      <div className={cn("w-full", className)}>
        <InlineAlert
          tone="success"
          leadText="شكرًا لمشاركتك"
          helperText="ملاحظاتك تساعدنا على تحسين المحتوى."
        />
      </div>
    )
  }

  return (
    <section
      className={cn(
        "flex w-full flex-col gap-4 rounded-lg border border-border bg-card p-6",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="m-0 text-base font-bold text-foreground">{heading}</h2>
        <div className="flex items-center gap-3">
          <Button
            variant={useful === true ? "primary" : "outline"}
            onClick={() => choose(true)}
            aria-pressed={useful === true}
          >
            <HugeiconsIcon icon={ThumbsUpIcon} size={16} strokeWidth={2} />
            نعم
          </Button>
          <Button
            variant={useful === false ? "primary" : "outline"}
            onClick={() => choose(false)}
            aria-pressed={useful === false}
          >
            <HugeiconsIcon icon={ThumbsDownIcon} size={16} strokeWidth={2} />
            لا
          </Button>
        </div>
      </div>

      {useful !== null ? (
        <div className="flex flex-col gap-4 border-0 border-t border-solid border-border pt-4">
          <p className="m-0 text-sm font-semibold text-foreground">
            ما الذي دفعك لهذا الاختيار؟ (اختياري)
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(useful ? reasons.yes : reasons.no).map((reason) => (
              <Checkbox
                key={reason}
                label={reason}
                checked={picked.includes(reason)}
                onCheckedChange={() => toggle(reason)}
              />
            ))}
          </div>
          <Textarea
            label="ملاحظات إضافية"
            placeholder="لا تُدرج بيانات شخصية."
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={3}
          />
          <div>
            <Button
              onClick={() => {
                setSent(true)
                onSubmit?.({ useful, reasons: picked, comment })
              }}
            >
              إرسال الملاحظات
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
