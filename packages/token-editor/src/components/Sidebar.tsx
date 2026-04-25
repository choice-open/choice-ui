import { SECTIONS, type SectionId } from "../sections"

type Props = {
  onPickPreset: (id: SectionId) => void
  onOpenExport: () => void
  onReset: () => void
  dirtyCount: number
}

export function Sidebar({ onPickPreset, onOpenExport, onReset, dirtyCount }: Props) {
  return (
    <aside className="flex flex-col gap-1 border-r border-border-default bg-background-default p-3">
      <div className="flex items-center justify-between px-2 py-2">
        <h1 className="text-body-large-strong tracking-tight">Token Editor</h1>
      </div>

      <div className="flex flex-col">
        {SECTIONS.map((section) => {
          const Indicator = section.Indicator
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onPickPreset(section.id)}
              className="group flex items-center justify-between rounded-md px-2 py-2 text-left transition hover:bg-background-component"
            >
              <span className="flex flex-col">
                <span className="text-body-small uppercase tracking-wide text-text-tertiary">
                  {section.label}
                </span>
                <span className="text-body-large-strong text-text-default">
                  {section.currentPreset}
                </span>
              </span>
              <span className="flex items-center text-text-secondary">
                <Indicator />
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-auto flex flex-col gap-1.5 px-2 pt-3">
        {dirtyCount > 0 ? (
          <div className="text-body-small leading-relaxed text-text-tertiary">
            {dirtyCount} edit{dirtyCount === 1 ? "" : "s"} pending · ⌘⇧R toggles live theme
          </div>
        ) : (
          <div className="text-body-small leading-relaxed text-text-tertiary">
            Pick a category to start. ⌘⇧R toggles live theme.
          </div>
        )}
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
            className="flex-[2] rounded border border-border-default bg-background-component px-2 py-1.5 text-body-medium-strong hover:bg-background-component-hover"
          >
            Export…
          </button>
        </div>
      </div>
    </aside>
  )
}
