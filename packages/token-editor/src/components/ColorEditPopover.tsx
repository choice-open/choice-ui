import { Popover, SimpleColorPicker } from "@choice-ui/react"
import { useState, type ReactNode } from "react"
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
 * via local `useState` seeded from the prop on mount. Pushing the parent
 * `value` prop back into `color` on every render breaks
 * `usePaintState`'s hue-stability heuristic — round-tripped RGB ambiguously
 * re-derives hue near greyscale, so the slider snapped to 0 on every commit.
 *
 * Trade-off: external updates (Reset, alias-driven swap) won't propagate
 * into an *open* popover. Closing and reopening picks up any external
 * change. Acceptable cost.
 *
 * Live commits: every `onColorChange` writes to the store. The 100ms
 * debounce in `useLiveTheme` already throttles the actual Terrazzo
 * recompile, so even at 60Hz drag rate the preview only re-renders ~10
 * times/second. Earlier we tried batching commits to `onChangeEnd` only,
 * but that left the preview frozen during drag with no visual feedback.
 *
 * Alpha is locked: the project's CSS transform drops alpha from primitive
 * color tokens (consumers compose at use site via
 * `rgb(var(--cdt-color-X) / <alpha>)`). Forcing `alpha={1}` and omitting
 * `onAlphaChange` makes the writeback structurally incapable of emitting
 * alpha < 1.
 */
export function ColorEditPopover({ value, label, onChange, children }: Props) {
  const initial = value ? srgbToRgb(value) : FALLBACK_RGB
  const [color, setColor] = useState<RGB>(initial)

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
            onChange(rgbToSrgb(next, 1))
          }}
        />
      </Popover.Content>
    </Popover>
  )
}
