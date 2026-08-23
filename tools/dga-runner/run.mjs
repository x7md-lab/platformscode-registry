#!/usr/bin/env node
// Mount a template zip and drive the OG implementation in headless Chrome.
//
//   node run.mjs <zip> [actions...]
//
// Actions (executed in the order given):
//   --width <px>        set viewport width (default 1440)
//   --scroll <y>        scroll to y before the next shot
//   --scroll-to <sel>   scroll element into view (sel supports ">>>" shadow hops)
//   --shot <file.png>   screenshot
//   --eval <expr>       evaluate JS in the page (async ok; dq/dqa available)
//   --states <sel>      computed styles at default/hover/active/focus-visible
//   --hover <sel>       dispatch a real mouse move over the element
//   --click <sel>       real click at the element center
//   --wait <ms>         pause
//   --console           print collected console errors/warnings
//   --keep              leave vite + chrome running (prints URLs) and exit
//
// Selector syntax: "dga-button >>> .dga-btn" pierces shadow roots.
import { execFileSync, spawn } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { unzipSync } from "fflate"
import CDP from "chrome-remote-interface"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CHROME =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe"
const VITE_PORT = Number(process.env.RUNNER_PORT ?? 4390)
const CDP_PORT = Number(process.env.RUNNER_CDP_PORT ?? 9390)

const [zipPath, ...actionArgs] = process.argv.slice(2)
if (!zipPath) {
  console.error("usage: node run.mjs <zip|url> [actions...]  (see header for actions)")
  process.exit(1)
}

// url mode: skip mount + serve, drive an already-running page (e.g. our registry preview)
const urlMode = /^https?:\/\//.test(zipPath)

// ---------- 1. mount ----------
const mountedDir = path.join(HERE, "src", "mounted")
if (!urlMode) {
  rmSync(mountedDir, { recursive: true, force: true })
  mkdirSync(mountedDir, { recursive: true })
}

const zipName = path.basename(zipPath).replace(/\.zip$/i, "")
const files = urlMode ? {} : unzipSync(readFileSync(zipPath))
const written = []
for (const [name, data] of Object.entries(files)) {
  if (name.includes("__MACOSX") || name.endsWith("/")) continue
  const target = path.join(mountedDir, zipName, name)
  mkdirSync(path.dirname(target), { recursive: true })
  let content = Buffer.from(data)
  if (/\.(t|j)sx?$/.test(name)) {
    let source = content.toString("utf8")
    // node_modules-relative style import → bare specifier
    source = source.replace(
      /["'][./]*node_modules\/(platformscode[^"']*)["']/g,
      '"$1"'
    )
    // shared utils/guid from outside the zip → shim
    source = source.replace(
      /from\s+["'][./]+utils\/guid["']/g,
      'from "@shim/guid"'
    )
    // any other relative import that climbs out of the zip → stub
    source = source.replace(
      /from\s+["'](\.\.\/)+(?!\.)([^"']*)["']/g,
      (whole, _up, rest) => {
        const local = path.join(mountedDir, zipName, rest)
        if (
          [".tsx", ".ts", ".jsx", ".js", "/index.tsx", "/index.ts"].some((ext) =>
            existsSync(local + ext)
          ) ||
          existsSync(local)
        )
          return whole
        console.warn(`[mount] stubbed unresolved import: ${whole.trim()}`)
        return 'from "@shim/Missing"'
      }
    )
    content = Buffer.from(source)
  }
  writeFileSync(target, content)
  written.push(name)
}
if (!urlMode) console.log(`[mount] ${written.length} files from ${zipName}.zip`)

// entry = shallowest index.tsx, else the first tsx with a default export
const candidates = written
  .filter((f) => /\.(t|j)sx$/.test(f))
  .sort(
    (a, b) =>
      a.split("/").length - b.split("/").length || a.localeCompare(b)
  )
const entry =
  candidates.find((f) => /(^|\/)index\.(t|j)sx$/.test(f)) ??
  candidates.find((f) =>
    readFileSync(path.join(mountedDir, zipName, f), "utf8").includes(
      "export default"
    )
  )
if (!urlMode && !entry) {
  console.error("[mount] no (t|j)sx entry with a default export found")
  process.exit(1)
}
if (!urlMode) {
  writeFileSync(
    path.join(mountedDir, "entry.tsx"),
    `export { default } from "./${zipName}/${entry.replace(/\.(t|j)sx$/, "")}"\n`
  )
  console.log(`[mount] entry: ${entry}`)
}

// ---------- 2. serve ----------
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
let vite = null
let targetUrl = zipPath
if (!urlMode) {
  vite = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["vite", "--port", String(VITE_PORT), "--strictPort"],
    { cwd: HERE, stdio: ["ignore", "pipe", "pipe"], shell: process.platform === "win32" }
  )
  let viteLog = ""
  vite.stdout.on("data", (d) => (viteLog += d))
  vite.stderr.on("data", (d) => (viteLog += d))

  let up = false
  for (let i = 0; i < 60 && !up; i++) {
    await wait(500)
    up = await fetch(`http://localhost:${VITE_PORT}/`)
      .then((r) => r.ok)
      .catch(() => false)
  }
  if (!up) {
    console.error("[serve] vite did not come up:\n" + viteLog.slice(-800))
    vite.kill()
    process.exit(1)
  }
  targetUrl = `http://localhost:${VITE_PORT}/`
  console.log(`[serve] ${targetUrl}`)
}

