import { Dialog } from "@choice-ui/react"
import { PRESETS } from "../presets"
import { getSection, type SectionId } from "../sections"
import { useEditorStore } from "../state/store"

type Props = {
  sectionId: SectionId | null
  onClose: () => void
  onCustomize: () => void
}

export function PresetPickerDialog({ sectionId, onClose, onCustomize }: Props) {
  const open = sectionId !== null
  const section = sectionId ? getSection(sectionId) : null
  const activeId = useEditorStore((s) =>
    sectionId ? s.activePresets[sectionId] : null,
  )
  const applyPreset = useEditorStore((s) => s.applyPreset)
  const presets = sectionId ? PRESETS[sectionId] : []

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? null : onClose())}>
      <Dialog.Header title={section ? `${section.label} preset` : ""} />
      <Dialog.Content className="flex w-[380px] flex-col gap-3 p-4">
        {section && sectionId ? (
          <>
            <p className="text-body-medium text-text-secondary">
              Pick a preset, or open the full editor to set every token by hand.
            </p>
            {presets.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {presets.map((preset) => {
                  const isActive = preset.id === activeId
                  return (
                    <li key={preset.id}>
                      <button
                        type="button"
                        onClick={() => {
                          applyPreset(sectionId, preset)
                          onClose()
                        }}
                        className={
                          "flex w-full flex-col gap-0.5 rounded-md px-3 py-2 text-left transition " +
                          (isActive
                            ? "bg-background-accent-secondary text-text-on-accent"
                            : "hover:bg-background-component")
                        }
                      >
                        <span className="flex items-center justify-between">
                          <span className="text-body-large">{preset.name}</span>
                          {isActive ? (
                            <span className="text-body-small uppercase">active</span>
                          ) : null}
                        </span>
                        {preset.description ? (
                          <span
                            className={
                              "text-body-medium " +
                              (isActive ? "text-text-on-accent" : "text-text-secondary")
                            }
                          >
                            {preset.description}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="rounded-md bg-background-component/40 px-3 py-2 text-body-medium text-text-tertiary">
                No curated presets yet for {section.label.toLowerCase()}. Use
                Customize for full control.
              </div>
            )}
            <div className="mt-1 border-t border-border-default pt-3">
              <button
                type="button"
                onClick={onCustomize}
                className="w-full rounded-md bg-background-component px-3 py-2 text-body-large hover:bg-background-component-hover"
              >
                Customize…
              </button>
              <p className="mt-1 text-body-small text-text-tertiary">
                Edit every token in {section.label.toLowerCase()} individually.
              </p>
            </div>
          </>
        ) : null}
      </Dialog.Content>
    </Dialog>
  )
}
