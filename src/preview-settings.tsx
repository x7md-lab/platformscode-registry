import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Settings01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/registry/platformscode/ui/drawer"
import { FloatingButton } from "@/registry/platformscode/ui/floating-button"
import { Switch } from "@/registry/platformscode/ui/switch"
import { Divider } from "@/registry/platformscode/ui/divider"
import { previewPrefs, usePreviewPrefs } from "./preview-prefs"
import { BRANDS, type BrandKey } from "./brand"

function BrandPicker({ value }: { value: BrandKey }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-foreground">لوحة الألوان</span>
      <span className="text-xs text-muted-foreground">
        الألوان الأساسية والثانوية من نظام ألوان «كود المنصات».
      </span>
      <div
        role="radiogroup"
        aria-label="لوحة الألوان"
        className="mt-1 flex items-center gap-3"
      >
        {(Object.keys(BRANDS) as BrandKey[]).map((key) => {
          const brand = BRANDS[key]
          const active = value === key
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={brand.label}
              onClick={() => previewPrefs.set({ brand: key })}
              className="flex cursor-pointer flex-col items-center gap-1 rounded-sm border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
            >
              <span
                style={{ backgroundColor: brand.swatch }}
                className={`flex size-9 items-center justify-center rounded-full text-white transition-[box-shadow,transform] ${
                  active
                    ? "scale-105 shadow-[0_0_0_2px_var(--color-card),0_0_0_4px_currentColor]"
                    : "hover:scale-105"
                }`}
              >
                {active ? (
                  <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={3} />
                ) : null}
              </span>
              <span
                className={`text-[11px] ${active ? "font-semibold text-foreground" : "text-muted-foreground"}`}
              >
                {brand.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Floating action that opens a side sheet with the preview options.
 * Both options default to on, so previews stay contained and padded.
 */
export function PreviewSettings() {
  const [open, setOpen] = useState(false)
  const { contained, padded, brand } = usePreviewPrefs()

  return (
    <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
      <DrawerTrigger
        render={
          <FloatingButton
            floating
            corner="start"
            iconOnly
            icon={Settings01Icon}
            label="إعدادات المعاينة"
          />
        }
      />
      <DrawerContent>
        <DrawerHeader className="text-start">
          <DrawerTitle>إعدادات المعاينة</DrawerTitle>
          <DrawerDescription>
            تتحكم في طريقة عرض أمثلة المكونات على هذه الصفحة.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 p-4">
          <BrandPicker value={brand} />
          <Divider />
          <Switch
            label="احتواء المعاينة"
            helperText="على الجوال: أبقِ المثال داخل البطاقة بدل عرضه بعرض الشاشة."
            checked={contained}
            onCheckedChange={(value) => previewPrefs.set({ contained: value })}
          />
          <Divider />
          <Switch
            label="حشو المعاينة"
            helperText="مسافة داخلية حول المثال."
            checked={padded}
            onCheckedChange={(value) => previewPrefs.set({ padded: value })}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
