import type { TokenFileName } from "../tokens/defaults"

/**
 * One of the writes a preset applies. Maps cleanly onto the store's two
 * existing setters: `kind: "value"` → `setTokenValue`, `kind: "mode"` →
 * `setModeValue`. A single preset can mix both kinds (e.g. shadows
 * write to mode, but a wrapping radius preset writes plain values).
 */
export type PresetEdit =
  | { kind: "value"; file: TokenFileName; path: string[]; value: unknown }
  | {
      kind: "mode"
      file: TokenFileName
      path: string[]
      mode: "light" | "dark"
      value: unknown
    }

export type Preset = {
  id: string
  name: string
  description?: string
  edits: PresetEdit[]
}
