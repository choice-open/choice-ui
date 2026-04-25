import { Popover, SimpleColorPicker } from "@choice-ui/react"
import { useRef, useState, type ReactNode } from "react"
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
 * Trade-off: external updates (Reset, alias-driven swap) no longer
 * propagate into an *open* popover. The picker re-seeds from `value` on
 * mount, so closing and reopening the popover picks up any external
 * change. That's an acceptable cost — Reset is rare; the alternative
 * (re-syncing prop -> state) breaks every commit.
 *
 * Drag batching: while the user is dragging the area / hue slider,
 * `onColorChange` fires at ~60Hz. Pushing each tick into the store
 * re-clones the token tree, re-runs Terrazzo, and re-injects the live
 * style — the race-guard in `useLiveTheme` then cancels every
 * intermediate compile, freezing the preview until release. So during a
 * drag we hold the latest RGB locally and commit once on `onChangeEnd`.
 * Non-drag changes (typing into RGB / Hex inputs, where the channel
 * field doesn't bracket with start / end) commit immediately.
 *
 * Alpha is locked: the project's CSS transform drops alpha from
 * primitive color tokens (consumers compose it at the use site via
 * `rgb(var(--cdt-color-X) / <alpha>)`). Forcing `alpha={1}` and
 * omitting `onAlphaChange` makes the writeback structurally incapable
 * of emitting alpha < 1 even if the slider is dragged.
 */
export function ColorEditPopover({ value, label, onChange, children }: Props) {
  const initial = value ? srgbToRgb(value) : FALLBACK_RGB
  const [color, setColor] = useState<RGB>(initial)
  const isDraggingRef = useRef(false)
  const latestRef = useRef<RGB>(initial)

  function commit(rgb: RGB) {
    onChange(rgbToSrgb(rgb, 1))
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
