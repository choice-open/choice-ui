import { Dialog } from "@choice-ui/react"
import { getSection, type SectionId } from "../sections"

type Props = {
  sectionId: SectionId | null
  onClose: () => void
  onCustomize: () => void
}

export function PresetPickerDialog({ sectionId, onClose, onCustomize }: Props) {
  const open = sectionId !== null
  const section = sectionId ? getSection(sectionId) : null

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? null : onClose())}>
      <Dialog.Header title={section ? `${section.label} preset` : ""} />
      <Dialog.Content className="flex w-[380px] flex-col gap-3 p-4">
        {section ? (
          <>
            <p className="text-xs text-text-secondary">
              Pick a preset for this category, or customize every token by hand.
              Preset content lands in a follow-up commit.
            </p>
            <ul className="flex flex-col gap-1">
              {section.presets.map((preset) => (
                <li key={preset}>
                  <button
                    type="button"
                    disabled
                    className="flex w-full items-center justify-between rounded-md border border-border-default px-3 py-2 text-left text-sm opacity-60"
                    title="Presets are not wired up yet"
                  >
                    <span>{preset}</span>
                    <span className="text-[10px] uppercase text-text-tertiary">
                      coming soon
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-1 border-t border-border-default pt-3">
              <button
                type="button"
                onClick={onCustomize}
                className="w-full rounded-md bg-background-component px-3 py-2 text-sm font-medium hover:bg-background-component-hover"
              >
                Customize…
              </button>
              <p className="mt-1 text-[10px] text-text-tertiary">
                Edit every token in {section.label.toLowerCase()} individually.
              </p>
            </div>
          </>
        ) : null}
      </Dialog.Content>
    </Dialog>
  )
}