// ---------- 3. drive ----------
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${path.join(HERE, ".chrome-profile")}`,
    "--window-size=1440,1000",
    "about:blank",
  ],
  { stdio: "ignore" }
)
await wait(2500)
const client = await CDP({ port: CDP_PORT })
const { Page, Runtime, DOM, CSS, Emulation, Input } = client
await Page.enable()
await Runtime.enable()
await DOM.enable()
await CSS.enable()

const consoleMessages = []
Runtime.consoleAPICalled(({ type, args }) => {
  if (type === "error" || type === "warning")
    consoleMessages.push(
      `${type}: ${args.map((a) => a.value ?? a.description ?? "").join(" ")}`.slice(0, 200)
    )
})
Runtime.exceptionThrown(({ exceptionDetails }) =>
  consoleMessages.push(
    "exception: " +
      (exceptionDetails.exception?.description ?? exceptionDetails.text ?? "").slice(0, 200)
  )
)

let width = 1440
await Emulation.setDeviceMetricsOverride({
  width,
  height: 1000,
  deviceScaleFactor: 1,
  mobile: false,
})
await Page.navigate({ url: targetUrl })
await Page.loadEventFired()
await wait(3000)

// deep-query helpers, shadow-DOM aware
await Runtime.evaluate({
  expression: `
    window.dq = (sel) => sel.split(">>>").map(s => s.trim()).reduce(
      (ctx, part) => ctx && (ctx.shadowRoot ?? ctx).querySelector(part), document)
    window.dqa = (sel) => {
      const parts = sel.split(">>>").map(s => s.trim())
      const last = parts.pop()
      const ctx = parts.reduce(
        (c, part) => c && (c.shadowRoot ?? c).querySelector(part), document)
      return ctx ? [...(ctx.shadowRoot ?? ctx).querySelectorAll(last)] : []
    }
  `,
})

const evaluate = async (expression) => {
  const { result, exceptionDetails } = await Runtime.evaluate({
    expression,
    awaitPromise: true,
    returnByValue: true,
  })
  if (exceptionDetails)
    return { error: (exceptionDetails.exception?.description ?? "").slice(0, 300) }
  return result.value
}

const centerOf = async (sel) =>
  evaluate(`(() => {
    const el = dq(${JSON.stringify(sel)})
    if (!el) return null
    el.scrollIntoView({ block: "center" })
    const r = el.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  })()`)

const STATE_PROPS = [
  "height", "padding", "font-size", "font-weight", "line-height",
  "border-radius", "border", "background-color", "color", "outline",
  "box-shadow", "text-decoration-line", "transform", "opacity",
]

async function states(sel) {
  await DOM.getDocument({ depth: -1 })
  const { result } = await Runtime.evaluate({
    expression: `dq(${JSON.stringify(sel)})`,
  })
  if (!result.objectId) return console.log(`[states] not found: ${sel}`)
  const { nodeId } = await DOM.requestNode({ objectId: result.objectId })
  console.log(`[states] ${sel}`)
  for (const [label, forced] of [
    ["default", []],
    ["hover", ["hover"]],
    ["active", ["hover", "active"]],
    ["focus-visible", ["focus", "focus-visible"]],
  ]) {
    await CSS.forcePseudoState({ nodeId, forcedPseudoClasses: forced })
    await wait(150)
    const { computedStyle } = await CSS.getComputedStyleForNode({ nodeId })
    const map = Object.fromEntries(computedStyle.map((p) => [p.name, p.value]))
    const line = STATE_PROPS.map((p) => `${p}=${map[p]}`).join(" ")
    console.log(`  ${label.padEnd(14)} ${line}`)
  }
  await CSS.forcePseudoState({ nodeId, forcedPseudoClasses: [] })
}

// UX diff: snapshot computed styles (+ ::before/::after + classes) across
// real interactions — baseline, hover, pressed, focus — and print only what changed.
const SNAPSHOT_FN = `
  window.__snap = (el) => {
    const PROPS = ["background-color","color","font-size","font-weight","outline-color",
      "outline-width","outline-style","box-shadow","border","border-radius",
      "text-decoration-line","transform","translate","opacity","height","padding","gap"]
    const PSEUDO = ["content","display","width","height","background-color",
      "border-radius","bottom","top","left","opacity","transform","translate"]
    const grab = (pseudo) => {
      const cs = getComputedStyle(el, pseudo)
      const out = {}
      for (const p of (pseudo ? PSEUDO : PROPS)) out[p] = cs.getPropertyValue(p)
      return out
    }
    return { classes: (el.className || "").toString(), styles: grab(null),
             after: grab("::after"), before: grab("::before") }
  }
  if (!window.__navBlock) {
    window.__navBlock = true
    window.addEventListener("click", (e) => e.preventDefault(), true)
    window.addEventListener("submit", (e) => e.preventDefault(), true)
  }
