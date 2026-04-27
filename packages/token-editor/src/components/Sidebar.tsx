import { IconButton, List, Tooltip } from "@choice-ui/react"
import { ThemeMoonDark, ThemeSunBright } from "@choiceform/icons-react"
import { PRESETS } from "../presets"
import { SECTIONS, type SectionId } from "../sections"
import { useEditorStore } from "../state/store"

type Props = {
  onPickPreset: (id: SectionId) => void
  onOpenExport: () => void
  onReset: () => void
  onShuffle: () => void
  dirtyCount: number
}

const FILE_BY_SECTION: Record<SectionId, string> = {
  colors: "colors-w3c.json",
  typography: "typography-atomic-w3c.json",
  spacing: "spacing-w3c.json",
  shadows: "shadows-w3c.json",
  radius: "radius-w3c.json",
  breakpoints: "breakpoints-w3c.json",
  zindex: "zindex-w3c.json",
}

export function Sidebar({
  onPickPreset,
  onOpenExport,
  onReset,
  onShuffle,
  dirtyCount,
}: Props) {
  const activePresets = useEditorStore((s) => s.activePresets)
  const dirty = useEditorStore((s) => s.dirty)
  const mode = useEditorStore((s) => s.mode)
  const setMode = useEditorStore((s) => s.setMode)
  const isDark = mode === "dark"

  return (
    <aside className="flex flex-col border-r border-border-default bg-background-default p-3">
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <span className="text-body-medium text-text-secondary">Token Editor</span>
        <Tooltip
          content={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <IconButton
            variant="ghost"
            aria-label="Toggle theme"
            onClick={() => setMode(isDark ? "light" : "dark")}
          >
            {isDark ? <ThemeMoonDark /> : <ThemeSunBright />}
          </IconButton>
        </Tooltip>
      </div>
      <List className="flex-1">
        <List.Content>
          {SECTIONS.map((section) => {
            const Indicator = section.Indicator
            const label = presetLabel(section.id, activePresets, dirty)
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
                  <span className="block text-body-large text-text-default">{label}</span>
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
            onClick={onShuffle}
            className="flex-1 rounded border border-border-default px-2 py-1.5 text-body-medium hover:bg-background-component"
            title="Pick a random preset for every category"
          >
            Shuffle
          </button>
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

function presetLabel(
  sectionId: SectionId,
  activePresets: Record<SectionId, string | null>,
  dirty: Set<string>,
): string {
  const activeId = activePresets[sectionId]
  if (activeId) {
    return PRESETS[sectionId].find((p) => p.id === activeId)?.name ?? "Custom"
  }
  return isSectionDirty(sectionId, dirty) ? "Custom" : "Default"
}

function isSectionDirty(sectionId: SectionId, dirty: Set<string>): boolean {
  const prefix = FILE_BY_SECTION[sectionId] + "#"
  for (const key of dirty) {
    if (key.startsWith(prefix)) return true
  }
  return false
}
