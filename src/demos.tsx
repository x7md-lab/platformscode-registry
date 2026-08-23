import { useState } from "react"
import { Button } from "@/registry/platformscode/ui/button"
import { InlineAlert } from "@/registry/platformscode/ui/inline-alert"
import { Rating } from "@/registry/platformscode/ui/rating"

export function RatingDemo() {
  const [value, setValue] = useState(4)
  return (
    <div className="flex flex-col items-center gap-3">
      <Rating value={value} onChange={setValue} size="large" />
      <span className="text-xs text-muted-foreground">
        التقييم الحالي: {value} من 5
      </span>
      <Rating value={3} max={5} readOnly size="small" />
    </div>
  )
}

export function InlineAlertDemo() {
  const [dismissed, setDismissed] = useState(false)
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <InlineAlert
        tone="success"
        leadText="تم إرسال طلبك"
        helperText="سيصلك إشعار عند تغيّر حالة المعاملة."
      />
      <InlineAlert
        tone="warning"
        leadText="المرفقات ناقصة"
        helperText="يلزم إرفاق صورة الهوية قبل إتمام الطلب."
        actions={
          <Button size="md" variant="subtle">
            إرفاق الآن
          </Button>
        }
      />
      {dismissed ? (
        <Button variant="outline" onClick={() => setDismissed(false)}>
          إظهار الإشعار مرة أخرى
        </Button>
      ) : (
        <InlineAlert
          tone="error"
          leadText="تعذّر التحقق من الرقم"
          helperText="تحقق من رقم الطلب ثم أعد المحاولة."
          onClose={() => setDismissed(true)}
        />
      )}
      <InlineAlert
        tone="info"
        colored={false}
        leadText="إشعار بلا تلوين"
        helperText="نفس المكوّن مع خاصية colored={false}."
      />
    </div>
  )
}
