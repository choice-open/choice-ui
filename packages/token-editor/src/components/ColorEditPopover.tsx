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

export function ColorEditPopover({ value, label, onChange, children }: Props) {
  const rgb = value ? srgbToRgb(value) : FALLBACK_RGB
  const alpha = value?.alpha ?? 1

  return (
    <Popover interactions="click" placement="right-start">
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content className="p-3">
        <div className="mb-2 text-xs font-medium text-text-secondary">{label}</div>
        <SimpleColorPicker
          color={rgb}
          alpha={alpha}
          onColorChange={(next) => onChange(rgbToSrgb(next, alpha))}
          onAlphaChange={(next) => onChange(rgbToSrgb(rgb, next))}
        />
      </Popover.Content>
    </Popover>
  )
}
