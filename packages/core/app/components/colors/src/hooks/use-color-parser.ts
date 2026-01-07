import chroma from "chroma-js"

interface ColorParseResult {
  alpha: number
  color: chroma.Color | null
  hasAlpha: boolean
}

export function useColorParser() {
  const parseOklab = (value: string): ColorParseResult => {
    const oklabMatch = value.match(
      /oklab\(([\d.]+)%?\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([\d.]+)%?)?\)/,
    )
    if (oklabMatch) {
      const [, l, a, b, alphaValue] = oklabMatch
      const L = parseFloat(l) / 100 // Convert from percentage
      const A = parseFloat(a)
      const B = parseFloat(b)
      return {
        color: chroma.oklab(L, A, B),
        hasAlpha: !!alphaValue,
        alpha: alphaValue ? parseFloat(alphaValue) / 100 : 1,
      }
    }
    return { color: null, hasAlpha: false, alpha: 1 }
  }

  const parseOklch = (value: string): ColorParseResult => {
    const oklchMatch = value.match(
      /oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)deg(?:\s*\/\s*([\d.]+)%?)?\)/,
    )
    if (oklchMatch) {
      const [, l, c, h, alphaValue] = oklchMatch
      const L = parseFloat(l) / 100 // Convert from percentage
      const C = parseFloat(c)
      const H = parseFloat(h)
      return {
        color: chroma.oklch(L, C, H),
        hasAlpha: !!alphaValue,
        alpha: alphaValue ? parseFloat(alphaValue) / 100 : 1,
      }
    }
    return { color: null, hasAlpha: false, alpha: 1 }
  }

  const parseLab = (value: string): ColorParseResult => {
    const labMatch = value.match(/lab\(([\d.]+)%?\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([\d.]+)%?)?\)/)
    if (labMatch) {
      const [, l, a, b, alphaValue] = labMatch
      return {
        color: chroma.lab(parseFloat(l), parseFloat(a), parseFloat(b)),
        hasAlpha: !!alphaValue,
        alpha: alphaValue ? parseFloat(alphaValue) / 100 : 1,
      }
    }
    return { color: null, hasAlpha: false, alpha: 1 }
  }

  const parseLch = (value: string): ColorParseResult => {
    const lchMatch = value.match(
      /lch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)deg(?:\s*\/\s*([\d.]+)%?)?\)/,
    )
    if (lchMatch) {
      const [, l, c, h, alphaValue] = lchMatch
      const hRad = (parseFloat(h) * Math.PI) / 180 // 将角度转换为弧度
      const a = parseFloat(c) * Math.cos(hRad)
      const b = parseFloat(c) * Math.sin(hRad)
      return {
        color: chroma.lab(parseFloat(l), a, b),
        hasAlpha: !!alphaValue,
        alpha: alphaValue ? parseFloat(alphaValue) / 100 : 1,
      }
    }
    return { color: null, hasAlpha: false, alpha: 1 }
  }

  const parseHsl = (value: string): ColorParseResult => {
    const processedHsl = value
      .replace(/(\d+)deg/g, "$1") // 移除 deg 单位
      .replace(/hsla?\((.*?)\)/, (_: string, p1: string) => {
        const parts = p1
          .split(/[\s,]+/)
          .filter(Boolean)
          .map((part: string) => part.trim())
        if (parts.length === 4) {
          // HSLA 格式
          return `hsl(${parts[0]}, ${parts[1]}, ${parts[2]})`
        }
        // HSL 格式
        return `hsl(${parts.join(", ")})`
      })

    try {
      const color = chroma(processedHsl)
      const hasAlpha = value.startsWith("hsla") || value.includes("/")
      let alpha = 1
      if (hasAlpha) {
        const alphaMatch = value.match(/\/\s*([\d.]+)%?\s*\)$/)
        if (alphaMatch) {
          alpha = parseFloat(alphaMatch[1]) / (alphaMatch[1].includes("%") ? 100 : 1)
        }
      }
      return { color, hasAlpha, alpha }
    } catch {
      return { color: null, hasAlpha: false, alpha: 1 }
    }
  }

  const parseDisplayP3 = (value: string): ColorParseResult => {
    const p3Match = value.match(
      /color\(display-p3\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/,
    )
    if (p3Match) {
      const [, r, g, b, alphaValue] = p3Match
      const rgb = {
        r: Math.round(parseFloat(r) * 255),
        g: Math.round(parseFloat(g) * 255),
        b: Math.round(parseFloat(b) * 255),
      }
      return {
        color: chroma(rgb),
        hasAlpha: !!alphaValue,
        alpha: alphaValue ? parseFloat(alphaValue) : 1,
      }
    }
    return { color: null, hasAlpha: false, alpha: 1 }
  }

  const parseColor = (value: string): ColorParseResult => {
    if (value.startsWith("oklab(")) {
      return parseOklab(value)
    }
    if (value.startsWith("oklch(")) {
      return parseOklch(value)
    }
    if (value.startsWith("lab(")) {
      return parseLab(value)
    }
    if (value.startsWith("lch(")) {
      return parseLch(value)
    }
    if (value.startsWith("hsl")) {
      return parseHsl(value)
    }
    if (value.startsWith("color(display-p3")) {
      return parseDisplayP3(value)
    }

    try {
      const color = chroma(value)
      const alpha = color.alpha()
      return {
        color,
        hasAlpha: alpha < 1,
        alpha,
      }
    } catch {
      return { color: null, hasAlpha: false, alpha: 1 }
    }
  }

  return {
    parseColor,
  }
}
