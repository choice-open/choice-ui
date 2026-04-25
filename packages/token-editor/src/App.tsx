import { useState } from "react"
import { CustomizePanelDialog } from "./components/CustomizePanelDialog"
import { ExportDialog } from "./components/ExportDialog"
import { PresetPickerDialog } from "./components/PresetPickerDialog"
import { Sidebar } from "./components/Sidebar"
import { PreviewScene } from "./pages/preview/PreviewScene"
import type { SectionId } from "./sections"
import { useEditorStore } from "./state/store"
import { useLiveTheme } from "./theme/inject"

export function App() {
  useLiveTheme()
  const dirty = useEditorStore((s) => s.dirty)
  const reset = useEditorStore((s) => s.reset)
  const shuffle = useEditorStore((s) => s.shuffle)
  const [presetSection, setPresetSection] = useState<SectionId | null>(null)
  const [panelSection, setPanelSection] = useState<SectionId | null>(null)
  const [exportOpen, setExportOpen] = useState(false)

  return (
    <div className="grid h-dvh grid-cols-[260px_1fr] bg-background-default text-text-default">
      <Sidebar
        onPickPreset={setPresetSection}
        onOpenExport={() => setExportOpen(true)}
        onReset={reset}
        onShuffle={shuffle}
        dirtyCount={dirty.size}
      />
      <main className="overflow-auto">
        <PreviewScene />
      </main>

      <PresetPickerDialog
        sectionId={presetSection}
        onClose={() => setPresetSection(null)}
        onCustomize={() => {
          const id = presetSection
          setPresetSection(null)
          setPanelSection(id)
        }}
      />
      <CustomizePanelDialog
        sectionId={panelSection}
        onClose={() => setPanelSection(null)}
      />
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  )
}
