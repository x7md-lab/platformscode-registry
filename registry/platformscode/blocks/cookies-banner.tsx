"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, CookieIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/registry/platformscode/ui/button"
import { Divider } from "@/registry/platformscode/ui/divider"
import { Link } from "@/registry/platformscode/ui/link"
import { Switch } from "@/registry/platformscode/ui/switch"
import { cn } from "@/lib/utils"

export type CookieCategory = {
  key: string
  label: string
  description: string
  required?: boolean
}

const defaultCategories: CookieCategory[] = [
  {
    key: "essential",
    label: "ملفات ضرورية",
    description: "لازمة لتشغيل المنصة ولا يمكن تعطيلها.",
    required: true,
  },
  {
    key: "analytics",
    label: "ملفات تحليلية",
    description: "تساعدنا على قياس الأداء وتحسين الخدمات.",
  },
  {
    key: "marketing",
    label: "ملفات تسويقية",
    description: "تُستخدم لعرض محتوى مخصص لك.",
  },
]

export function CookiesBanner({
  title = "ملفات تعريف الارتباط",
  description = "نستخدم ملفات تعريف الارتباط لتحسين تجربتك في المنصة. يمكنك قبول الكل أو إدارة تفضيلاتك.",
  policyHref = "#",
  categories = defaultCategories,
  onDecision,
  className,
}: {
  title?: string
  description?: string
  policyHref?: string
  categories?: CookieCategory[]
  onDecision?: (result: {
    action: "accept" | "reject" | "save"
    consent: Record<string, boolean>
  }) => void
  className?: string
}) {
  const [view, setView] = useState<"banner" | "manage" | "closed">("banner")
  const [consent, setConsent] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(categories.map((c) => [c.key, Boolean(c.required)]))
  )

  function decide(action: "accept" | "reject" | "save") {
    const next =
      action === "accept"
        ? Object.fromEntries(categories.map((c) => [c.key, true]))
        : action === "reject"
          ? Object.fromEntries(categories.map((c) => [c.key, Boolean(c.required)]))
          : consent
    setConsent(next)
    setView("closed")
    onDecision?.({ action, consent: next })
  }

  if (view === "closed") return null

  return (
    <div
      role="dialog"
      aria-label={title}
      className={cn(
        "flex w-full max-w-md flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-lg",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary-accent">
            <HugeiconsIcon icon={CookieIcon} size={22} strokeWidth={2} />
          </span>
          <h3 className="m-0 text-lg font-bold text-foreground">{title}</h3>
        </div>
        <button
          type="button"
          aria-label="إغلاق"
          onClick={() => setView("closed")}
          className="flex size-8 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-border focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
        </button>
      </div>

      {view === "banner" ? (
        <p className="m-0 text-sm leading-7 text-muted-foreground">
          {description}{" "}
          <Link href={policyHref} size="sm">
            سياسة ملفات تعريف الارتباط
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {categories.map((category, index) => (
            <div key={category.key} className="flex flex-col gap-3">
              {index > 0 ? <Divider /> : null}
              <Switch
                label={category.label}
                helperText={category.description}
                checked={consent[category.key]}
                disabled={category.required}
                onCheckedChange={(checked) =>
                  setConsent((current) => ({
                    ...current,
                    [category.key]: checked,
                  }))
                }
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {view === "banner" ? (
          <>
            <Button onClick={() => decide("accept")}>قبول الكل</Button>
            <Button variant="outline" onClick={() => decide("reject")}>
              رفض غير الضروري
            </Button>
            <Button variant="subtle" onClick={() => setView("manage")}>
              إدارة التفضيلات
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => decide("save")}>حفظ التفضيلات</Button>
            <Button variant="subtle" onClick={() => setView("banner")}>
              رجوع
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
