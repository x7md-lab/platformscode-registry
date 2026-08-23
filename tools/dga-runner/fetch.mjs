#!/usr/bin/env node
// Download a DGA template zip: node fetch.mjs <name> [out.zip]
// Known names (design.dga.gov.sa/templates/<name>.zip):
//   home contact form customer-service feedback service FAQS sitemap error
//   search eParticipation about content cookiesBanner chatbot rating
//   hajj-option-1 SaudiFoundingDayTwo NationalDayOptionOne
import { writeFileSync, mkdirSync } from "node:fs"
import path from "node:path"

const name = process.argv[2]
if (!name) {
  console.error("usage: node fetch.mjs <template-name> [out.zip]")
  process.exit(1)
}
const out = process.argv[3] ?? path.join("zips", `${name}.zip`)
const url = `https://design.dga.gov.sa/templates/${name}.zip`

const res = await fetch(url, {
  headers: {
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
    referer: "https://design.dga.gov.sa/guidelines/templates",
  },
})
if (!res.ok) {
  console.error(`HTTP ${res.status} for ${url}`)
  process.exit(1)
}
const buf = Buffer.from(await res.arrayBuffer())
if (buf.subarray(0, 2).toString() !== "PK") {
  console.error("Response is not a zip (SPA fallback page?) — check the name.")
  process.exit(1)
}
mkdirSync(path.dirname(out), { recursive: true })
writeFileSync(out, buf)
console.log(`saved ${out} (${buf.length} bytes)`)
