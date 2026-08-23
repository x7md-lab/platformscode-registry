"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/registry/platformscode/ui/button"
import { Checkbox } from "@/registry/platformscode/ui/checkbox"
import { InlineAlert } from "@/registry/platformscode/ui/inline-alert"
import { Select } from "@/registry/platformscode/ui/select"
import { TextInput } from "@/registry/platformscode/ui/text-input"
import { Textarea } from "@/registry/platformscode/ui/textarea"
import { cn } from "@/lib/utils"

export type ContactTopic = { label: string; value: string }

export type ContactValues = {
  name: string
  email: string
  phone: string
  topic: string
  message: string
}

export function ContactForm({
  heading = "تواصل معنا",
  description = "أرسل استفسارك وسيصلك الرد خلال ثلاثة أيام عمل.",
  topics,
  onSubmit,
  className,
}: {
  heading?: string
  description?: string
  topics: ContactTopic[]
  onSubmit?: (values: ContactValues) => void
  className?: string
}) {
  const [values, setValues] = useState<ContactValues>({
    name: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  })
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactValues, string>>>({})
  const [sent, setSent] = useState(false)

  function set<K extends keyof ContactValues>(key: K, value: ContactValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const next: Partial<Record<keyof ContactValues, string>> = {}
    if (!values.name.trim()) next.name = "الاسم مطلوب."
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
      next.email = "صيغة البريد غير صحيحة."
    if (values.phone && !/^\d[\d\s]{7,}$/.test(values.phone.trim()))
      next.phone = "أدخل رقم جوال صحيح (أرقام فقط)."
    if (!values.topic) next.topic = "اختر موضوع الرسالة."
    if (values.message.trim().length < 10)
      next.message = "اكتب رسالة لا تقل عن ١٠ أحرف."
    setErrors(next)
    if (Object.keys(next).length || !agreed) return
    setSent(true)
    onSubmit?.(values)
  }

  if (sent) {
    return (
      <div className={cn("w-full", className)}>
        <InlineAlert
          tone="success"
          leadText="تم استلام رسالتك"
          helperText="سيصلك رد على البريد الإلكتروني المسجّل خلال ثلاثة أيام عمل."
          actions={
            <Button variant="subtle" onClick={() => setSent(false)}>
              إرسال رسالة أخرى
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className={cn("flex w-full flex-col gap-6", className)}
    >
      <div className="flex flex-col gap-2">
        <h2 className="m-0 text-2xl font-bold tracking-tight text-foreground">
          {heading}
        </h2>
        <p className="m-0 text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="الاسم الكامل"
          size="lg"
          required
          autoComplete="name"
          placeholder="مثال: محمد بن عبدالله"
          value={values.name}
          onChange={(event) => set("name", event.target.value)}
          alertText={errors.name}
        />
        <TextInput
          label="البريد الإلكتروني"
          size="lg"
          required
          type="email"
          inputMode="email"
          autoComplete="email"
          dir="ltr"
          placeholder="name@example.com"
          value={values.email}
          onChange={(event) => set("email", event.target.value)}
          alertText={errors.email}
        />
        <TextInput
          label="رقم الجوال"
          size="lg"
          required
          dir="ltr"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          prefix="+966"
          placeholder="5X XXX XXXX"
          value={values.phone}
          onChange={(event) => set("phone", event.target.value)}
          alertText={errors.phone}
        />
        <Select
          label="موضوع الرسالة"
          size="lg"
          required
          placeholder="اختر الموضوع"
          options={topics}
          value={values.topic || null}
          onValueChange={(value) => set("topic", String(value ?? ""))}
          alertText={errors.topic}
        />
      </div>

      <Textarea
        label="نص الرسالة"
        required
        placeholder="اكتب تفاصيل استفسارك…"
        value={values.message}
        onChange={(event) => set("message", event.target.value)}
        alertText={errors.message}
      />

      <Checkbox
        label="أوافق على سياسة الخصوصية ومعالجة بياناتي"
        checked={agreed}
        onCheckedChange={setAgreed}
      />

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={!agreed}>
          إرسال
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => {
            setValues({
              name: "",
              email: "",
              phone: "",
              topic: "",
              message: "",
            })
            setErrors({})
          }}
        >
          مسح الحقول
        </Button>
      </div>
    </form>
  )
}
