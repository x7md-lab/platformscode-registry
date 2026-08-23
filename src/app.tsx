import type { MDXComponents } from "mdx/types"
import Home from "./home.mdx"
import { SiteHeader } from "./site-header"
import { PreviewSettings } from "./preview-settings"

const components: MDXComponents = {
  h1: (props) => (
    <h1 className="mb-2 mt-0 text-3xl font-bold tracking-tight" {...props} />
  ),
  h2: (props) => (
    <h2
      className="mb-6 mt-16 border-0 border-b border-solid border-border pb-2 text-2xl font-bold text-primary"
      {...props}
    />
  ),
  h3: (props) => <h3 className="mb-3 mt-10 text-xl font-bold" {...props} />,
  p: (props) => <p className="my-2 leading-7 text-muted-foreground" {...props} />,
  code: (props) => (
    <code
      dir="ltr"
      className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-8 border-border" {...props} />,
}

export default function App() {
  return (
    <>
      <span id="top" />
      <SiteHeader />
      <main className="mx-auto min-h-svh max-w-3xl px-4 pb-8 pt-6 lg:max-w-5xl xl:max-w-6xl">
        <Home components={components} />
      </main>
      <PreviewSettings />
    </>
  )
}
