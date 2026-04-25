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
  const compileSeqRef = useRef(0)

  useEffect(() => {
    if (dirty.size === 0) {
      compileSeqRef.current += 1 // invalidate any in-flight compile
      removeStyle()
      return
    }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (!enabledRef.current) return
      runCompile(files, compileSeqRef)
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
          runCompile(useEditorStore.getState().files, compileSeqRef)
        } else {
          compileSeqRef.current += 1 // invalidate any in-flight compile
          removeStyle()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])
}

function runCompile(
  files: Parameters<typeof compileToCss>[0],
  seqRef: { current: number },
) {
  const ticket = ++seqRef.current
  compileToCss(files)
    .then((css) => {
      if (ticket !== seqRef.current) return
      injectStyle(css)
    })
    .catch((err) => {
      if (ticket !== seqRef.current) return
      console.error(err)
    })
}

function injectStyle(css: string) {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement("style")
    el.id = STYLE_ID
    document.head.appendChild(el)
  }
  // Wrap inside the `cdt-live` cascade layer (declared in styles.css). The
  // bundled `tokens.css` lives in `cdt-base`, so even if Vite/HMR ends up
  // re-injecting the bundled `<style>` after this one, layer order keeps
  // `cdt-live`'s overrides winning regardless of DOM order.
  el.textContent = `@layer cdt-live {\n${css}\n}`
}

function removeStyle() {
  document.getElementById(STYLE_ID)?.remove()
}
