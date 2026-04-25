import { List } from "@choice-ui/react"
import { SECTIONS, type SectionId } from "../sections"

type Props = {
  onPickPreset: (id: SectionId) => void
  onOpenExport: () => void
  onReset: () => void
  dirtyCount: number
}

export function Sidebar({ onPickPreset, onOpenExport, onReset, dirtyCount }: Props) {
  return (
    <aside className="flex flex-col border-r border-border-default bg-background-default p-3">
      <List className="flex-1">
        <List.Label>Token Editor</List.Label>
        <List.Divider />
        <List.Content>
          {SECTIONS.map((section) => {
            const Indicator = section.Indicator
            return (
              <List.Item
                key={section.id}
                suffixElement={<Indicator />}
                onClick={() => onPickPreset(section.id)}
              >
                <List.Value>
                  <span className="block text-body-small uppercase text-text-tertiary">
                    {section.label}
                  </span>
                  <span className="block text-body-large text-text-default">
                    {section.currentPreset}
                  </span>
                </List.Value>
              </List.Item>
            )
          })}
        </List.Content>
      </List>

      <div className="mt-3 flex flex-col gap-1.5 px-1">
        <div className="text-body-small text-text-tertiary">
          {dirtyCount > 0
            ? `${dirtyCount} edit${dirtyCount === 1 ? "" : "s"} pending · ⌘⇧R toggles live theme`
            : "Pick a category to start. ⌘⇧R toggles live theme."}
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onReset}
            disabled={dirtyCount === 0}
            className="flex-1 rounded border border-border-default px-2 py-1.5 text-body-medium hover:bg-background-component disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onOpenExport}
            className="flex-[2] rounded border border-border-default bg-background-component px-2 py-1.5 text-body-medium hover:bg-background-component-hover"
          >
            Export…
          </button>
        </div>
      </div>
    </aside>
  )
}