`

function diffSnaps(a, b) {
  const out = {}
  for (const section of ["styles", "after", "before"]) {
    for (const key of Object.keys(a[section] ?? {})) {
      if (a[section][key] !== b[section]?.[key])
        out[section + "::" + key] = a[section][key] + "  ->  " + b[section][key]
    }
  }
  if (a.classes !== b.classes) out.classes = a.classes + "  ->  " + b.classes
  return out
}

async function uxdiff(sel) {
  const snap = async () => {
    await Runtime.evaluate({ expression: SNAPSHOT_FN })
    return evaluate(
      `(() => { const el = dq(${JSON.stringify(sel)}); return el ? window.__snap(el) : null })()`
    )
  }
  const pos = await centerOf(sel)
  if (!pos) return console.log(`[uxdiff] not found: ${sel}`)

  // baseline: pointer parked away, nothing focused
  await Input.dispatchMouseEvent({ type: "mouseMoved", x: 5, y: 5 })
  await evaluate("document.activeElement && document.activeElement.blur()")
  await wait(350)
  const base = await snap()
  if (!base) return console.log(`[uxdiff] not found: ${sel}`)
  console.log(`[uxdiff] ${sel}`)
  console.log(`  base   classes: ${base.classes.slice(0, 100)}`)

  // hover
  await Input.dispatchMouseEvent({ type: "mouseMoved", x: pos.x, y: pos.y })
  await wait(400)
  const hov = await snap()
  console.log("  hover  " + JSON.stringify(hov ? diffSnaps(base, hov) : "gone", null, 2).replace(/\n/g, "\n  "))

  // pressed (held)
  await Input.dispatchMouseEvent({ type: "mousePressed", x: pos.x, y: pos.y, button: "left", clickCount: 1 })
  await wait(300)
  const act = await snap()
  console.log("  active " + JSON.stringify(act ? diffSnaps(base, act) : "gone", null, 2).replace(/\n/g, "\n  "))
  await Input.dispatchMouseEvent({ type: "mouseReleased", x: pos.x, y: pos.y, button: "left", clickCount: 1 })
  await Input.dispatchMouseEvent({ type: "mouseMoved", x: 5, y: 5 })
  await wait(300)

  // keyboard focus
  await evaluate(`(() => { const el = dq(${JSON.stringify(sel)}); el && el.focus({focusVisible: true}) })()`)
  await wait(300)
  const foc = await snap()
  console.log("  focus  " + JSON.stringify(foc ? diffSnaps(base, foc) : "gone", null, 2).replace(/\n/g, "\n  "))
  await evaluate("document.activeElement && document.activeElement.blur()")
}

// ---------- 4. actions ----------
for (let i = 0; i < actionArgs.length; i++) {
  const arg = actionArgs[i]
  const next = () => actionArgs[++i]
  if (arg === "--width") {
    width = Number(next())
    await Emulation.setDeviceMetricsOverride({
      width,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: width < 700,
    })
    await wait(500)
  } else if (arg === "--scroll") {
    await evaluate(`window.scrollTo(0, ${Number(next())})`)
    await wait(400)
  } else if (arg === "--scroll-to") {
    await evaluate(
      `dq(${JSON.stringify(next())})?.scrollIntoView({ block: "start" })`
    )
    await wait(400)
  } else if (arg === "--shot") {
    const out = next()
    const { data } = await Page.captureScreenshot({ format: "png" })
    writeFileSync(out, Buffer.from(data, "base64"))
    console.log(`[shot] ${out} @ ${width}px`)
  } else if (arg === "--eval") {
    console.log("[eval]", JSON.stringify(await evaluate(next()), null, 2))
  } else if (arg === "--states") {
    await states(next())
  } else if (arg === "--uxdiff") {
    await uxdiff(next())
  } else if (arg === "--hover") {
    const sel = next()
    const pos = await centerOf(sel)
    if (!pos) console.log(`[hover] not found: ${sel}`)
    else {
      await Input.dispatchMouseEvent({ type: "mouseMoved", x: pos.x, y: pos.y })
      await wait(400)
      console.log(`[hover] ${sel} @ ${Math.round(pos.x)},${Math.round(pos.y)}`)
    }
  } else if (arg === "--click") {
    const sel = next()
    const pos = await centerOf(sel)
    if (!pos) console.log(`[click] not found: ${sel}`)
    else {
      for (const type of ["mousePressed", "mouseReleased"])
        await Input.dispatchMouseEvent({
          type,
          x: pos.x,
          y: pos.y,
          button: "left",
          clickCount: 1,
        })
      await wait(400)
      console.log(`[click] ${sel}`)
    }
  } else if (arg === "--wait") {
    await wait(Number(next()))
  } else if (arg === "--console") {
    console.log("[console]", consoleMessages.length ? consoleMessages : "clean")
  } else if (arg === "--keep") {
    console.log(
      `[keep] vite pid=${vite.pid} @ http://localhost:${VITE_PORT}/  chrome CDP :${CDP_PORT}`
    )
    process.exit(0)
  } else {
    console.warn(`[skip] unknown action ${arg}`)
  }
}

await client.close()
chrome.kill()
if (vite) {
  vite.kill()
  try {
    if (process.platform === "win32" && vite.pid)
      execFileSync("taskkill", ["/pid", String(vite.pid), "/T", "/F"], {
        stdio: "ignore",
      })
  } catch {
    /* already gone */
  }
}
