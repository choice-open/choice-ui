import chroma from "chroma-js"
import { hslToRgb } from "./colors-convert"

type ColorValidationError = {
  message: string
  type: "invalid_format" | "invalid_value" | "parse_error"
}

export const validateHex = (
  hex: string,
): { alpha?: number; color: string; error?: ColorValidationError } => {
  try {
    // 检查不支持的颜色格式
    if (/^(?:ok)?lab\(.*\)$/.test(hex) || /^(?:ok)?lch\(.*\)$/.test(hex)) {
      return {
        color: "#000000",
        error: {
          type: "invalid_format",
          message: "Unsupported color format",
        },
      }
    }

    // 如果是颜色名称，使用 chroma 转换
    if (/^[a-zA-Z]+$/.test(hex)) {
      try {
        const color = chroma(hex)
        return { color: color.hex() }
      } catch {
        return {
          color: "#000000",
          error: {
            type: "invalid_value",
            message: "Invalid color name",
          },
        }
      }
    }

    // 尝试解析不同格式的颜色输入
    const rgbaMatch = hex.match(
      /^rgba?\(\s*(\d+(?:\.\d+)?)\s*(?:,|\s)\s*(\d+(?:\.\d+)?)\s*(?:,|\s)\s*(\d+(?:\.\d+)?)\s*(?:(?:,|\s*\/)\s*([0-9.]+%?))?\s*\)$/,
    )
    const hslaMatch = hex.match(
      /^hsla?\(\s*(\d+(?:\.\d+)?(?:deg|grad|rad|turn)?)\s*(?:,|\s)\s*(\d+(?:\.\d+)?%?)\s*(?:,|\s)\s*(\d+(?:\.\d+)?%?)\s*(?:(?:,|\s*\/)\s*([0-9.]+%?))?\s*\)$/,
    )
    const p3Match = hex.match(
      /^(?:color\()?display-p3\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+%?))?\s*\)?$/,
    )

    // 如果是 display-p3 格式
    if (p3Match) {
      const [, r, g, b, a] = p3Match
      const alpha = a ? Math.max(0, Math.min(1, parseFloat(a))) : undefined

      // 将 P3 值转换为 RGB
      const rValue = Math.round(parseFloat(r) * 255)
      const gValue = Math.round(parseFloat(g) * 255)
      const bValue = Math.round(parseFloat(b) * 255)

      return {
        color: `#${rValue.toString(16).padStart(2, "0")}${gValue.toString(16).padStart(2, "0")}${bValue.toString(16).padStart(2, "0")}`,
        alpha,
      }
    }

    // 如果是 RGBA 格式
    if (rgbaMatch) {
      const [, r, g, b, a] = rgbaMatch
      const alpha = a
        ? Math.max(
            0,
            Math.min(
              1,
              parseFloat(a.endsWith("%") ? a.slice(0, -1) : a) / (a.endsWith("%") ? 100 : 1),
            ),
          )
        : undefined

      // 验证 RGB 值是否在有效范围内
      const rValue = parseInt(r)
      const gValue = parseInt(g)
      const bValue = parseInt(b)

      if (rValue < 0 || rValue > 255 || gValue < 0 || gValue > 255 || bValue < 0 || bValue > 255) {
        return {
          color: "#000000",
          error: {
            type: "invalid_value",
            message: "RGB values must be between 0 and 255",
          },
        }
      }

      return {
        color: `#${rValue.toString(16).padStart(2, "0")}${gValue.toString(16).padStart(2, "0")}${bValue.toString(16).padStart(2, "0")}`,
        alpha,
      }
    }

    // 如果是 HSLA 格式
    if (hslaMatch) {
      const [, h, s, l, a] = hslaMatch
      const alpha = a
        ? Math.max(
            0,
            Math.min(
              1,
              parseFloat(a.endsWith("%") ? a.slice(0, -1) : a) / (a.endsWith("%") ? 100 : 1),
            ),
          )
        : undefined

      // 处理色相值，支持不同单位
      let hue = parseFloat(h)
      if (h.includes("grad")) {
        hue = (hue * 360) / 400
      } else if (h.includes("rad")) {
        hue = (hue * 180) / Math.PI
      } else if (h.includes("turn")) {
        hue = hue * 360
      }
      hue = Math.max(0, Math.min(360, hue))

      // 处理百分比值并确保在 0-100 范围内
      const saturation = Math.max(
        0,
        Math.min(100, parseFloat(s.endsWith("%") ? s.slice(0, -1) : s)),
      )
      const lightness = Math.max(0, Math.min(100, parseFloat(l.endsWith("%") ? l.slice(0, -1) : l)))

      // 验证 HSL 值是否有效
      if (isNaN(hue) || isNaN(saturation) || isNaN(lightness)) {
        return {
          color: "#000000",
          error: {
            type: "invalid_value",
            message: "Invalid HSL values",
          },
        }
      }

      // 转换 HSL 到 RGB
      const rgb = hslToRgb({
        h: hue,
        s: saturation,
        l: lightness,
      })

      // 确保 RGB 值在 0-255 范围内
      const r = Math.max(0, Math.min(255, Math.round(rgb.r)))
      const g = Math.max(0, Math.min(255, Math.round(rgb.g)))
      const b = Math.max(0, Math.min(255, Math.round(rgb.b)))

      return {
        color: `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
        alpha,
      }
    }

    // 如果 hex 格式
    if (hex) {
      try {
        const color = chroma(hex)
        const alpha = color.alpha()
        return {
          color: color.hex(),
          alpha: alpha < 1 ? alpha : undefined,
        }
      } catch {
        return {
          color: "#000000",
          error: {
            type: "invalid_format",
            message: "Invalid hex format",
          },
        }
      }
    }

    // 移除 # 和空白字符
    hex = hex.replace(/[#\s]/g, "")

    // 如果是空字符串，返回默认黑色
    if (!hex) {
      return {
        color: "#000000",
        error: {
          type: "invalid_format",
          message: "Empty color value",
        },
      }
    }

    // 检查是否包含无效字符
    if (!/^[0-9A-Fa-f]*$/.test(hex)) {
      return {
        color: "#000000",
        error: {
          type: "invalid_format",
          message: "Invalid hex characters",
        },
      }
    }

    // 处理不同长度的 hex 值
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("")
    } else if (hex.length !== 6) {
      return {
        color: "#000000",
        error: {
          type: "invalid_format",
          message: "Invalid hex length",
        },
      }
    }

    return { color: "#" + hex }
  } catch {
    return {
      color: "#000000",
      error: {
        type: "parse_error",
        message: "Failed to parse color",
      },
    }
  }
}
