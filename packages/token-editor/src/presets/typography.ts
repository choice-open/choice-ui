import type { Preset } from "./types"

const FILE = "typography-atomic-w3c.json" as const

const SYSTEM_SANS = [
  "ui-sans-serif",
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Helvetica Neue",
  "Arial",
  "sans-serif",
]
const SYSTEM_MONO = [
  "ui-monospace",
  "SFMono-Regular",
  "Menlo",
  "Monaco",
  "Consolas",
  "Liberation Mono",
  "Courier New",
  "monospace",
]

function families(defaultFamily: string, displayFamily: string, monoFamily: string): Preset["edits"] {
  return [
    {
      kind: "value",
      file: FILE,
      path: ["font", "families", "default"],
      value: [defaultFamily, ...SYSTEM_SANS],
    },
    {
      kind: "value",
      file: FILE,
      path: ["font", "families", "display"],
      value: [displayFamily, ...SYSTEM_SANS],
    },
    {
      kind: "value",
      file: FILE,
      path: ["font", "families", "mono"],
      value: [monoFamily, ...SYSTEM_MONO],
    },
  ]
}

export const TYPOGRAPHY_PRESETS: Preset[] = [
  {
    id: "typography.default",
    name: "Default",
    description: "Inter for body, Whyte for display, Roboto Mono for code.",
    edits: families("Inter", "Whyte", "Roboto Mono"),
  },
  {
    id: "typography.geist",
    name: "Geist",
    description: "Vercel's Geist family across body, display, and code.",
    edits: families("Geist", "Geist", "Geist Mono"),
  },
  {
    id: "typography.ibm-plex",
    name: "IBM Plex",
    description: "IBM Plex Sans + Plex Mono — neutral, technical voice.",
    edits: families("IBM Plex Sans", "IBM Plex Sans", "IBM Plex Mono"),
  },
  {
    id: "typography.system",
    name: "System",
    description: "Native UI fonts only — no web font loading at all.",
    edits: [
      {
        kind: "value",
        file: FILE,
        path: ["font", "families", "default"],
        value: SYSTEM_SANS,
      },
      {
        kind: "value",
        file: FILE,
        path: ["font", "families", "display"],
        value: SYSTEM_SANS,
      },
      {
        kind: "value",
        file: FILE,
        path: ["font", "families", "mono"],
        value: SYSTEM_MONO,
      },
    ],
  },
]
