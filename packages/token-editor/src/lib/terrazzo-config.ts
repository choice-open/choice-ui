import css from "@terrazzo/plugin-css"
import { defineConfig } from "@terrazzo/parser"

// `@terrazzo/cli@0.10.5` declares its parser dep with an empty version range,
// so `@terrazzo/plugin-css` ends up typed against parser 2.x while our direct
// dep pins parser 0.10.5. Runtime is fine — both speak the same shape — but
// the two type trees don't align. We cast at the plugin boundary.

type TokenLike = {
  id?: string
  $type?: string
  $value?: unknown
  originalValue?: { $value?: unknown; $extensions?: { mode?: Record<string, unknown> } }
}

type ShadowLayer = {
  inset?: boolean
  offsetX?: string
  offsetY?: string
  blur?: string
  spread?: string
  color?: string
}

const cssPlugin = css({
  filename: "tokens.css",
  variableName: (token: unknown) => {
    const t = token as TokenLike
    const id = t.id ?? String(token)
    if (id === "spacing.default") return "--cdt-spacing"
    return `--cdt-${id.replace(/\./g, "-")}`
  },
  filter: (token: unknown) => {
    const skip = ["typography", "border", "transition", "gradient", "strokeStyle"]
    return !skip.includes((token as TokenLike).$type ?? "")
  },
  baseSelector: ":root",
  modeSelectors: [{ mode: "dark", selectors: [".dark", '[data-theme="dark"]'] }],
  transform(token: unknown, mode: string) {
    const t = token as TokenLike
    if (t.$type === "color") {
      const original = t.originalValue?.$value
      if (typeof original === "string" && original.includes("{")) return undefined
      const modeValue = t.originalValue?.$extensions?.mode?.[mode] as
        | { colorSpace?: string; components?: number[] }
        | undefined
      if (modeValue?.colorSpace === "srgb" && modeValue.components) {
        const [r, g, b] = modeValue.components
        return `${comp(r)}, ${comp(g)}, ${comp(b)}`
      }
      const v = t.$value as { colorSpace?: string; components?: number[] } | undefined
      if (v?.colorSpace === "srgb" && v.components) {
        const [r, g, b] = v.components
        return `${comp(r)}, ${comp(g)}, ${comp(b)}`
      }
    }
    if (t.$type === "shadow") {
      const modeValue = t.originalValue?.$extensions?.mode?.[mode]
      const shadowValue = (modeValue ?? t.originalValue?.$value) as
        | ShadowLayer
        | ShadowLayer[]
        | undefined
      if (!shadowValue) return undefined
      if (Array.isArray(shadowValue)) return shadowValue.map(layerToCss).join(", ")
      if (typeof shadowValue === "object") return layerToCss(shadowValue)
    }
    return undefined
  },
  // biome-ignore lint/suspicious/noExplicitAny: cross-version Plugin type bridge
} as any)

export function makeConfig() {
  return defineConfig(
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      plugins: [cssPlugin as any],
      outDir: "./",
    },
    { cwd: new URL("file:///") },
  )
}

function layerToCss(layer: ShadowLayer) {
  const parts: string[] = []
  if (layer.inset) parts.push("inset")
  parts.push(layer.offsetX ?? "0")
  parts.push(layer.offsetY ?? "0")
  parts.push(layer.blur ?? "0")
  if (layer.spread) parts.push(layer.spread)
  parts.push(layer.color ?? "transparent")
  return parts.join(" ")
}

function comp(n: number) {
  return Math.round(n * 255)
}
