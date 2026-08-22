import { lazy, Suspense, useState, type ReactNode } from "react"
import {
  CalendarCheck01Icon,
  CustomerService01Icon,
  FileVerifiedIcon,
  Home01Icon,
  SecurityCheckIcon,
  Settings01Icon,
  ShieldBanIcon,
} from "@hugeicons/core-free-icons"
const CodeView = lazy(() => import("./code-view"))
import { Button } from "@/registry/platformscode/ui/button"
import { Badge } from "@/registry/platformscode/ui/badge"
import { Card } from "@/registry/platformscode/ui/card"
import { Skeleton } from "@/registry/platformscode/ui/skeleton"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/platformscode/ui/accordion"
import { DigitalStamp } from "@/registry/platformscode/ui/digital-stamp"
import { DocDialog } from "@/registry/platformscode/ui/doc-dialog"
import {
  NavigationHeader,
  NavigationHeaderBrand,
} from "@/registry/platformscode/ui/navigation-header"
import buttonSource from "@/registry/platformscode/ui/button.tsx?raw"
import badgeSource from "@/registry/platformscode/ui/badge.tsx?raw"
import cardSource from "@/registry/platformscode/ui/card.tsx?raw"
import accordionSource from "@/registry/platformscode/ui/accordion.tsx?raw"
import digitalStampSource from "@/registry/platformscode/ui/digital-stamp.tsx?raw"
import docDialogSource from "@/registry/platformscode/ui/doc-dialog.tsx?raw"
import navigationHeaderSource from "@/registry/platformscode/ui/navigation-header.tsx?raw"

const samplePage = {
  src:
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1035"><rect width="800" height="1035" fill="#ffffff"/><rect x="60" y="60" width="680" height="40" rx="4" fill="#f3f4f6"/><rect x="60" y="140" width="680" height="16" rx="4" fill="#e5e7eb"/><rect x="60" y="180" width="620" height="16" rx="4" fill="#e5e7eb"/><rect x="60" y="220" width="650" height="16" rx="4" fill="#e5e7eb"/><rect x="60" y="920" width="200" height="60" rx="4" fill="#f3fcf6" stroke="#1b8354"/></svg>`
    ),
  width: 800,
  height: 1035,
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

function cnSwitch(active: boolean) {
  return [
    "cursor-pointer rounded-sm border-0 px-3 py-1 text-xs font-semibold transition-colors",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
    active
      ? "bg-card text-foreground shadow-sm"
      : "bg-transparent text-muted-foreground hover:text-foreground",
  ].join(" ")
}

function Section({
  title,
  name,
  code,
  children,
}: {
  title: string
  name: string
  code: string
  children: ReactNode
}) {
  const [view, setView] = useState<"preview" | "code">("preview")
  return (
    <div className="relative flex min-h-[300px] flex-col gap-4 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="m-0 text-sm font-normal text-muted-foreground sm:ps-3">
            {title}
          </h2>
          <ViewSwitcher view={view} onChange={setView} />
        </div>
        {view === "preview" ? (
          <div className="relative flex min-h-[220px] flex-1 items-center justify-center p-4">
            {children}
          </div>
        ) : (
          <div dir="ltr" className="overflow-hidden rounded-md border border-border text-start">
            <div className="border-b border-border bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">
              {name}.tsx
            </div>
            <Suspense fallback={<Skeleton className="h-40 w-full rounded-none" />}>
              <CodeView code={code} />
            </Suspense>
          </div>
        )}
      </div>
  )
}

