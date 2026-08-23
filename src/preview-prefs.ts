import { useSyncExternalStore } from "react"
import { applyBrand, applyMode, type BrandKey, type Mode } from "./brand"

export type PreviewPrefs = {
  /** Keep previews inside the section card on phones. Off = full-bleed. */
  contained: boolean
  /** Apply the default gutter around the preview. */
  padded: boolean
  /** Active DGA brand palette. */
  brand: BrandKey
  /** Light or dark surfaces. */
  mode: Mode
}

const initialMode: Mode =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"

let prefs: PreviewPrefs = {
  contained: true,
  padded: true,
  brand: "green",
  mode: initialMode,
}

const listeners = new Set<() => void>()

export const previewPrefs = {
  get: () => prefs,
  set(next: Partial<PreviewPrefs>) {
    prefs = { ...prefs, ...next }
    if (next.mode) applyMode(next.mode)
    // the brand ramp differs per mode, so re-apply on either change
    if (next.brand || next.mode) applyBrand(prefs.brand, prefs.mode)
    listeners.forEach((listener) => listener())
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

if (typeof document !== "undefined") applyMode(prefs.mode)

export function usePreviewPrefs() {
  return useSyncExternalStore(
    previewPrefs.subscribe,
    previewPrefs.get,
    previewPrefs.get
  )
}
