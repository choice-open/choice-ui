import type { Preset } from "./types"

const FILE = "spacing-w3c.json" as const

function preset(name: string, id: string, description: string, base: number): Preset {
  return {
    id,
    name,
    description,
    edits: [
      {
        kind: "value",
        file: FILE,
        path: ["spacing", "default"],
        value: { value: base, unit: "rem" },
      },
    ],
  }
}

export const SPACING_PRESETS: Preset[] = [
  preset(
    "Compact",
    "spacing.compact",
    "0.125rem base — denser layouts, tighter component padding.",
    0.125,
  ),
  preset(
    "Default",
    "spacing.default",
    "0.25rem base — bundled defaults across `spacing(N)`.",
    0.25,
  ),
  preset(
    "Comfortable",
    "spacing.comfortable",
    "0.375rem base — airier surfaces, more breathing room.",
    0.375,
  ),
]
