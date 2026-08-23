import { cn } from "@/lib/utils"

export type SitemapLink = {
  label: string
  href: string
  children?: SitemapLink[]
}

function Tree({ links, depth }: { links: SitemapLink[]; depth: number }) {
  return (
    <ul
      className={cn(
        "m-0 flex flex-col gap-4 p-0 text-primary",
        depth === 0 ? "list-disc" : "ms-4 list-[circle]",
        "list-inside"
      )}
    >
      {links.map((link) => (
        <li key={link.label + link.href}>
          <a
            href={link.href}
            className="rounded-sm text-base font-normal text-foreground no-underline underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
          >
            {link.label}
          </a>
          {link.children?.length ? (
            <Tree links={link.children} depth={depth + 1} />
          ) : null}
        </li>
      ))}
    </ul>
  )
}

/**
 * DGA «صفحة خريطة الموقع» — brand-bulleted nested link tree under a 30/700 heading.
 */
export function SitemapSection({
  heading = "خريطة الموقع",
  groups,
  className,
}: {
  heading?: string
  groups: SitemapLink[]
  className?: string
}) {
  return (
    <section className={cn("flex w-full flex-col gap-6", className)}>
      <h1 className="m-0 text-3xl font-bold leading-10 text-foreground">
        {heading}
      </h1>
      <Tree links={groups} depth={0} />
    </section>
  )
}
