import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export type Step = {
  title: string
  description?: string
}

/**
 * DGA step indicator with done/current/upcoming states and connectors,
 * horizontal or vertical. Renders an `<ol>` element.
 */
export function Steps({
  steps,
  activeStep = 0,
  orientation = "horizontal",
  label = "مراحل الإنجاز",
  className,
}: {
  steps: Step[]
  activeStep?: number
  orientation?: "horizontal" | "vertical"
  label?: string
  className?: string
}) {
  const vertical = orientation === "vertical"
  return (
    <ol
      aria-label={label}
      className={cn(
        "m-0 flex list-none p-0",
        vertical ? "flex-col gap-0" : "w-full items-start",
        className
      )}
    >
      {steps.map((step, index) => {
        const done = index < activeStep
        const current = index === activeStep
        const last = index === steps.length - 1
        return (
          <li
            key={step.title}
            aria-current={current ? "step" : undefined}
            className={cn(
              "flex",
              vertical ? "gap-3" : "flex-1 flex-col items-center gap-2 text-center",
              !vertical && last ? "flex-none" : undefined
            )}
          >
            <div className={cn("flex items-center", vertical ? "flex-col" : "w-full")}>
              {!vertical && index > 0 ? (
                <span
                  aria-hidden
                  className={cn(
                    "h-0.5 flex-1",
                    done || current ? "bg-primary" : "bg-border"
                  )}
                />
              ) : null}
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : current
                      ? "border-primary-accent bg-primary-light text-primary-accent"
                      : "border-border bg-card text-muted-foreground"
                )}
              >
                {done ? (
                  <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={3} />
                ) : (
                  index + 1
                )}
              </span>
              {!vertical && !last ? (
                <span
                  aria-hidden
                  className={cn("h-0.5 flex-1", done ? "bg-primary" : "bg-border")}
                />
              ) : null}
              {vertical && !last ? (
                <span
                  aria-hidden
                  className={cn(
                    "my-1 w-0.5 grow self-center",
                    done ? "bg-primary" : "bg-border"
                  )}
                />
              ) : null}
            </div>
            <div className={cn("flex flex-col gap-0.5", vertical ? "pb-6" : undefined)}>
              <span
                className={cn(
                  "text-sm font-semibold",
                  done || current ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
              {step.description ? (
                <span className="text-xs leading-5 text-muted-foreground">
                  {step.description}
                </span>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
