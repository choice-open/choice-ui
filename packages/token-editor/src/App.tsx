import { useState, type ComponentType } from "react"
import { ExportDialog } from "./components/ExportDialog"
import { BreakpointsPage } from "./pages/breakpoints/BreakpointsPage"
import { ColorsPage } from "./pages/colors/ColorsPage"
import { RadiusPage } from "./pages/radius/RadiusPage"
import { ShadowsPage } from "./pages/shadows/ShadowsPage"
import { SpacingPage } from "./pages/spacing/SpacingPage"
import { TypographyPage } from "./pages/typography/TypographyPage"
import { ZIndexPage } from "./pages/zindex/ZIndexPage"
import { useEditorStore } from "./state/store"
import { useLiveTheme } from "./theme/inject"

const SECTIONS = [
  { id: "colors", label: "Colors", Page: ColorsPage },
  { id: "typography", label: "Typography", Page: TypographyPage },
  { id: "spacing", label: "Spacing", Page: SpacingPage },
  { id: "shadows", label: "Shadows", Page: ShadowsPage },
  { id: "radius", label: "Radius", Page: RadiusPage },
  { id: "breakpoints", label: "Breakpoints", Page: BreakpointsPage },
  { id: "zindex", label: "Z-Index", Page: ZIndexPage },
] as const satisfies ReadonlyArray<{
  id: string
  label: string
  Page: ComponentType
}>

type SectionId = (typeof SECTIONS)[number]["id"]

export function App() {
  useLiveTheme()
  const [section, setSection] = useState<SectionId>("colors")
  const [exportOpen, setExportOpen] = useState(false)
  const dirty = useEditorStore((s) => s.dirty)
  const reset = useEditorStore((s) => s.reset)

  const Page = SECTIONS.find((s) => s.id === section)!.Page

  return (
    <div className="grid h-dvh grid-cols-[220px_1fr] bg-background-default text-text-default">
      <aside className="flex flex-col gap-1 border-r border-border-default p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-sm font-semibold tracking-wide text-text-secondary">
            Token Editor
          </h1>
          {dirty.size > 0 ? (
            <button
              type="button"
              onClick={reset}
              className="text-[11px] text-text-tertiary hover:text-text-default"
              title="Discard all edits"
            >
              reset
            </button>
          ) : null}
        </div>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSection(s.id)}
            className={
              "rounded px-3 py-2 text-left text-sm hover:bg-background-component " +
              (section === s.id ? "bg-background-component" : "")
            }
          >
            {s.label}
          </button>
        ))}
        <div className="mt-auto flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setExportOpen(true)}
            className="rounded border border-border-default px-3 py-2 text-left text-sm hover:bg-background-component"
          >
            Export…
          </button>
          <div className="text-[11px] leading-relaxed text-text-tertiary">
            ⌘⇧R toggles live theme.
            <br />
            {dirty.size} edit{dirty.size === 1 ? "" : "s"} pending.
          </div>
        </div>
      </aside>
      <main className="overflow-auto">
        <Page />
      </main>
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  )
}
