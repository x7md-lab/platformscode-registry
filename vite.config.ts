import fs from "node:fs"
import path from "node:path"
import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import mdx from "@mdx-js/rollup"
import { apiDocs } from "./vite.api-docs"

function dedent(block: string) {
  const lines = block.replace(/^\n+|\s+$/g, "").split("\n")
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => line.match(/^\s*/)![0].length)
  const strip = Math.min(...indents)
  return lines.map((line) => line.slice(strip)).join("\n")
}

/**
 * Micro plugin: parses src/home.mdx, collects every <Section> demo body
 * keyed by its string ref (data-ref, falling back to name), and serves the
 * map as `virtual:mdx-usage` so Section can show the original usage JSX.
 */
function mdxUsage(): Plugin {
  const VIRTUAL = "virtual:mdx-usage"
  const RESOLVED = "\0" + VIRTUAL
  const mdxPath = path.resolve(__dirname, "src/home.mdx")
  return {
    name: "mdx-usage",
    resolveId(id) {
      if (id === VIRTUAL) return RESOLVED
    },
    load(id) {
      if (id !== RESOLVED) return
      this.addWatchFile(mdxPath)
      const source = fs.readFileSync(mdxPath, "utf8")
      const usage: Record<string, string> = {}
      for (const match of source.matchAll(
        /<Section\b([^>]*)>([\s\S]*?)<\/Section>/g
      )) {
        const attrs = match[1]
        const ref =
          /data-ref="([^"]+)"/.exec(attrs)?.[1] ??
          /name="([^"]+)"/.exec(attrs)?.[1]
        if (ref) usage[ref] = dedent(match[2])
      }
      return `export default ${JSON.stringify(usage)}`
    },
    handleHotUpdate({ file, server }) {
      if (path.resolve(file) === mdxPath) {
        const mod = server.moduleGraph.getModuleById(RESOLVED)
        if (mod) server.moduleGraph.invalidateModule(mod)
      }
    },
  }
}

export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [
    { enforce: "pre", ...mdx() },
    react({ include: /\.([tj]sx?|mdx?)$/ }),
    tailwindcss(),
    mdxUsage(),
    apiDocs(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
