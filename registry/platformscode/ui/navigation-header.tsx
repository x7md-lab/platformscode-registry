"use client"

import { Menu } from "@base-ui/react/menu"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { ArrowDown01Icon, Menu01Icon } from "@hugeicons/core-free-icons"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/platformscode/ui/drawer"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export type NavMenuEntry = {
  label: ReactNode
  href?: string
  onClick?: () => void

  icon?: IconSvgElement

  helper?: ReactNode

  badge?: ReactNode
}

export type NavItem = {
  label: ReactNode
  href?: string
  onClick?: () => void

  selected?: boolean
  disabled?: boolean

  menu?: NavMenuEntry[]
}

function navItemClass(selected?: boolean, disabled?: boolean) {
  return cn(
    "relative inline-flex h-full items-center gap-1 rounded-[2px] border-0 bg-transparent px-4 text-base font-medium no-underline transition-colors lg:px-6",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
    "after:absolute after:inset-x-2 after:bottom-0 after:h-2 after:rounded-full after:transition-opacity",
    disabled
      ? "cursor-not-allowed text-muted-foreground after:hidden"
      : selected
        ? cn(
            "cursor-pointer bg-primary font-semibold text-primary-foreground hover:bg-primary-hover active:bg-primary-hover",
            "after:bg-primary-bright after:opacity-100"
          )
        : cn(
            "cursor-pointer text-foreground hover:bg-muted active:bg-border",
            "after:bg-input after:opacity-0 hover:after:opacity-100 data-[popup-open]:after:opacity-100",
            "active:after:bg-foreground active:after:opacity-100"
          )
  )
}

function EntryContent({ entry }: { entry: NavMenuEntry }) {
  return (
    <>
      {entry.icon && (
        <span
          className="flex shrink-0 items-center justify-center rounded-md bg-primary-light p-3 text-primary"
          aria-hidden
        >
          <HugeiconsIcon icon={entry.icon} className="size-5" />
        </span>
      )}
      <span className="flex min-w-0 grow flex-col gap-0.5">
        <span className="entry-label text-base font-semibold text-foreground">
          {entry.label}
        </span>
        {entry.helper && (
          <span className="text-sm leading-5 text-muted-foreground">
            {entry.helper}
          </span>
        )}
      </span>
      {entry.badge && <span className="ms-auto shrink-0">{entry.badge}</span>}
    </>
  )
}

const ENTRY_CLASS =
  "flex w-full min-w-[300px] cursor-pointer items-center gap-4 rounded-md border-0 bg-transparent px-4 py-2 text-start no-underline outline-none data-[highlighted]:bg-muted data-[highlighted]:[&_.entry-label]:underline active:bg-border"

function DesktopItem({ item }: { item: NavItem }) {
  if (item.menu?.length) {
    return (
      <Menu.Root>
        <Menu.Trigger
          className={navItemClass(item.selected, item.disabled)}
          disabled={item.disabled}
        >
          {item.label}
          <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 shrink-0" aria-hidden />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={8} align="start">
            <Menu.Popup className="z-50 rounded-md border border-border bg-card p-2 shadow-lg outline-none">
              {item.menu.map((entry, i) =>
                entry.href ? (
                  <Menu.LinkItem key={i} href={entry.href} className={ENTRY_CLASS}>
                    <EntryContent entry={entry} />
                  </Menu.LinkItem>
                ) : (
                  <Menu.Item key={i} onClick={entry.onClick} className={ENTRY_CLASS}>
                    <EntryContent entry={entry} />
                  </Menu.Item>
                )
              )}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    )
  }

  const className = navItemClass(item.selected, item.disabled)
  if (item.href && !item.disabled) {
    return (
      <a
        href={item.href}
        aria-current={item.selected ? "page" : undefined}
        className={className}
      >
        {item.label}
      </a>
    )
  }
  return (
    <button
      type="button"
      onClick={item.onClick}
      disabled={item.disabled}
      aria-current={item.selected ? "page" : undefined}
      className={className}
    >
      {item.label}
    </button>
  )
}

function DrawerItem({ item }: { item: NavItem }) {
  const rowClass = cn(
    "flex w-full items-center gap-3 rounded-sm px-4 py-3 text-start text-sm font-semibold no-underline",
    item.disabled
      ? "cursor-not-allowed text-muted-foreground"
      : item.selected
        ? "bg-primary-light text-primary"
        : "text-foreground active:bg-muted"
  )

  if (item.menu?.length) {
    return (
      <div className="flex flex-col">
        <span className={cn(rowClass, "text-muted-foreground")}>{item.label}</span>
        {item.menu.map((entry, i) => {
          const content = <EntryContent entry={entry} />
          return entry.href ? (
            <a key={i} href={entry.href} className={cn(ENTRY_CLASS, "ps-8")}>
              {content}
            </a>
          ) : (
            <button
              key={i}
              type="button"
              onClick={entry.onClick}
              className={cn(ENTRY_CLASS, "ps-8")}
            >
              {content}
            </button>
          )
        })}
      </div>
    )
  }

  if (item.href && !item.disabled) {
    return (
      <a
        href={item.href}
        aria-current={item.selected ? "page" : undefined}
        className={rowClass}
      >
        {item.label}
      </a>
    )
  }
  return (
    <button
      type="button"
      onClick={item.onClick}
      disabled={item.disabled}
      aria-current={item.selected ? "page" : undefined}
      className={rowClass}
    >
      {item.label}
    </button>
  )
}

