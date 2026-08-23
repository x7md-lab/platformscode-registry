import { useSyncExternalStore } from "react"
import { applyBrand, type BrandKey } from "./brand"

export type PreviewPrefs = {
  /** Keep previews inside the section card on phones. Off = full-bleed. */
  contained: boolean
  /** Apply the default gutter around the preview. */
  padded: boolean
  /** Active DGA brand palette. */
  brand: BrandKey
}

let prefs: PreviewPrefs = { contained: true, padded: true, brand: "green" }
const listeners = new Set<() => void>()

export const previewPrefs = {
  get: () => prefs,
  set(next: Partial<PreviewPrefs>) {
    prefs = { ...prefs, ...next }
    if (next.brand) applyBrand(next.brand)
    listeners.forEach((listener) => listener())
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

export function usePreviewPrefs() {
  return useSyncExternalStore(
    previewPrefs.subscribe,
    previewPrefs.get,
    previewPrefs.get
  )
}
