import { useState } from "react"
import { Settings01Icon } from "@hugeicons/core-free-icons"
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

/**
 * Floating action that opens a side sheet with the preview options.
 * Both options default to on, so previews stay contained and padded.
 */
export function PreviewSettings() {
  const [open, setOpen] = useState(false)
  const { contained, padded } = usePreviewPrefs()

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
