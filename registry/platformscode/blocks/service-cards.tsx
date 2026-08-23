"use client"

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { Badge } from "@/registry/platformscode/ui/badge"
import { Card } from "@/registry/platformscode/ui/card"
import { cn } from "@/lib/utils"

export type ServiceCard = {
  title: string
  description: string
  href?: string
  icon?: IconSvgElement
  badge?: string
}

export function ServiceCards({
  heading,
  description,
  services,
  columns = 3,
  className,
}: {
  heading?: string
  description?: string
  services: ServiceCard[]
  columns?: 2 | 3
  className?: string
}) {
  return (
    <section className={cn("flex w-full flex-col gap-6", className)}>
      {heading || description ? (
        <div className="flex flex-col gap-2">
          {heading ? (
            <h2 className="m-0 text-2xl font-bold tracking-tight text-foreground">
              {heading}
            </h2>
          ) : null}
          {description ? (
            <p className="m-0 max-w-2xl text-sm leading-7 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2",
          columns === 3 ? "lg:grid-cols-3" : undefined
        )}
      >
        {services.map((service) => (
          <Card
            key={service.title}
            selectable
            className="group flex flex-col gap-3 p-6"
            onClick={() => {
              if (service.href) window.location.assign(service.href)
            }}
          >
            <div className="flex items-start justify-between gap-3">
              {service.icon ? (
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary transition-colors group-hover:bg-primary-soft">
                  <HugeiconsIcon icon={service.icon} size={22} strokeWidth={2} />
                </span>
              ) : null}
              {service.badge ? (
                <Badge variant="success">{service.badge}</Badge>
              ) : null}
            </div>
            <h3 className="m-0 text-base font-bold text-foreground">
              {service.title}
            </h3>
            <p className="m-0 grow text-sm leading-6 text-muted-foreground">
              {service.description}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              ابدأ الخدمة
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={16}
                strokeWidth={2}
                className="transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1"
              />
            </span>
          </Card>
        ))}
      </div>
    </section>
  )
}
