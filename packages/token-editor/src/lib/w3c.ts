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

/**
 * Flat list of every leaf token (any `$type`) in the tree, preserving
 * walk order. Used by atomic single-mode panels (radius, breakpoints,
 * z-index, spacing) that don't need category/mode segmentation.
 */
export type AtomicEntry = { path: string[]; id: string; node: W3CTokenNode }

export function collectTokens(tree: W3CTree): AtomicEntry[] {
  const out: AtomicEntry[] = []
  walkAtomic(tree, [], out)
  return out
}

function walkAtomic(
  node: W3CTree | W3CTokenNode,
  path: string[],
  out: AtomicEntry[],
) {
  if (isTokenNode(node)) {
    out.push({ path, id: path.join("."), node })
    return
  }
  if (typeof node !== "object" || node === null) return
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue
    walkAtomic(v as W3CTree | W3CTokenNode, [...path, k], out)
  }
}

export function getNodeAtPath(tree: W3CTree, path: string[]): unknown {
  let cursor: unknown = tree
  for (const key of path) {
    if (typeof cursor !== "object" || cursor === null) return undefined
    cursor = (cursor as Record<string, unknown>)[key]
  }
  return cursor
}

export type ColorMode = "light" | "dark"

export type ColorEntry = {
  path: string[]
  id: string
  category: string
  /** Raw light-mode value (alias string or srgb), preferring $extensions.mode.light over $value. */
  lightRaw: W3CColorTokenValue
  light: W3CColorValue | null
  lightIsAlias: boolean
  /** Raw dark-mode value (alias string or srgb), preferring $extensions.mode.dark over $value. */
  darkRaw: W3CColorTokenValue
  dark: W3CColorValue | null
  darkIsAlias: boolean
  defaultValue: W3CColorTokenValue
}

const RESOLVE_DEPTH_LIMIT = 16

/**
 * Walk an alias chain to its underlying srgb value, preferring mode-specific
 * overrides at every hop. Returns `null` for missing references, cycles, or
 * non-srgb leaves.
 */
export function resolveColorValue(
  tree: W3CTree,
  value: W3CColorTokenValue,
  mode: ColorMode,
  depth = 0,
): W3CColorValue | null {
  if (depth > RESOLVE_DEPTH_LIMIT) return null
  if (isSrgbValue(value)) return value
  if (!isAlias(value)) return null
  const ref = value.slice(1, -1).split(".")
  const node = getNodeAtPath(tree, ref)
  if (!isTokenNode(node)) return null
  const modeOverride = (node as W3CColorToken).$extensions?.mode?.[mode]
  const next = (modeOverride ?? node.$value) as W3CColorTokenValue | undefined
  if (next === undefined) return null
  return resolveColorValue(tree, next, mode, depth + 1)
}

/**
 * List every alias-able primitive in a colors tree: tokens whose own
 * `$value` is a concrete srgb color. These are the leaves of the alias graph
 * and the only sensible targets for a semantic alias.
 */
export type PrimitiveOption = {
  path: string[]
  id: string
  alias: string
  light: W3CColorValue | null
  dark: W3CColorValue | null
}

export function collectPrimitiveOptions(tree: W3CTree): PrimitiveOption[] {
  const out: PrimitiveOption[] = []
  walkPrimitive(tree, [], out)
  return out
}

function walkPrimitive(node: W3CTree | W3CTokenNode, path: string[], out: PrimitiveOption[]) {
  if (isTokenNode(node) && node.$type === "color") {
    if (isSrgbValue(node.$value)) {
      const token = node as W3CColorToken
      const lightRaw = token.$extensions?.mode?.light ?? token.$value
      const darkRaw = token.$extensions?.mode?.dark ?? token.$value
      out.push({
        path,
        id: path.join("."),
        alias: `{${path.join(".")}}`,
        light: isSrgbValue(lightRaw) ? lightRaw : null,
        dark: isSrgbValue(darkRaw) ? darkRaw : null,
      })
    }
    return
  }
  if (typeof node !== "object" || node === null) return
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue
    walkPrimitive(child as W3CTree | W3CTokenNode, [...path, key], out)
  }
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
    const lightRaw = (mode?.light ?? token.$value) as W3CColorTokenValue
    const darkRaw = (mode?.dark ?? token.$value) as W3CColorTokenValue
    const category =
      token.$extensions?.["choiceform.design-system"]?.category ?? "uncategorized"
    out.push({
      path,
      id: path.join("."),
      category,
      lightRaw,
      light: isSrgbValue(lightRaw) ? lightRaw : null,
      lightIsAlias: isAlias(lightRaw),
      darkRaw,
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
