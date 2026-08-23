import { useSyncExternalStore } from "react"

export type PreviewPrefs = {
  /** Keep previews inside the section card on phones. Off = full-bleed. */
  contained: boolean
  /** Apply the default gutter around the preview. */
  padded: boolean
}

let prefs: PreviewPrefs = { contained: true, padded: true }
const listeners = new Set<() => void>()

export const previewPrefs = {
  get: () => prefs,
  set(next: Partial<PreviewPrefs>) {
    prefs = { ...prefs, ...next }
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
