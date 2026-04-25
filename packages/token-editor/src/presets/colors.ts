import type { Preset, PresetEdit } from "./types"

const FILE = "colors-w3c.json" as const

/**
 * Build the seven brand-related semantic token writes for a given hue.
 * Categories like success / warning / danger keep their bundled hues
 * (those are state colors, not brand) so a preset only swaps the
 * accent surface area.
 */
function accentSwap(hue: string, paleHue: string): PresetEdit[] {
  const ref = (stop: string) => `{color.${hue}.${stop}}`
  const paleRef = (stop: string) => `{color.${paleHue}.${stop}}`
  return [
    {
      kind: "value",
      file: FILE,
      path: ["color", "background", "accent"],
      value: ref("500"),
    },
    {
      kind: "value",
      file: FILE,
      path: ["color", "background", "accent-hover"],
      value: ref("600"),
    },
    {
      kind: "value",
      file: FILE,
      path: ["color", "background", "accent-secondary"],
      value: ref("700"),
    },
    {
      kind: "value",
      file: FILE,
      path: ["color", "border", "selected"],
      value: ref("500"),
    },
    {
      kind: "mode",
      file: FILE,
      path: ["color", "text", "accent"],
      mode: "light",
      value: ref("600"),
    },
    {
      kind: "mode",
      file: FILE,
      path: ["color", "text", "accent"],
      mode: "dark",
      value: ref("400"),
    },
    {
      kind: "mode",
      file: FILE,
      path: ["color", "background", "selected"],
      mode: "light",
      value: ref("200"),
    },
    {
      kind: "mode",
      file: FILE,
      path: ["color", "background", "selected"],
      mode: "dark",
      value: paleRef("700"),
    },
    {
      kind: "mode",
      file: FILE,
      path: ["color", "border", "selected-strong"],
      mode: "light",
      value: ref("600"),
    },
    {
      kind: "mode",
      file: FILE,
      path: ["color", "border", "selected-strong"],
      mode: "dark",
      value: ref("400"),
    },
  ]
}

export const COLORS_PRESETS: Preset[] = [
  {
    id: "colors.default",
    name: "Default",
    description: "Bundled blue accent — the design-system baseline.",
    edits: accentSwap("blue", "blue-pale"),
  },
  {
    id: "colors.forest",
    name: "Forest",
    description: "Green accent. Status colors (success / warning / danger) stay put.",
    edits: accentSwap("green", "green-pale"),
  },
  {
    id: "colors.sunset",
    name: "Sunset",
    description: "Warm orange accent. Reads loud against neutral surfaces.",
    edits: accentSwap("orange", "orange-pale"),
  },
  {
    id: "colors.monochrome",
    name: "Monochrome",
    description: "Neutral accent — UI recedes; content carries the color.",
    // `neutrals` has no `-pale` companion; reuse `neutrals` for both
    // surfaces. Selected-on-dark loses its blue-pale lift, but that's
    // the point of a monochrome preset.
    edits: accentSwap("neutrals", "neutrals"),
  },
]
