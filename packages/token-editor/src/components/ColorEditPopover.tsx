import { Popover, SimpleColorPicker } from "@choice-ui/react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { rgbToSrgb, srgbToRgb, type RGB, type W3CColorValue } from "../lib/w3c"

type Props = {
  value: W3CColorValue | null
  /**
   * Live CSS variable to mutate inline on `<html>` during drag (e.g.
   * `--cdt-color-blue-500`). Inline styles trump everything in the
   * cascade, so the preview tracks the picker without going through the
   * store. Pass `null` for any context where the inline shortcut would
   * leak across modes (currently: dark-mode edits, since inline on html
   * would also override the light `:root` rule).
   */
  variableName: string | null
  label: string
  onChange: (value: W3CColorValue) => void
  children: ReactNode
}

const FALLBACK_RGB: RGB = { r: 128, g: 128, b: 128 }
const INLINE_CLEAR_DELAY_MS = 250

/**
 * `SimpleColorPicker` is self-driven from local `useState` (storybook
 * pattern). The parent `value` is only echoed back when the prop change
 * came from outside our own commits — `lastEmittedRef` carries the
 * `W3CColorValue` we last sent up; the prop arriving JSON-equal to that
 * ref means it's our own commit looping back, so the picker stays put
 * (and `usePaintState`'s hue heuristic doesn't get reset by a
 * round-tripped RGB). Reset / preset apply / alias swap arrive
 * different and re-seed local state.
 *
 * Drag fast path: pushing a store update on every `onColorChange` tick
 * (~60 Hz) re-renders ColorsPage's ~250 swatches, which is what made
 * the picker feel laggy. During an active drag we instead set the
 * relevant `--cdt-*` CSS variable inline on `<html>` — inline trumps
 * the cascade so the preview tracks the picker live without any React
 * work — and only commit to the store once on `onChangeEnd`. The
 * inline override is cleared shortly after release so the live
 * `<style id="cdt-live">` (in the `cdt-live` cascade layer) can take
 * over for subsequent edits or external resets without a stale inline
 * value sticking around.
 *
 * Non-drag commits (RGB / Hex channel typing, where the channel field
 * doesn't bracket with start / end) still go straight to the store.
 *
 * Alpha is locked: the project's CSS transform drops alpha from
 * primitive color tokens (consumers compose at the use site via
 * `rgb(var(--cdt-color-X) / <alpha>)`). Forcing `alpha={1}` and
 * omitting `onAlphaChange` keeps the writeback structurally incapable
 * of emitting alpha < 1.
 */
export function ColorEditPopover({
  value,
  variableName,
  label,
  onChange,
  children,
}: Props) {
  const initial = value ? srgbToRgb(value) : FALLBACK_RGB
  const [color, setColor] = useState<RGB>(initial)
  const lastEmittedRef = useRef<W3CColorValue | null>(value)
  const isDraggingRef = useRef(false)
  const latestRef = useRef<RGB>(initial)
  const inlineClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (JSON.stringify(value) === JSON.stringify(lastEmittedRef.current)) {
      return
    }
    setColor(value ? srgbToRgb(value) : FALLBACK_RGB)
    lastEmittedRef.current = value
  }, [value])

  function commit(rgb: RGB) {
    const next = rgbToSrgb(rgb, 1)
    lastEmittedRef.current = next
    onChange(next)
  }

  function writeInline(rgb: RGB) {
    if (!variableName) return
    document.documentElement.style.setProperty(
      variableName,
      `${rgb.r}, ${rgb.g}, ${rgb.b}`,
    )
  }

  function scheduleInlineClear() {
    if (!variableName) return
    if (inlineClearTimerRef.current) clearTimeout(inlineClearTimerRef.current)
    inlineClearTimerRef.current = setTimeout(() => {
      inlineClearTimerRef.current = null
      document.documentElement.style.removeProperty(variableName)
    }, INLINE_CLEAR_DELAY_MS)
  }

  return (
    <Popover interactions="click" placement="right-start">
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content className="p-3">
        <div className="mb-2 text-body-medium text-text-secondary">{label}</div>
        <SimpleColorPicker
          color={color}
          alpha={1}
          features={{ alpha: false }}
          onChangeStart={() => {
            isDraggingRef.current = true
            // Cancel any pending inline-clear from the previous drag so
            // the in-flight inline value doesn't get wiped mid-drag.
            if (inlineClearTimerRef.current) {
              clearTimeout(inlineClearTimerRef.current)
              inlineClearTimerRef.current = null
            }
          }}
          onColorChange={(next) => {
            setColor(next)
            latestRef.current = next
            if (isDraggingRef.current && variableName) {
              writeInline(next)
            } else {
              commit(next)
            }
          }}
          onChangeEnd={() => {
            isDraggingRef.current = false
            commit(latestRef.current)
            scheduleInlineClear()
          }}
        />
      </Popover.Content>
    </Popover>
  )
}
