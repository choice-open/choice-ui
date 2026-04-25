import { Popover, SimpleColorPicker } from "@choice-ui/react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { rgbToSrgb, srgbToRgb, type RGB, type W3CColorValue } from "../lib/w3c"

type Props = {
  value: W3CColorValue | null
  label: string
  onChange: (value: W3CColorValue) => void
  children: ReactNode
}

const FALLBACK_RGB: RGB = { r: 128, g: 128, b: 128 }

/**
 * Primitive color tokens are opaque by project convention: the Terrazzo CSS
 * transform drops `alpha`, so consumers compose it at the use site via
 * `rgb(var(--cdt-color-X) / <alpha>)`. Lock the picker to alpha=1 (controlled
 * prop forces the slider back, `onAlphaChange` omitted, channel-field A
 * column hidden) so the writeback can never emit alpha < 1.
 *
 * Hue stability: `SimpleColorPicker` derives the hue slider position from
 * the RGB it receives. Pushing the upstream `value` prop straight back into
 * the picker on every render — what we used to do — meant a round-tripped
 * RGB (rounded by `rgbToSrgb` → `srgbToRgb`) re-entered the picker, and any
 * RGB near greyscale ambiguously maps to multiple hues, so the slider
 * snapped to 0 on each commit. Storybook avoids this by holding RGB in
 * local `useState` and treating the picker as self-driven; do the same.
 *
 * Two-way sync without losing hue: own the picker's RGB locally, and only
 * accept an incoming `value` when it differs from the value we ourselves
 * last committed. That keeps Reset / alias-driven swaps working, but a
 * normal drag-and-commit cycle never echoes back into the picker.
 *
 * Drag batching: while dragging, `onColorChange` fires at ~60Hz. Pushing
 * each tick into the store re-clones the token tree, re-runs Terrazzo, and
 * re-injects the live style — laggy, plus the race-guard in `useLiveTheme`
 * cancels every intermediate compile so the preview stays frozen until
 * release. Track drag with `isDraggingRef`; commit only on `onChangeEnd`.
 * Non-drag changes (typing into RGB / Hex inputs, where the channel field
 * doesn't fire start/end) commit immediately.
 */
export function ColorEditPopover({ value, label, onChange, children }: Props) {
  const initial = value ? srgbToRgb(value) : FALLBACK_RGB
  const [color, setColor] = useState<RGB>(initial)
  const isDraggingRef = useRef(false)
  const latestRef = useRef<RGB>(initial)
  const lastCommittedRef = useRef<W3CColorValue | null>(value)

  useEffect(() => {
    // Only re-sync when `value` differs from the last value we ourselves
    // committed. Self-emitted updates round-trip through `rgbToSrgb` to
    // exactly the value we just stored, so they no-op here and the
    // picker's internal hue survives.
    if (JSON.stringify(value) === JSON.stringify(lastCommittedRef.current)) {
      return
    }
    const next = value ? srgbToRgb(value) : FALLBACK_RGB
    setColor(next)
    latestRef.current = next
    lastCommittedRef.current = value
  }, [value])

  function commit(rgb: RGB) {
    const next = rgbToSrgb(rgb, 1)
    lastCommittedRef.current = next
    onChange(next)
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
          }}
          onColorChange={(next) => {
            setColor(next)
            latestRef.current = next
            if (!isDraggingRef.current) commit(next)
          }}
          onChangeEnd={() => {
            isDraggingRef.current = false
            commit(latestRef.current)
          }}
        />
      </Popover.Content>
    </Popover>
  )
}
