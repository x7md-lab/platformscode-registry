import fs from "node:fs"
import path from "node:path"
import { parse, Lang, type SgNode } from "@ast-grep/napi"
import type { Plugin } from "vite"

/**
 * Micro plugin: walks the registry sources with ast-grep, extracts every
 * exported part (component / alias) with its EN JSDoc and prop table
 * (name / type / default / optional / doc), resolves Arabic descriptions
 * from src/api-docs.ar.json, and serves the result as `virtual:api-docs`.
 * Missing Arabic mappings are reported once per build.
 */

export type ApiProp = {
  name: string
  type: string
  optional: boolean
  default: string | null
  doc: { en: string | null; ar: string | null }
}

export type ApiPart = {
  name: string
  doc: { en: string | null; ar: string | null }
  inherits: string[]
  props: ApiProp[]
}

const ROOTS = ["registry/platformscode/ui", "registry/platformscode/blocks"]

function cleanJsdoc(raw: string): string | null {
  if (!raw.startsWith("/**")) return null
  const text = raw
    .replace(/^\/\*\*|\*\/$/g, "")
    .split("\n")
    .map((line) => line.replace(/^\s*\* ?/, "").trim())
    .filter(
      (line) =>
        line && !line.startsWith("@") && !line.startsWith("Documentation:")
    )
    .join(" ")
    .trim()
  return text || null
}

function jsdocBefore(node: SgNode): string | null {
  const prev = node.prev()
  if (prev && prev.kind() === "comment") return cleanJsdoc(prev.text())
  return null
}

function typeText(annotation: SgNode | null): string {
  if (!annotation) return "unknown"
  return annotation.text().replace(/^:\s*/, "").replace(/\s+/g, " ").trim()
}

function collectDefaults(pattern: SgNode, defaults: Map<string, string>) {
  for (const child of pattern.children()) {
    if (child.kind() === "object_assignment_pattern") {
      const left = child.field("left")
      const right = child.field("right")
      if (left && right) {
        const key = left.text().replace(/^["']|["']$/g, "")
        defaults.set(key, right.text().replace(/\s+/g, " "))
      }
    }
  }
}

function collectMembers(objectType: SgNode, defaults: Map<string, string>): ApiProp[] {
  const props: ApiProp[] = []
  for (const member of objectType.children()) {
    if (member.kind() !== "property_signature") continue
    const nameNode = member.field("name")
    if (!nameNode) continue
    const name = nameNode.text().replace(/^["']|["']$/g, "")
    const optional = member.text().replace(/\s/g, "").includes(name + "?:") ||
      /\?\s*:/.test(member.text().slice(0, member.text().indexOf(":") + 1))
    props.push({
      name,
      type: typeText(member.field("type")),
      optional,
      default: defaults.get(name) ?? null,
      doc: { en: jsdocBefore(member), ar: null },
    })
  }
  return props
}

function extractFile(filePath: string): ApiPart[] {
  const source = fs.readFileSync(filePath, "utf8")
  const root = parse(Lang.Tsx, source).root()
  const parts: ApiPart[] = []

  for (const exportNode of root.findAll({ rule: { kind: "export_statement" } })) {
    const doc = jsdocBefore(exportNode)

    const fn = exportNode
      .children()
      .find((child) => child.kind() === "function_declaration")
    if (fn) {
      const name = fn.field("name")?.text() ?? "?"
      const inherits: string[] = []
      let props: ApiProp[] = []
      const params = fn.field("parameters")
      const firstParam = params
        ?.children()
        .find((child) =>
          ["required_parameter", "optional_parameter"].includes(
            child.kind() as string
          )
        )
      if (firstParam) {
        const defaults = new Map<string, string>()
        const pattern = firstParam.field("pattern")
        if (pattern && pattern.kind() === "object_pattern")
          collectDefaults(pattern, defaults)
        const annotation = firstParam.field("type")
        const typeNode = annotation?.children().at(-1) ?? null
        if (typeNode) {
          if (typeNode.kind() === "object_type") {
            props = collectMembers(typeNode, defaults)
          } else if (typeNode.kind() === "intersection_type") {
            for (const branch of typeNode.children()) {
              if (branch.kind() === "object_type")
                props = props.concat(collectMembers(branch, defaults))
              else if (branch.text() !== "&")
                inherits.push(branch.text().replace(/\s+/g, " "))
            }
          } else {
            inherits.push(typeNode.text().replace(/\s+/g, " "))
          }
        }
      }
      parts.push({ name, doc: { en: doc, ar: null }, inherits, props })
      continue
    }

    // export const X = Y (aliases like ModalTrigger = Dialog.Trigger)
    const lexical = exportNode
      .children()
      .find((child) => child.kind() === "lexical_declaration")
    if (lexical) {
      for (const declarator of lexical.findAll({
        rule: { kind: "variable_declarator" },
      })) {
        const name = declarator.field("name")?.text()
        const value = declarator.field("value")?.text() ?? ""
        if (!name || !/^[A-Z]/.test(name)) continue
        if (/^\(|=>|function/.test(value)) continue
        parts.push({
          name,
          doc: { en: doc, ar: null },
          inherits: [value.replace(/\s+/g, " ").slice(0, 60)],
          props: [],
        })
      }
    }
  }
  return parts
}

export function apiDocs(): Plugin {
  const VIRTUAL = "virtual:api-docs"
  const RESOLVED = "\0" + VIRTUAL
  const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1"))
  const arPath = path.resolve(here, "src/api-docs.ar.json")

  return {
    name: "api-docs",
    resolveId(id) {
      if (id === VIRTUAL) return RESOLVED
    },
    load(id) {
      if (id !== RESOLVED) return
      this.addWatchFile(arPath)

      // Nested Arabic mapping: { component: { Part: { _doc, props: { name } } } }
      type ArPart = { _doc?: string; props?: Record<string, string> }
      const arMap: Record<string, Record<string, ArPart>> = fs.existsSync(arPath)
        ? JSON.parse(fs.readFileSync(arPath, "utf8"))
        : {}

      const api: Record<string, ApiPart[]> = {}
      const missing: string[] = []

      for (const dir of ROOTS) {
        const abs = path.resolve(here, dir)
        if (!fs.existsSync(abs)) continue
        for (const file of fs.readdirSync(abs)) {
          if (!file.endsWith(".tsx")) continue
          this.addWatchFile(path.join(abs, file))
          const base = file.replace(/\.tsx$/, "")
          const parts = extractFile(path.join(abs, file))
          if (!parts.length) continue
          for (const part of parts) {
            const arPart = arMap[base]?.[part.name]
            if (part.doc.en) {
              part.doc.ar = arPart?._doc ?? null
              if (part.doc.ar == null) missing.push(`${base}.${part.name}._doc`)
            }
            for (const prop of part.props) {
              if (!prop.doc.en) continue
              prop.doc.ar = arPart?.props?.[prop.name] ?? null
              if (prop.doc.ar == null)
                missing.push(`${base}.${part.name}.props.${prop.name}`)
            }
          }
          api[base] = parts
        }
      }

      if (missing.length) {
        this.warn(
          `[api-docs] ${missing.length} keys have no Arabic mapping in src/api-docs.ar.json:\n` +
            missing.map((entry) => `  - ${entry}`).join("\n")
        )
      }

      return `export default ${JSON.stringify(api)}`
    },
    handleHotUpdate({ server }) {
      const mod = server.moduleGraph.getModuleById(RESOLVED)
      if (mod) server.moduleGraph.invalidateModule(mod)
    },
  }
}
