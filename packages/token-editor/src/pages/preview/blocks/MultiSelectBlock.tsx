import { Chip, MultiSelect } from "@choice-ui/react"
import { useState } from "react"

const SCOPES = [
  { id: "color", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "shadows", label: "Shadows" },
  { id: "radius", label: "Radius" },
  { id: "breakpoints", label: "Breakpoints" },
  { id: "zindex", label: "Z-Index" },
]

export function MultiSelectBlock() {
  const [selected, setSelected] = useState<string[]>(["color", "spacing"])
  const labels = (id: string) => SCOPES.find((s) => s.id === id)?.label ?? id

  return (
    <section className="flex flex-col rounded-lg border border-border-default bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Diff scope
        </span>
        <h3 className="text-heading-small">Pick token files to include</h3>
      </header>
      <div className="flex flex-col gap-3 px-5 py-4">
        <MultiSelect values={selected} onChange={setSelected}>
          <MultiSelect.Trigger
            placeholder="Pick categories…"
            getDisplayValue={labels}
          />
          <MultiSelect.Content>
            <MultiSelect.Label>Available categories</MultiSelect.Label>
            {SCOPES.map((s) => (
              <MultiSelect.Item key={s.id} value={s.id}>
                {s.label}
              </MultiSelect.Item>
            ))}
          </MultiSelect.Content>
        </MultiSelect>
        <div className="flex flex-wrap gap-1.5">
          {selected.length === 0 ? (
            <span className="text-body-small text-text-tertiary">
              No categories selected — diff will include everything.
            </span>
          ) : (
            selected.map((id) => (
              <Chip
                key={id}
                onRemove={() => setSelected((prev) => prev.filter((x) => x !== id))}
              >
                {labels(id)}
              </Chip>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
