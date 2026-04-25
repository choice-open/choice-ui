import type { ComponentType } from "react"
import { BreakpointsPage } from "./pages/breakpoints/BreakpointsPage"
import { ColorsPage } from "./pages/colors/ColorsPage"
import { RadiusPage } from "./pages/radius/RadiusPage"
import { ShadowsPage } from "./pages/shadows/ShadowsPage"
import { SpacingPage } from "./pages/spacing/SpacingPage"
import { TypographyPage } from "./pages/typography/TypographyPage"
import { ZIndexPage } from "./pages/zindex/ZIndexPage"
import {
  BreakpointsIndicator,
  ColorsIndicator,
  RadiusIndicator,
  ShadowsIndicator,
  SpacingIndicator,
  TypographyIndicator,
  ZIndexIndicator,
} from "./components/SectionIndicators"

export type SectionId =
  | "colors"
  | "typography"
  | "spacing"
  | "shadows"
  | "radius"
  | "breakpoints"
  | "zindex"

export type Section = {
  id: SectionId
  label: string
  /** Placeholder until commit 4 fills in the real preset system. */
  currentPreset: string
  Indicator: ComponentType
  Page: ComponentType
  /** Preset names shown by `PresetPickerDialog`. Real values land in commit 4. */
  presets: string[]
}

export const SECTIONS: readonly Section[] = [
  {
    id: "colors",
    label: "Colors",
    currentPreset: "Default",
    Indicator: ColorsIndicator,
    Page: ColorsPage,
    presets: ["Default", "Ocean", "Forest", "Sunset", "Monochrome"],
  },
  {
    id: "typography",
    label: "Typography",
    currentPreset: "Default",
    Indicator: TypographyIndicator,
    Page: TypographyPage,
    presets: ["Default", "Geist", "IBM Plex", "System"],
  },
  {
    id: "spacing",
    label: "Spacing",
    currentPreset: "Default",
    Indicator: SpacingIndicator,
    Page: SpacingPage,
    presets: ["Compact", "Default", "Comfortable"],
  },
  {
    id: "shadows",
    label: "Shadows",
    currentPreset: "Default",
    Indicator: ShadowsIndicator,
    Page: ShadowsPage,
    presets: ["Soft", "Sharp", "Diffused", "None"],
  },
  {
    id: "radius",
    label: "Radius",
    currentPreset: "Default",
    Indicator: RadiusIndicator,
    Page: RadiusPage,
    presets: ["None", "Subtle", "Default", "Rounded", "Pill"],
  },
  {
    id: "breakpoints",
    label: "Breakpoints",
    currentPreset: "Default",
    Indicator: BreakpointsIndicator,
    Page: BreakpointsPage,
    presets: ["Default", "Wide", "Tight"],
  },
  {
    id: "zindex",
    label: "Z-Index",
    currentPreset: "Default",
    Indicator: ZIndexIndicator,
    Page: ZIndexPage,
    presets: ["Default"],
  },
] as const

export function getSection(id: SectionId): Section {
  const section = SECTIONS.find((s) => s.id === id)
  if (!section) throw new Error(`Unknown section: ${id}`)
  return section
}
