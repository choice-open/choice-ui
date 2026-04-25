export type W3CColorValue = {
  colorSpace: "srgb"
  components: [number, number, number]
  alpha?: number
  hex?: string
}

export type W3CAlias = string

export type W3CColorTokenValue = W3CColorValue | W3CAlias

export type W3CColorToken = {
  $type: "color"
  $value: W3CColorTokenValue
  $description?: string
  $extensions?: {
    "choiceform.design-system"?: { category?: string }
    mode?: {
      light?: W3CColorTokenValue
      dark?: W3CColorTokenValue
    }
  }
}

export type W3CTokenNode = {
  $type?: string
  $value?: unknown
  $description?: string
  $extensions?: Record<string, unknown>
}

export type W3CTree = {
  [key: string]: W3CTree | W3CTokenNode
}

export function isTokenNode(value: unknown): value is W3CTokenNode {
  return (
    typeof value === "object" &&
    value !== null &&
    "$type" in value &&
    "$value" in value
  )
}

export function isAlias(value: unknown): value is W3CAlias {
  return typeof value === "string" && value.includes("{") && value.includes("}")
}

export function isSrgbValue(value: unknown): value is W3CColorValue {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { colorSpace?: unknown }).colorSpace === "srgb" &&
    Array.isArray((value as { components?: unknown }).components)
  )
}

export type RGB = { r: number; g: number; b: number }

export function srgbToRgb(value: W3CColorValue): RGB {
  const [r, g, b] = value.components
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

export function rgbToSrgb(rgb: RGB, alpha = 1): W3CColorValue {
  const r = clamp01(rgb.r / 255)
  const g = clamp01(rgb.g / 255)
  const b = clamp01(rgb.b / 255)
  return {
    colorSpace: "srgb",
    components: [round3(r), round3(g), round3(b)],
    alpha,
    hex: rgbToHex(rgb),
  }
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

function round3(n: number) {
  return Math.round(n * 1000) / 1000
}

function rgbToHex({ r, g, b }: RGB) {
  const h = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0")
  return `#${h(r)}${h(g)}${h(b)}`
}

export function getNodeAtPath(tree: W3CTree, path: string[]): unknown {
  let cursor: unknown = tree
  for (const key of path) {
    if (typeof cursor !== "object" || cursor === null) return undefined
    cursor = (cursor as Record<string, unknown>)[key]
  }
  return cursor
}

export type ColorEntry = {
  path: string[]
  id: string
  category: string
  light: W3CColorValue | null
  lightIsAlias: boolean
  dark: W3CColorValue | null
  darkIsAlias: boolean
  defaultValue: W3CColorTokenValue
}

export function collectColorTokens(tree: W3CTree): ColorEntry[] {
  const out: ColorEntry[] = []
  walk(tree, [], out)
  return out
}

function walk(node: W3CTree | W3CTokenNode, path: string[], out: ColorEntry[]) {
  if (isTokenNode(node) && node.$type === "color") {
    const token = node as W3CColorToken
    const mode = token.$extensions?.mode
    const lightRaw = mode?.light ?? token.$value
    const darkRaw = mode?.dark ?? token.$value
    const category =
      token.$extensions?.["choiceform.design-system"]?.category ?? "uncategorized"
    out.push({
      path,
      id: path.join("."),
      category,
      light: isSrgbValue(lightRaw) ? lightRaw : null,
      lightIsAlias: isAlias(lightRaw),
      dark: isSrgbValue(darkRaw) ? darkRaw : null,
      darkIsAlias: isAlias(darkRaw),
      defaultValue: token.$value,
    })
    return
  }
  if (typeof node !== "object" || node === null) return
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue
    walk(child as W3CTree | W3CTokenNode, [...path, key], out)
  }
}
