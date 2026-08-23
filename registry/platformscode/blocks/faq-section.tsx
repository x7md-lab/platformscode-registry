"use client"

import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/platformscode/ui/accordion"
import { Button } from "@/registry/platformscode/ui/button"
import { Card } from "@/registry/platformscode/ui/card"
import { SearchBox } from "@/registry/platformscode/ui/search-box"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export type Faq = {
  question: string
  answer: ReactNode
}

export function FaqSection({
  heading = "الأسئلة الشائعة",
  description,
  faqs,
  searchable = true,
  support,
  className,
}: {
  heading?: string
  description?: string
  faqs: Faq[]
  searchable?: boolean
  support?: { title: string; description: string; actionLabel: string; href?: string }
  className?: string
}) {
  const [query, setQuery] = useState("")
  const visible = query
    ? faqs.filter((faq) => faq.question.includes(query))
    : faqs

  return (
    <section className={cn("flex w-full flex-col gap-6", className)}>
      <div className="flex flex-col gap-2">
        <h2 className="m-0 text-2xl font-bold tracking-tight text-foreground">
          {heading}
        </h2>
        {description ? (
          <p className="m-0 max-w-2xl text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {searchable ? (
        <SearchBox
          className="max-w-md"
          placeholder="ابحث في الأسئلة"
          onSearch={setQuery}
        />
      ) : null}

      {visible.length ? (
        <Accordion multiple={false}>
          {visible.map((faq) => (
            <AccordionItem key={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="m-0 rounded-md bg-muted p-6 text-center text-sm text-muted-foreground">
          لا توجد أسئلة مطابقة لبحثك.
        </p>
      )}

      {support ? (
        <Card className="flex flex-col items-start gap-3 bg-primary-light p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="m-0 text-base font-bold text-foreground">
              {support.title}
            </h3>
            <p className="m-0 text-sm text-muted-foreground">
              {support.description}
            </p>
          </div>
          <Button
            onClick={() => {
              if (support.href) window.location.assign(support.href)
            }}
          >
            {support.actionLabel}
          </Button>
        </Card>
      ) : null}
    </section>
  )
}
