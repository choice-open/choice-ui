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
  Indicator: ComponentType
  Page: ComponentType
}

export const SECTIONS: readonly Section[] = [
  { id: "colors", label: "Colors", Indicator: ColorsIndicator, Page: ColorsPage },
  {
    id: "typography",
    label: "Typography",
    Indicator: TypographyIndicator,
    Page: TypographyPage,
  },
  { id: "spacing", label: "Spacing", Indicator: SpacingIndicator, Page: SpacingPage },
  { id: "shadows", label: "Shadows", Indicator: ShadowsIndicator, Page: ShadowsPage },
  { id: "radius", label: "Radius", Indicator: RadiusIndicator, Page: RadiusPage },
  {
    id: "breakpoints",
    label: "Breakpoints",
    Indicator: BreakpointsIndicator,
    Page: BreakpointsPage,
  },
  { id: "zindex", label: "Z-Index", Indicator: ZIndexIndicator, Page: ZIndexPage },
] as const

export function getSection(id: SectionId): Section {
  const section = SECTIONS.find((s) => s.id === id)
  if (!section) throw new Error(`Unknown section: ${id}`)
  return section
}
