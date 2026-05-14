import type { RGB } from "./w3c"

export type RgbaColor = RGB & { alpha: number }

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const RGBA_RE = /^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i

const FALLBACK: RgbaColor = { r: 0, g: 0, b: 0, alpha: 1 }

/**
 * Permissive CSS color parser scoped to the formats the bundled shadow
 * tokens actually use today (`rgba(R, G, B, A)`, `rgb(R, G, B)`, hex).
 * Anything we can't parse falls back to opaque black so the swatch still
 * renders something sensible — the user can correct it via the picker.
 */
export function parseCssColor(input: string | undefined | null): RgbaColor {
  if (!input) return FALLBACK
  const s = input.trim()
  const hex = s.match(HEX_RE)
  if (hex) {
    const h = hex[1]
    if (h.length === 3) {
      return {
        r: parseInt(h[0] + h[0], 16),
        g: parseInt(h[1] + h[1], 16),
        b: parseInt(h[2] + h[2], 16),
        alpha: 1,
      }
    }
    if (h.length === 4) {
      return {
        r: parseInt(h[0] + h[0], 16),
        g: parseInt(h[1] + h[1], 16),
        b: parseInt(h[2] + h[2], 16),
        alpha: clampAlpha(parseInt(h[3] + h[3], 16) / 255),
      }
    }
    if (h.length === 6) {
      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
        alpha: 1,
      }
    }
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      alpha: clampAlpha(parseInt(h.slice(6, 8), 16) / 255),
    }
  }
  const rgba = s.match(RGBA_RE)
  if (rgba) {
    const r = clampByte(Number.parseFloat(rgba[1]))
    const g = clampByte(Number.parseFloat(rgba[2]))
    const b = clampByte(Number.parseFloat(rgba[3]))
    const rawAlpha = rgba[4]
    let alpha = 1
    if (rawAlpha !== undefined) {
      alpha = rawAlpha.endsWith("%")
        ? Number.parseFloat(rawAlpha) / 100
        : Number.parseFloat(rawAlpha)
    }
    return { r, g, b, alpha: clampAlpha(alpha) }
  }
  return FALLBACK
}

/** Always emits `rgba(R, G, B, A)` — matches the bundled shadow tokens. */
export function formatCssColor(c: RgbaColor): string {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${round3(c.alpha)})`
}

export function rgbToHex(c: RGB): string {
  return `#${byte(c.r)}${byte(c.g)}${byte(c.b)}`
}

export function hexToRgb(hex: string): RGB | null {
  const m = hex.trim().match(HEX_RE)
  if (!m) return null
  const h = m[1]
  if (h.length === 3) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
    }
  }
  if (h.length === 6) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    }
  }
  return null
}

function clampByte(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(255, Math.round(n)))
}

function clampAlpha(n: number): number {
  if (!Number.isFinite(n)) return 1
  return Math.max(0, Math.min(1, n))
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000
}

function byte(n: number): string {
  return clampByte(n).toString(16).padStart(2, "0")
}
