import { Popover, SimpleColorPicker, TextField } from "@choice-ui/react"
import { useEffect, useRef, useState } from "react"
import {
  formatCssColor,
  hexToRgb,
  parseCssColor,
  rgbToHex,
  type RgbaColor,
} from "../lib/css-color"
import type { RGB } from "../lib/w3c"

type Props = {
  /** Current CSS color string (e.g. `rgba(0, 0, 0, 0.1)` or `#000`). */
  value: string | undefined
  onChange: (next: string) => void
}

/**
 * Figma-style shadow color cell: swatch + 6-digit hex + alpha %.
 * Clicking the swatch opens a `SimpleColorPicker` with alpha enabled
 * (shadows really do use translucent colors, unlike primitive color
 * tokens which lock alpha to 1). Hex / alpha are also editable inline
 * — typing commits on blur or Enter.
 *
 * Self-driven local state mirrors the `ColorEditPopover` pattern: the
 * picker manages its own RGB; the prop is only echoed back when the
 * incoming `value` differs from what we last emitted (so external
 * resets / preset applies re-seed but our own commits don't bounce).
 */
export function ShadowColorPopover({ value, onChange }: Props) {
  const initial = parseCssColor(value)
  const [rgba, setRgba] = useState<RgbaColor>(initial)
  const lastEmittedRef = useRef<string | undefined>(value)
  const latestRef = useRef<RgbaColor>(initial)

  useEffect(() => {
    if (value === lastEmittedRef.current) return
    const next = parseCssColor(value)
    setRgba(next)
    latestRef.current = next
    lastEmittedRef.current = value
  }, [value])

  function commit(next: RgbaColor) {
    latestRef.current = next
    setRgba(next)
    const css = formatCssColor(next)
    lastEmittedRef.current = css
    onChange(css)
  }

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1">
      <Popover interactions="click" placement="right-start">
        <Popover.Trigger>
          <button
            type="button"
            aria-label="Edit shadow color"
            className="block h-5 w-5 rounded border border-border-default bg-checkerboard"
            style={{
              backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.alpha})`,
            }}
          />
        </Popover.Trigger>
        <Popover.Content className="p-3">
          <SimpleColorPicker
            color={{ r: rgba.r, g: rgba.g, b: rgba.b }}
            alpha={rgba.alpha}
            onColorChange={(rgb: RGB) =>
              commit({ ...rgb, alpha: latestRef.current.alpha })
            }
            onAlphaChange={(alpha: number) =>
              commit({
                r: latestRef.current.r,
                g: latestRef.current.g,
                b: latestRef.current.b,
                alpha,
              })
            }
          />
        </Popover.Content>
      </Popover>
      <HexField rgba={rgba} onCommit={commit} />
      <AlphaField rgba={rgba} onCommit={commit} />
    </div>
  )
}

function HexField({
  rgba,
  onCommit,
}: {
  rgba: RgbaColor
  onCommit: (next: RgbaColor) => void
}) {
  const canonical = rgbToHex(rgba).slice(1).toUpperCase()
  const [draft, setDraft] = useState(canonical)
  useEffect(() => {
    setDraft(canonical)
  }, [canonical])

  function flush() {
    const parsed = hexToRgb(`#${draft}`)
    if (!parsed) {
      setDraft(canonical)
      return
    }
    onCommit({ ...parsed, alpha: rgba.alpha })
  }

  return (
    <TextField
      value={draft}
      onChange={(v) => setDraft(v.replace(/[^0-9a-f]/gi, "").slice(0, 6).toUpperCase())}
      onBlur={flush}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur()
        if (e.key === "Escape") {
          setDraft(canonical)
          ;(e.target as HTMLInputElement).blur()
        }
      }}
    />
  )
}

function AlphaField({
  rgba,
  onCommit,
}: {
  rgba: RgbaColor
  onCommit: (next: RgbaColor) => void
}) {
  const canonical = Math.round(rgba.alpha * 100)
  const [draft, setDraft] = useState(String(canonical))
  useEffect(() => {
    setDraft(String(canonical))
  }, [canonical])

  function flush() {
    const n = Number.parseFloat(draft)
    if (!Number.isFinite(n)) {
      setDraft(String(canonical))
      return
    }
    const next = Math.max(0, Math.min(100, n)) / 100
    onCommit({ r: rgba.r, g: rgba.g, b: rgba.b, alpha: next })
  }

  return (
    <TextField
      className="w-16"
      value={draft}
      onChange={(v) => setDraft(v.replace(/[^0-9.]/g, "").slice(0, 4))}
      onBlur={flush}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur()
        if (e.key === "Escape") {
          setDraft(String(canonical))
          ;(e.target as HTMLInputElement).blur()
        }
      }}
    >
      <TextField.Suffix>%</TextField.Suffix>
    </TextField>
  )
}