export default function App() {
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 px-4 py-8 lg:max-w-5xl xl:max-w-6xl">
      <header className="flex flex-col gap-1">
        <h1 className="m-0 text-3xl font-bold tracking-tight">كود المنصات</h1>
        <p className="m-0 text-muted-foreground">
          سجل مخصص لتوزيع مكونات بلغة تصميم «كود المنصات» — مبنية فوق Base UI
          و‏framer-motion، بلا أي إطار عمل سوى React.
        </p>
      </header>
      <main className="flex flex-1 flex-col gap-8">
        <Section
          title="شريط التنقل العلوي — شعار، روابط بقوائم منسدلة، وإجراء رئيسي"
          name="navigation-header"
          code={navigationHeaderSource}
        >
          <div className="flex w-full flex-col gap-6 self-start">
          <div className="w-full overflow-x-auto rounded-md border border-border">
            <NavigationHeader
              logo={
                <NavigationHeaderBrand
                  href="#"
                  mark={
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-lg font-black text-primary-foreground">
                      م
                    </span>
                  }
                  title="شعار المنصة"
                  subtitle="platformscode.sa"
                />
              }
              items={[
                {
                  label: "الرئيسية",
                  selected: true,
                  menu: [
                    {
                      label: "نظرة عامة",
                      href: "#",
                      icon: Home01Icon,
                      helper: "ملخص لوحة المعلومات والإحصاءات",
                    },
                    {
                      label: "الإعدادات",
                      href: "#",
                      icon: Settings01Icon,
                    },
                  ],
                },
                {
                  label: "الخدمات",
                  menu: [
                    {
                      label: "الاستعلام عن معاملة",
                      href: "#",
                      icon: FileVerifiedIcon,
                      helper: "تتبع حالة معاملتك برقم الطلب",
                      badge: <Badge variant="success">جديد</Badge>,
                    },
                    {
                      label: "الدعم الفني",
                      href: "#",
                      icon: CustomerService01Icon,
                    },
                  ],
                },
                { label: "تسجيل", href: "#" },
              ]}
              actions={<Button>تسجيل الدخول</Button>}
            />
            <div className="bg-background p-6 text-center text-xs text-muted-foreground">
              محتوى الصفحة — المتغير الجوّال غير مفروض؛ فعّله عبر خاصية{" "}
              <code dir="ltr">mobile</code> متى شئت.
            </div>
          </div>
          <div className="mx-auto w-[390px] max-w-full overflow-hidden rounded-md border border-border">
            <NavigationHeader
              mobile
              logo={
                <NavigationHeaderBrand
                  href="#"
                  mark={
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-lg font-black text-primary-foreground">
                      م
                    </span>
                  }
                  title="شعار المنصة"
                />
              }
              items={[
                { label: "الرئيسية", href: "#", selected: true },
                { label: "الخدمات", href: "#" },
                { label: "تسجيل", href: "#" },
              ]}
              actions={<Button className="w-full">تسجيل الدخول</Button>}
            />
            <div className="bg-background p-4 text-center text-xs text-muted-foreground">
              المتغير الجوّال (mobile) — زر القائمة يفتح درجًا سفليًا.
            </div>
          </div>
          </div>
        </Section>

        <Section title="زر DGA — الأنماط الأربعة والمقاسان" name="button" code={buttonSource}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button>أساسي</Button>
            <Button variant="outline">محدد</Button>
            <Button variant="subtle">خفيف</Button>
            <Button variant="danger">خطر</Button>
            <Button size="lg">مقاس كبير</Button>
            <Button disabled>معطل</Button>
          </div>
        </Section>

        <Section title="علامات تفاعلية (Badges)" name="badge" code={badgeSource}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge>افتراضي</Badge>
            <Badge variant="outline">محدد</Badge>
            <Badge variant="success">تم التحقق</Badge>
            <Badge variant="destructive">مرفوض</Badge>
          </div>
        </Section>

        <Section title="بطاقة وهيكل تحميل" name="card" code={cardSource}>
          <Card className="flex w-full max-w-sm flex-col gap-3 p-6">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="pt-2">
              <Badge variant="success">بطاقة DGA — نصف قطر 16px</Badge>
            </div>
          </Card>
        </Section>

        <Section
          title="أكورديون فوق Base UI بحركة framer-motion"
          name="accordion"
          code={accordionSource}
        >
          <Accordion className="max-w-xl" multiple={false}>
            <AccordionItem>
              <AccordionTrigger>ما هو هذا السجل؟</AccordionTrigger>
              <AccordionContent>
                سجل shadcn مخصص يعيد تنفيذ لغة تصميم «كود المنصات» كمكونات React
                فوق Base UI، مع حركات framer-motion للدخول والكشف.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionTrigger>كيف أثبّت مكونًا؟</AccordionTrigger>
              <AccordionContent>
                عبر أمر <code dir="ltr">shadcn add</code> مع رابط ملف JSON الخاص
                بالمكون من هذا السجل.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionTrigger>هل يلزم Next.js؟</AccordionTrigger>
              <AccordionContent>
                لا — المكونات كلها مكونات عميل خالصة تعمل مع React 19 في أي بيئة
                (Vite هنا).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        <Section
          title="الختم الرقمي — محاكاة DgaDigitalSignature"
          name="digital-stamp"
          code={digitalStampSource}
        >
          <DigitalStamp
            className="w-full max-w-xl"
            heading="هذه الصفحة موثقة بختم رقمي"
            items={[
              {
                icon: SecurityCheckIcon,
                title: "مصدر موثوق",
                description: "تم التحقق من مصدر المستند وسلسلة توقيعه.",
              },
              {
                icon: CalendarCheck01Icon,
                title: "تاريخ صالح",
                description: "الختم صادر ضمن فترة الصلاحية.",
              },
              {
                icon: FileVerifiedIcon,
                title: "محتوى سليم",
                description: "لم يطرأ أي تعديل على المستند بعد الختم.",
              },
              {
                icon: ShieldBanIcon,
                title: "مثال لحالة فشل",
                description: "هكذا يظهر عنصر تحقق غير مجتاز.",
                ok: false,
              },
            ]}
          />
        </Section>

        <Section
          title="عارض مستندات: نافذة على الشاشات الواسعة ودرج سفلي على الجوال"
          name="doc-dialog"
          code={docDialogSource}
        >
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            يمكن الاطلاع على{" "}
            <DocDialog
              label="نموذج المستند التجريبي"
              title="مستند تجريبي"
              pages={[samplePage]}
            />{" "}
            لمعاينة السلوك: جرّب تضييق النافذة دون 640px ليتحول العارض إلى درج
            قابل للسحب.
          </p>
        </Section>
      </main>
      <footer className="pb-4 text-center text-xs text-muted-foreground">
        لغة تصميم «كود المنصات» مستخرجة كرموز فقط — هذا السجل تم بواسطة مساهم
        مجتمعي <span dir="ltr">X7md</span>.
      </footer>
    </div>
  )
}
