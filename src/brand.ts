/**
 * The three DGA brand palettes, straight from the design-system tokens
 * (design.dga.gov.sa/guidelines/foundations/color-system):
 * primary SA-flag green, secondary gold, tertiary lavender.
 *
 * Switching a brand rewrites the `--primary-*` custom properties on :root,
 * so every component retints without touching a single component file.
 */

export type BrandKey = "green" | "gold" | "lavender"
export type Mode = "light" | "dark"

type Vars = {
  primary: string
  "primary-hover": string
  "primary-active": string
  "primary-pressed": string
  "primary-bright": string
  "primary-light": string
  "primary-soft": string
  "primary-foreground": string
  /** Brand used as ink; equals `primary` in light, lightens on dark. */
  "primary-accent": string
  ring: string
}

type Ramp = {
  label: string
  /** Swatch shown in the picker. */
  swatch: string
  vars: Vars
  /** On dark surfaces the ramp inverts: lighter accents, darkened tints. */
  dark: Vars
}

export const BRANDS: Record<BrandKey, Ramp> = {
  // --colors-primary-sa-flag-*
  green: {
    label: "الأخضر",
    swatch: "#1b8354",
    vars: {
      primary: "#1b8354",
      "primary-hover": "#166a45",
      "primary-active": "#14573a",
      "primary-pressed": "#104631",
      "primary-bright": "#54c08a",
      "primary-light": "#f3fcf6",
      "primary-soft": "#dff6e7",
      "primary-foreground": "#ffffff",
      "primary-accent": "#1b8354",
      ring: "#1b8354",
    },
    dark: {
      primary: "#1b8354",
      "primary-hover": "#25935f",
      "primary-active": "#166a45",
      "primary-pressed": "#14573a",
      "primary-bright": "#88d8ad",
      "primary-light": "#092a1e",
      "primary-soft": "#104631",
      "primary-foreground": "#ffffff",
      "primary-accent": "#88d8ad",
      ring: "#54c08a",
    },
  },
  // --colors-secondary-gold-*
  gold: {
    label: "الذهبي",
    swatch: "#dba102",
    vars: {
      primary: "#dba102",
      "primary-hover": "#b87b02",
      "primary-active": "#945c01",
      "primary-pressed": "#6e3c00",
      "primary-bright": "#f7d54d",
      "primary-light": "#fffef2",
      "primary-soft": "#fffce6",
      "primary-foreground": "#ffffff",
      // gold as ink needs two steps down: #dba102 is 2.0:1 on white and
      // #b87b02 only 3.25:1 against the muted surface. #945c01 clears AA at
      // 5.03:1 while staying on the DGA gold ramp. Fills keep #dba102.
      "primary-accent": "#945c01",
      ring: "#b87b02",
    },
    dark: {
      primary: "#dba102",
      "primary-hover": "#f5bd02",
      "primary-active": "#b87b02",
      "primary-pressed": "#945c01",
      "primary-bright": "#fae996",
      "primary-light": "#472400",
      "primary-soft": "#6e3c00",
      "primary-foreground": "#ffffff",
      "primary-accent": "#fae996",
      ring: "#f7d54d",
    },
  },
  // --colors-tertiary-lavendar-*
  lavender: {
    label: "الخزامى",
    swatch: "#6d428f",
    vars: {
      primary: "#6d428f",
      "primary-hover": "#532d75",
      "primary-active": "#3d1d5e",
      "primary-pressed": "#281047",
      "primary-bright": "#a57bba",
      "primary-light": "#f9f5fa",
      "primary-soft": "#f2e9f5",
      "primary-foreground": "#ffffff",
      "primary-accent": "#6d428f",
      ring: "#6d428f",
    },
    dark: {
      primary: "#8a5aad",
      "primary-hover": "#a57bba",
      "primary-active": "#6d428f",
      "primary-pressed": "#532d75",
      "primary-bright": "#ccadd9",
      "primary-light": "#16072e",
      "primary-soft": "#281047",
      "primary-foreground": "#ffffff",
      "primary-accent": "#ccadd9",
      ring: "#a57bba",
    },
  },
}

/**
 * Rewrites the `--primary-*` custom properties on :root for the given brand
 * and mode, so every component retints without touching a component file.
 */
export function applyBrand(key: BrandKey, mode: Mode) {
  const root = document.documentElement
  const vars = mode === "dark" ? BRANDS[key].dark : BRANDS[key].vars
  for (const [name, value] of Object.entries(vars)) {
    root.style.setProperty(`--${name}`, value)
  }
  root.dataset.brand = key
}

export function applyMode(mode: Mode) {
  document.documentElement.classList.toggle("dark", mode === "dark")
}
