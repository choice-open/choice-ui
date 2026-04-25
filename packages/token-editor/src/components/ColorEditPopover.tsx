import { Popover, SimpleColorPicker } from "@choice-ui/react"
import { type ReactNode, useState } from "react"
import { rgbToSrgb, srgbToRgb, type W3CColorValue } from "../lib/w3c"

type Props = {
  value: W3CColorValue | null
  label: string
  onChange: (value: W3CColorValue) => void
  children: ReactNode
}

export function ColorEditPopover({ value, label, onChange, children }: Props) {
  const initial = value ?? {
    colorSpace: "srgb" as const,
    components: [0.5, 0.5, 0.5] as [number, number, number],
    alpha: 1,
    hex: "#808080",
  }
  const [rgb, setRgb] = useState(srgbToRgb(initial))
  const [alpha, setAlpha] = useState(initial.alpha ?? 1)

  return (
    <Popover interactions="click" placement="right-start">
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content className="p-3">
        <div className="mb-2 text-xs font-medium text-text-secondary">{label}</div>
        <SimpleColorPicker
          color={rgb}
          alpha={alpha}
          onColorChange={(next) => {
            setRgb(next)
            onChange(rgbToSrgb(next, alpha))
          }}
          onAlphaChange={(next) => {
            setAlpha(next)
            onChange(rgbToSrgb(rgb, next))
          }}
        />
      </Popover.Content>
    </Popover>
  )
}
