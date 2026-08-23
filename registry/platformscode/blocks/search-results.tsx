"use client"

import { useMemo, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { SortByDown02Icon, SortByUp02Icon } from "@hugeicons/core-free-icons"
import { Badge } from "@/registry/platformscode/ui/badge"
import { Button } from "@/registry/platformscode/ui/button"
import { Divider } from "@/registry/platformscode/ui/divider"
import { Link } from "@/registry/platformscode/ui/link"
import { Pagination } from "@/registry/platformscode/ui/pagination"
import { SearchBox } from "@/registry/platformscode/ui/search-box"
import { cn } from "@/lib/utils"

export type SearchResult = {
  title: string
  description: string
  href?: string
  tags?: string[]
  date?: string
}

/**
 * DGA «صفحة البحث» — search box, result count, sort toggle, tag-labelled
 * results separated by dividers, centered pagination.
 */
export function SearchResults({
  heading = "نتائج البحث",
  foundLabel = "نتيجة",
  searchPlaceholder = "ابحث",
  searchButtonLabel = "بحث",
  sortLabel = "الترتيب حسب التاريخ",
  results,
  pageSize = 5,
  onSearch,
  className,
}: {
  heading?: string
  foundLabel?: string
  searchPlaceholder?: string
  searchButtonLabel?: string
  sortLabel?: string
  results: SearchResult[]
  pageSize?: number
  onSearch?: (query: string) => void
  className?: string
}) {
  const [query, setQuery] = useState("")
  const [ascending, setAscending] = useState(false)
  const [page, setPage] = useState(1)

  const visible = useMemo(() => {
    let list = query
      ? results.filter(
          (item) =>
            item.title.includes(query) || item.description.includes(query)
        )
      : [...results]
    list = list.sort((a, b) =>
      ascending
        ? (a.date ?? "").localeCompare(b.date ?? "")
        : (b.date ?? "").localeCompare(a.date ?? "")
    )
    return list
  }, [results, query, ascending])

  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize))
  const pageItems = visible.slice((page - 1) * pageSize, page * pageSize)

  return (
    <section className={cn("flex w-full flex-col", className)}>
      <SearchBox
        size="lg"
        placeholder={searchPlaceholder}
        buttonLabel={searchButtonLabel}
        onSearch={(value) => {
          setQuery(value)
          setPage(1)
          onSearch?.(value)
        }}
      />

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="m-0 text-3xl font-bold leading-10 text-foreground">
            {heading}
          </h1>
          <p className="m-0 text-base text-muted-foreground">
            {visible.length} {foundLabel}
          </p>
        </div>
        <Button variant="outline" onClick={() => setAscending((v) => !v)}>
          {sortLabel}
          <HugeiconsIcon
            icon={ascending ? SortByUp02Icon : SortByDown02Icon}
            size={18}
            strokeWidth={2}
          />
        </Button>
      </div>

      <div className="mt-8 flex flex-col">
        {pageItems.map((item, index) => (
          <article key={item.title} className="flex flex-col gap-2">
            {item.tags?.length ? (
              <div className="flex flex-wrap items-center gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            ) : null}
            <Link href={item.href ?? "#"} className="self-start">
              {item.title}
            </Link>
            <p className="m-0 text-sm leading-5 text-foreground">
              {item.description}
            </p>
            {item.date ? (
              <p className="m-0 text-xs text-muted-foreground">{item.date}</p>
            ) : null}
            {index !== pageItems.length - 1 ? <Divider className="my-8" /> : null}
          </article>
        ))}
        {!pageItems.length ? (
          <p className="m-0 rounded-md bg-muted p-6 text-center text-sm text-muted-foreground">
            لا توجد نتائج مطابقة لبحثك.
          </p>
        ) : null}
      </div>

      {pageCount > 1 ? (
        <div className="mt-8 flex justify-center">
          <Pagination
            totalPageCount={pageCount}
            page={page}
            onChange={setPage}
            size="large"
          />
        </div>
      ) : null}
    </section>
  )
}
