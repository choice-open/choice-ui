import breakpoints from "../../../design-tokens/output/breakpoints-w3c.json"
import colors from "../../../design-tokens/output/colors-w3c.json"
import radius from "../../../design-tokens/output/radius-w3c.json"
import shadows from "../../../design-tokens/output/shadows-w3c.json"
import spacing from "../../../design-tokens/output/spacing-w3c.json"
import typography from "../../../design-tokens/output/typography-atomic-w3c.json"
import zindex from "../../../design-tokens/output/zindex-w3c.json"
import type { W3CTree } from "../lib/w3c"

export const TOKEN_FILES = {
  "colors-w3c.json": colors as unknown as W3CTree,
  "typography-atomic-w3c.json": typography as unknown as W3CTree,
  "spacing-w3c.json": spacing as unknown as W3CTree,
  "radius-w3c.json": radius as unknown as W3CTree,
  "zindex-w3c.json": zindex as unknown as W3CTree,
  "breakpoints-w3c.json": breakpoints as unknown as W3CTree,
  "shadows-w3c.json": shadows as unknown as W3CTree,
} as const

export type TokenFileName = keyof typeof TOKEN_FILES

export type TokenFiles = Record<TokenFileName, W3CTree>

export function cloneDefaults(): TokenFiles {
  return {
    "colors-w3c.json": structuredClone(TOKEN_FILES["colors-w3c.json"]),
    "typography-atomic-w3c.json": structuredClone(TOKEN_FILES["typography-atomic-w3c.json"]),
    "spacing-w3c.json": structuredClone(TOKEN_FILES["spacing-w3c.json"]),
    "radius-w3c.json": structuredClone(TOKEN_FILES["radius-w3c.json"]),
    "zindex-w3c.json": structuredClone(TOKEN_FILES["zindex-w3c.json"]),
    "breakpoints-w3c.json": structuredClone(TOKEN_FILES["breakpoints-w3c.json"]),
    "shadows-w3c.json": structuredClone(TOKEN_FILES["shadows-w3c.json"]),
  }
}
