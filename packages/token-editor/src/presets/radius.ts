import type { Preset } from "./types"

const FILE = "radius-w3c.json" as const

function dim(value: number): { value: number; unit: string } {
  return { value, unit: "rem" }
}

function radiusEdits(sm: number, md: number, lg: number, xl: number) {
  return [
    { kind: "value" as const, file: FILE, path: ["radius", "sm"], value: dim(sm) },
    { kind: "value" as const, file: FILE, path: ["radius", "md"], value: dim(md) },
    { kind: "value" as const, file: FILE, path: ["radius", "lg"], value: dim(lg) },
    { kind: "value" as const, file: FILE, path: ["radius", "xl"], value: dim(xl) },
  ]
}

export const RADIUS_PRESETS: Preset[] = [
  {
    id: "radius.none",
    name: "None",
    description: "Squared off — no corner rounding anywhere.",
    edits: radiusEdits(0, 0, 0, 0),
  },
  {
    id: "radius.subtle",
    name: "Subtle",
    description: "Halved scale. Barely-there rounding for content-heavy UIs.",
    edits: radiusEdits(0.0625, 0.125, 0.21875, 0.40625),
  },
  {
    id: "radius.default",
    name: "Default",
    description: "Bundled defaults — balanced rounding across components.",
    edits: radiusEdits(0.125, 0.3125, 0.4375, 0.8125),
  },
  {
    id: "radius.rounded",
    name: "Rounded",
    description: "Soft, friendly corners. Good for marketing surfaces.",
    edits: radiusEdits(0.25, 0.5, 0.75, 1.25),
  },
  {
    id: "radius.pill",
    name: "Pill",
    description: "Aggressive rounding — buttons become pills.",
    edits: radiusEdits(0.5, 1, 1.5, 9999),
  },
]
