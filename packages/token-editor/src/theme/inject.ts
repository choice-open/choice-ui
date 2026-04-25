import { useEffect, useRef } from "react"
import { compileToCss } from "../lib/compile"
import { useEditorStore } from "../state/store"

const STYLE_ID = "cdt-live"
const DEBOUNCE_MS = 100

export function useLiveTheme() {
  const files = useEditorStore((s) => s.files)
  const dirty = useEditorStore((s) => s.dirty)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const enabledRef = useRef(true)

  useEffect(() => {
    if (dirty.size === 0) {
      removeStyle()
      return
    }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (!enabledRef.current) return
      compileToCss(files).then(injectStyle).catch(console.error)
    }, DEBOUNCE_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [files, dirty])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault()
        enabledRef.current = !enabledRef.current
        if (enabledRef.current) {
          compileToCss(useEditorStore.getState().files).then(injectStyle).catch(console.error)
        } else {
          removeStyle()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])
}

function injectStyle(css: string) {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement("style")
    el.id = STYLE_ID
    document.head.appendChild(el)
  }
  el.textContent = css
}

function removeStyle() {
  document.getElementById(STYLE_ID)?.remove()
}
