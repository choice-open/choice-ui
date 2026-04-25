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
 * Primitive color tokens are opaque by project convention: the Terrazzo CSS
 * transform drops `alpha`, so consumers compose it at the use site via
 * `rgb(var(--cdt-color-X) / <alpha>)`. Lock the picker to alpha=1 (controlled
 * prop forces the slider back, `onAlphaChange` omitted, channel-field A
 * column hidden) so the writeback can never emit alpha < 1.
 *
 * Drag commits are batched locally: while the user is dragging the area /
 * hue slider, `onColorChange` fires at ~60Hz. Pushing each one to the store
 * re-clones the token tree, re-runs Terrazzo across all seven JSONs, and
 * re-injects `<style id="cdt-live">` — fast enough to feel laggy and slow
 * enough that the race-guard in `useLiveTheme` discards every intermediate
 * compile, freezing the live preview until the user releases. During a
 * drag we keep the next RGB in `draftRgb` only; `onChangeEnd` flushes a
 * single store write. Non-drag changes (typing into RGB / Hex inputs)
 * still commit immediately.
 */
export function ColorEditPopover({ value, label, onChange, children }: Props) {
  const propRgb = value ? srgbToRgb(value) : FALLBACK_RGB
  const [draftRgb, setDraftRgb] = useState<RGB | null>(null)
  const isDraggingRef = useRef(false)
  const displayRgb = draftRgb ?? propRgb

  function commit(next: RGB) {
    onChange(rgbToSrgb(next, 1))
  }

  return (
    <Popover interactions="click" placement="right-start">
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content className="p-3">
        <div className="mb-2 text-body-medium text-text-secondary">{label}</div>
        <SimpleColorPicker
          color={displayRgb}
          alpha={1}
          features={{ alpha: false }}
          onChangeStart={() => {
            isDraggingRef.current = true
          }}
          onColorChange={(next) => {
            if (isDraggingRef.current) {
              setDraftRgb(next)
            } else {
              commit(next)
            }
          }}
          onChangeEnd={() => {
            isDraggingRef.current = false
            if (draftRgb) {
              commit(draftRgb)
              setDraftRgb(null)
            }
          }}
        />
      </Popover.Content>
    </Popover>
  )
}
