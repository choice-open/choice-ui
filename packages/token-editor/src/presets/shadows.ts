import type { Preset, PresetEdit } from "./types"

const FILE = "shadows-w3c.json" as const

const TOKEN_NAMES = [
  "xxs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "focus",
  "line",
  "border-default",
  "border-default-inset",
] as const

function noneEditsFor(name: (typeof TOKEN_NAMES)[number]): PresetEdit[] {
  // Empty layer array reads as "no shadow" via the terrazzo-config
  // empty-array branch (returns `none`). Apply to both modes to wipe
  // both light and dark.
  return [
    { kind: "mode", file: FILE, path: ["shadows", name], mode: "light", value: [] },
    { kind: "mode", file: FILE, path: ["shadows", name], mode: "dark", value: [] },
  ]
}

export const SHADOWS_PRESETS: Preset[] = [
  {
    id: "shadows.none",
    name: "None",
    description: "Strip every layer from every token — flat, paper-like surfaces.",
    edits: TOKEN_NAMES.flatMap(noneEditsFor),
  },
]
