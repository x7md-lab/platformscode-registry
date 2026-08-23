"use client"

import {
  NavigationHeader,
  NavigationHeaderBrand,
  type NavItem,
} from "@/registry/platformscode/ui/navigation-header"
import {
  Footer,
  type FooterGroup,
  type FooterLink,
} from "@/registry/platformscode/ui/footer"
import { Breadcrumbs, type Crumb } from "@/registry/platformscode/ui/breadcrumbs"
import { useMediaQuery } from "@/registry/platformscode/hooks/use-media-query"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

const SHELL_MOBILE_QUERY = "(max-width: 1023px)"

export function PageShell({
  brand,
  items,
  actions,
  crumbs,
  footerGroups,
  footerActions,
  footerExtraActions,
  copyright,
  mobile,
  mobileQuery = SHELL_MOBILE_QUERY,
  className,
  children,
}: {
  brand: { title: string; subtitle?: string; mark: ReactNode; href?: string }
  items: NavItem[]
  actions?: ReactNode
  crumbs?: Crumb[]
  footerGroups?: FooterGroup[]
  footerActions?: FooterLink[]
  footerExtraActions?: FooterLink[]
  copyright?: string
  /** Force the drawer nav on or off. Left undefined, the shell follows `mobileQuery`. */
  mobile?: boolean
  mobileQuery?: string
  className?: string
  children: ReactNode
}) {
  const isNarrow = useMediaQuery(mobileQuery)
  const useDrawerNav = mobile ?? isNarrow

  return (
    <div className={cn("flex min-h-svh flex-col bg-background", className)}>
      <NavigationHeader
        sticky
        mobile={useDrawerNav}
        logo={
          <NavigationHeaderBrand
            href={brand.href ?? "#"}
            mark={brand.mark}
            title={brand.title}
            subtitle={brand.subtitle}
          />
        }
        items={items}
        actions={
          actions ? (
            <div className={useDrawerNav ? "w-full [&>*]:w-full" : undefined}>
              {actions}
            </div>
          ) : undefined
        }
      />
      <main id="main" className="grow">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-5 lg:max-w-5xl lg:py-8">
          {crumbs?.length ? (
            <Breadcrumbs className="mb-4 lg:mb-6" items={crumbs} />
          ) : null}
          {children}
        </div>
      </main>
      <Footer
        groups={footerGroups}
        actions={footerActions}
        extraActions={footerExtraActions}
        copyright={copyright}
        logo={brand.mark}
      />
    </div>
  )
}