/**
 * Brand slot for the header: logo mark, divider and a two-line title.
 * Renders an `<a>` element when `href` is set, otherwise a `<span>`.
 */
export function NavigationHeaderBrand({
  mark,
  title,
  subtitle,
  href,
}: {
  /** Logo mark element (image or monogram). */
  mark: ReactNode
  /** Entity name, bold line. */
  title: ReactNode
  /** Muted second line (e.g. the domain). */
  subtitle?: ReactNode
  /** Makes the brand a link to this URL. */
  href?: string
}) {
  const content = (
    <span className="flex min-w-0 items-center">
      {mark}
      {(title || subtitle) && (
        <span
          className="mx-2 h-12 w-px shrink-0 bg-black/20 sm:mx-4"
          aria-hidden
        />
      )}
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-bold text-foreground">
          {title}
        </span>
        {subtitle && (
          <span
            className="truncate font-mono text-xs text-muted-foreground"
            dir="ltr"
          >
            {subtitle}
          </span>
        )}
      </span>
    </span>
  )
  return href ? (
    <a href={href} className="min-w-0 no-underline">
      {content}
    </a>
  ) : (
    content
  )
}

/**
 * DGA top navigation bar: brand, nav items with dropdown menus and the
 * official hover pill, primary actions and a skip link. The mobile variant
 * moves the items into a bottom drawer. Renders a `<header>` element.
 *
 * Documentation: [كود المنصات](https://x7md-lab.github.io/platformscode-registry/)
 */
export function NavigationHeader({
  logo,
  items,
  actions,
  mobile = false,
  sticky = false,
  skipHref = "#main",
  skipLabel = "تخطي إلى المحتوى",
  navLabel = "التنقل الرئيسي",
  drawerTitle = "القائمة",
  className,
}: {
  /** Brand slot, usually a `NavigationHeaderBrand`. */
  logo: ReactNode
  /** Navigation items; entries with `menu` open a dropdown. */
  items: NavItem[]
  /** End-side actions (e.g. a login button). */
  actions?: ReactNode
  /** Switches to the hamburger + bottom drawer variant. */
  mobile?: boolean
  /** Sticks the bar to the top of the viewport. */
  sticky?: boolean
  /** Target of the skip-to-content link. */
  skipHref?: string
  /** Label of the skip-to-content link. */
  skipLabel?: ReactNode
  /** Accessible name of the navigation landmark. */
  navLabel?: string
  /** Title shown at the top of the mobile drawer. */
  drawerTitle?: ReactNode
  className?: string
}) {
  const skipLink = (
    <a
      href={skipHref}
      className="sr-only rounded-sm bg-primary text-sm font-semibold text-primary-foreground focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-50 focus:px-3 focus:py-2"
    >
      {skipLabel}
    </a>
  )

  const barClass = cn(
    "relative z-40 h-[72px] w-full bg-card after:absolute after:inset-x-0 after:bottom-0 after:block after:h-px after:w-full after:bg-border",
    sticky && "sticky top-0",
    className
  )

  if (mobile) {
    return (
      <header role="banner" className={barClass}>
        {skipLink}
        <div className="relative mx-auto flex h-full w-full max-w-3xl items-center gap-3 px-5">
        <Drawer showSwipeHandle>
          <DrawerTrigger
            aria-label={navLabel}
            className="flex size-9 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-foreground active:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
          >
            <HugeiconsIcon icon={Menu01Icon} className="size-5" aria-hidden />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="pb-2">
              <DrawerTitle>{drawerTitle}</DrawerTitle>
            </DrawerHeader>
            <nav
              aria-label={navLabel}
              className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-4 pt-2"
            >
              {items.map((item, i) => (
                <DrawerItem key={i} item={item} />
              ))}
            </nav>
            {actions && (
              <div className="flex shrink-0 flex-col gap-2 border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {actions}
              </div>
            )}
          </DrawerContent>
        </Drawer>
          {}
          <div className="flex min-w-0 items-center">{logo}</div>
        </div>
      </header>
    )
  }

  return (
    <header role="banner" className={barClass}>
      {skipLink}
      <nav
        aria-label={navLabel}
        className="mx-auto flex h-full w-full max-w-3xl items-center justify-between gap-4 px-5 lg:max-w-5xl"
      >
        <div className="flex shrink-0 items-center">{logo}</div>
        <ul className="m-0 flex h-full grow list-none items-center p-0">
          {items.map((item, i) => (
            <li key={i} className="h-full">
              <DesktopItem item={item} />
            </li>
          ))}
        </ul>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </nav>
    </header>
  )
}
