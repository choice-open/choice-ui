import type { Preset } from "./types"

const FILE = "breakpoints-w3c.json" as const

function dim(value: number) {
  return { value, unit: "rem" }
}

function bpEdits(xs: number, sm: number, md: number, lg: number, xl: number, xxl: number) {
  return [
    { kind: "value" as const, file: FILE, path: ["breakpoints", "xs"], value: dim(xs) },
    { kind: "value" as const, file: FILE, path: ["breakpoints", "sm"], value: dim(sm) },
    { kind: "value" as const, file: FILE, path: ["breakpoints", "md"], value: dim(md) },
    { kind: "value" as const, file: FILE, path: ["breakpoints", "lg"], value: dim(lg) },
    { kind: "value" as const, file: FILE, path: ["breakpoints", "xl"], value: dim(xl) },
    { kind: "value" as const, file: FILE, path: ["breakpoints", "2xl"], value: dim(xxl) },
  ]
}

export const BREAKPOINTS_PRESETS: Preset[] = [
  {
    id: "breakpoints.tight",
    name: "Tight",
    description: "Earlier responsive triggers — designs collapse sooner.",
    edits: bpEdits(24, 32, 40, 56, 72, 88),
  },
  {
    id: "breakpoints.default",
    name: "Default",
    description: "Bundled defaults — desktop-first scale.",
    edits: bpEdits(29.6875, 40, 48, 64, 80, 96),
  },
  {
    id: "breakpoints.wide",
    name: "Wide",
    description: "Later triggers — keeps wider layouts longer before collapse.",
    edits: bpEdits(36, 48, 60, 80, 100, 120),
  },
]
