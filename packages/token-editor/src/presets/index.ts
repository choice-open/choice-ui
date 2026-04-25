import type { SectionId } from "../sections"
import { BREAKPOINTS_PRESETS } from "./breakpoints"
import { COLORS_PRESETS } from "./colors"
import { RADIUS_PRESETS } from "./radius"
import { SHADOWS_PRESETS } from "./shadows"
import { SPACING_PRESETS } from "./spacing"
import { TYPOGRAPHY_PRESETS } from "./typography"
import type { Preset } from "./types"

/**
 * Curated presets per section. Categories without content (today: just
 * z-index, where there isn't an obvious aesthetic axis) fall back to
 * an empty list and the picker shows a "no curated presets yet"
 * placeholder above the Customize escape hatch.
 */
export const PRESETS: Record<SectionId, Preset[]> = {
  colors: COLORS_PRESETS,
  typography: TYPOGRAPHY_PRESETS,
  spacing: SPACING_PRESETS,
  shadows: SHADOWS_PRESETS,
  radius: RADIUS_PRESETS,
  breakpoints: BREAKPOINTS_PRESETS,
  zindex: [],
}

export type { Preset, PresetEdit } from "./types"
