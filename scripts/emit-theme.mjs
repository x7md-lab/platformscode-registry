import { readFileSync, writeFileSync } from "node:fs"

const registry = JSON.parse(readFileSync("registry.json", "utf8"))
const theme = registry.items.find((item) => item.type === "registry:theme")

if (theme) {
  writeFileSync(
    `public/r/${theme.name}.json`,
    JSON.stringify(
      { $schema: "https://ui.shadcn.com/schema/registry-item.json", ...theme },
      null,
      2
    )
  )
  console.log(`✔ Emitted public/r/${theme.name}.json`)
}
