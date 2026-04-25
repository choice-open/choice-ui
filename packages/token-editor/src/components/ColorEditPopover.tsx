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
 * Mirror the storybook pattern: `SimpleColorPicker` is fully self-driven
 * via local `useState`. Pushing the parent `value` prop back into `color`
 * on every render breaks `usePaintState`'s hue-stability heuristic — a
 * round-tripped RGB ambiguously re-derives hue near greyscale, so the
 * slider snapped to 0 on every commit.
 *
 * External-update sync: while we mostly want to ignore the prop after
 * mount, we do need to react when the prop changes for reasons *other*
 * than our own commit (Reset, preset apply, alias-driven swap). Without
 * that, the popover would keep editing stale RGB while the swatch under
 * it shows fresh values, and the next drag would silently overwrite the
 * external update.
 *
 * The `lastEmittedRef` carries the last `W3CColorValue` we ourselves
 * sent up via `onChange`. The `useEffect` short-circuits when the
 * incoming `value` is JSON-equal to that ref — i.e., when the prop
 * change is just our own commit echoing back through the store. Any
 * other change re-seeds local state and the picker's hue gets re-derived
 * (which is what the user wants when they reset / pick a preset).
 *
 * Alpha is locked: the project's CSS transform drops alpha from
 * primitive color tokens (consumers compose at the use site via
 * `rgb(var(--cdt-color-X) / <alpha>)`). Forcing `alpha={1}` and
 * omitting `onAlphaChange` makes the writeback structurally incapable
 * of emitting alpha < 1.
 */
export function ColorEditPopover({ value, label, onChange, children }: Props) {
  const initial = value ? srgbToRgb(value) : FALLBACK_RGB
  const [color, setColor] = useState<RGB>(initial)
  const lastEmittedRef = useRef<W3CColorValue | null>(value)

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

  return (
    <Popover interactions="click" placement="right-start">
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content className="p-3">
        <div className="mb-2 text-body-medium text-text-secondary">{label}</div>
        <SimpleColorPicker
          color={color}
          alpha={1}
          features={{ alpha: false }}
          onColorChange={(next) => {
            setColor(next)
            commit(next)
          }}
        />
      </Popover.Content>
    </Popover>
  )
}
