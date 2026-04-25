import type { SectionId } from "../sections"
import { RADIUS_PRESETS } from "./radius"
import type { Preset } from "./types"

/**
 * Curated presets per section. Categories that don't have content yet
 * fall back to an empty list — the picker hides the preset rail and
 * the Customize button stays the only way in until the curated set
 * lands.
 */
export const PRESETS: Record<SectionId, Preset[]> = {
  colors: [],
  typography: [],
  spacing: [],
  shadows: [],
  radius: RADIUS_PRESETS,
  breakpoints: [],
  zindex: [],
}

export type { Preset, PresetEdit } from "./types"
