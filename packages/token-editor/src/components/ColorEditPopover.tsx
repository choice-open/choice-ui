import { Popover, SimpleColorPicker } from "@choice-ui/react"
import type { ReactNode } from "react"
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
 * transform drops `alpha` so consumers can compose it at the use site via
 * `rgb(var(--cdt-color-X) / <alpha>)`. Letting users edit alpha here would
 * silently diverge live preview / export from token JSON state. Lock the
 * picker to alpha=1 (controlled prop forces the slider back, `onAlphaChange`
 * is intentionally omitted, and the channel field's A column is hidden via
 * `features.alpha = false`) so the writeback can never emit alpha < 1.
 */
export function ColorEditPopover({ value, label, onChange, children }: Props) {
  const rgb = value ? srgbToRgb(value) : FALLBACK_RGB

  return (
    <Popover interactions="click" placement="right-start">
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content className="p-3">
        <div className="mb-2 text-body-medium-strong text-text-secondary">{label}</div>
        <SimpleColorPicker
          color={rgb}
          alpha={1}
          features={{ alpha: false }}
          onColorChange={(next) => onChange(rgbToSrgb(next, 1))}
        />
      </Popover.Content>
    </Popover>
  )
}
