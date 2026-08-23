/**
 * The three DGA brand palettes, straight from the design-system tokens
 * (design.dga.gov.sa/guidelines/foundations/color-system):
 * primary SA-flag green, secondary gold, tertiary lavender.
 *
 * Switching a brand rewrites the `--primary-*` custom properties on :root,
 * so every component retints without touching a single component file.
 */

export type BrandKey = "green" | "gold" | "lavender"

type Ramp = {
  label: string
  /** Swatch shown in the picker. */
  swatch: string
  vars: {
    primary: string
    "primary-hover": string
    "primary-active": string
    "primary-pressed": string
    "primary-bright": string
    "primary-light": string
    "primary-soft": string
    "primary-foreground": string
    ring: string
  }
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
      ring: "#1b8354",
    },
  },
  // --colors-secondary-gold-*  (dark text: white on gold fails contrast)
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
      "primary-foreground": "#161616",
      ring: "#b87b02",
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
      ring: "#6d428f",
    },
  },
}

export function applyBrand(key: BrandKey) {
  const root = document.documentElement
  for (const [name, value] of Object.entries(BRANDS[key].vars)) {
    root.style.setProperty(`--${name}`, value)
  }
  root.dataset.brand = key
}
