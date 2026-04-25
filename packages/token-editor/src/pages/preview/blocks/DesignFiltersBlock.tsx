import { ChipsInput, Combobox, Segmented } from "@choice-ui/react"
import { useState } from "react"

const PROJECTS = ["Marketing site", "Product app", "Mobile", "Internal tools"]
type SortBy = "recent" | "name" | "edits"

export function DesignFiltersBlock() {
  const [project, setProject] = useState<string>("Product app")
  const [tags, setTags] = useState<string[]>(["color", "primary", "v0.4"])
  const [sortBy, setSortBy] = useState<SortBy>("recent")

  return (
    <section className="flex flex-col rounded-lg border border-border-default bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Filter
        </span>
        <h3 className="text-heading-small">Narrow the token list</h3>
      </header>
      <div className="flex flex-col gap-3 px-5 py-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-body-medium text-text-secondary">Project</span>
          <Combobox value={project} onChange={(v) => v && setProject(v)}>
            <Combobox.Trigger placeholder="Pick a project…" />
            <Combobox.Content>
              {PROJECTS.map((p) => (
                <Combobox.Item key={p} onClick={() => setProject(p)}>
                  <Combobox.Value>{p}</Combobox.Value>
                </Combobox.Item>
              ))}
            </Combobox.Content>
          </Combobox>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-body-medium text-text-secondary">Tags</span>
          <ChipsInput value={tags} onChange={setTags} placeholder="Add a tag…" />
        </label>
        <div className="flex flex-col gap-1.5">
          <span className="text-body-medium text-text-secondary">Sort by</span>
          <Segmented value={sortBy} onChange={(v) => setSortBy(v as SortBy)}>
            <Segmented.Item value="recent">Recent</Segmented.Item>
            <Segmented.Item value="name">Name</Segmented.Item>
            <Segmented.Item value="edits">Edits</Segmented.Item>
          </Segmented>
        </div>
      </div>
    </section>
  )
}
