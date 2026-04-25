import { useMemo } from "react"
import { isTokenNode, type W3CTokenNode, type W3CTree } from "../../lib/w3c"
import { useEditorStore } from "../../state/store"

type AtomicEntry = {
  path: string[]
  id: string
  group: string
  $type: string
  node: W3CTokenNode
}

type DimensionValue = { value: number; unit: string }

export function TypographyPage() {
  const tree = useEditorStore((s) => s.files["typography-atomic-w3c.json"])
  const setTokenValue = useEditorStore((s) => s.setTokenValue)
  const dirty = useEditorStore((s) => s.dirty)

  const sections = useMemo(() => groupAtomic(tree), [tree])

  const onChange = (path: string[], value: unknown) =>
    setTokenValue("typography-atomic-w3c.json", path, value)

  return (
    <div className="flex flex-col gap-8 p-6">
      <header>
        <h2 className="text-heading-medium">Typography</h2>
        <p className="text-body-large text-text-secondary">
          Atomic font primitives. Composite styles like `heading.large`
          combine these and are not edited directly.
        </p>
      </header>

      {sections.map(({ group, entries }) => (
        <section key={group} className="flex flex-col gap-3">
          <h3 className="text-body-large-strong uppercase tracking-wide text-text-secondary">
            {group}
            <span className="ml-2 text-body-medium text-text-tertiary">({entries.length})</span>
          </h3>
          <div className="flex flex-col gap-2">
            {entries.map((entry) => (
              <Row
                key={entry.id}
                entry={entry}
                isDirty={dirty.has(`typography-atomic-w3c.json#${entry.id}`)}
                onChange={(value) => onChange(entry.path, value)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function Row({
  entry,
  isDirty,
  onChange,
}: {
  entry: AtomicEntry
  isDirty: boolean
  onChange: (value: unknown) => void
}) {
  return (
    <div className="grid grid-cols-[minmax(200px,1fr)_240px_1fr] items-center gap-4 rounded border border-border-default p-3">
      <div className="font-mono text-body-medium">
        {entry.id}
        {isDirty ? <span className="ml-2 text-body-small text-text-accent">●</span> : null}
      </div>
      <Editor entry={entry} onChange={onChange} />
      <Preview entry={entry} />
    </div>
  )
}

function Editor({ entry, onChange }: { entry: AtomicEntry; onChange: (v: unknown) => void }) {
  const value = entry.node.$value
  if (entry.$type === "fontFamily") {
    const stack = Array.isArray(value) ? (value as string[]).join(", ") : ""
    return (
      <input
        type="text"
        value={stack}
        onChange={(e) => onChange(parseFamilies(e.target.value))}
        className="rounded border border-border-default bg-background-default px-2 py-1 font-mono text-body-medium outline-none focus:border-border-strong"
      />
    )
  }
  if (entry.$type === "fontWeight") {
    return (
      <input
        type="number"
        value={typeof value === "number" ? value : 400}
        min={100}
        max={900}
        step={50}
        onChange={(e) => onChange(toIntSafe(e.target.value, 400))}
        className="w-24 rounded border border-border-default bg-background-default px-2 py-1 text-body-large outline-none focus:border-border-strong"
      />
    )
  }
  if (entry.$type === "dimension") {
    const dim = (value as DimensionValue) ?? { value: 0, unit: "rem" }
    return (
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={dim.value}
          step={0.01}
          onChange={(e) => onChange({ value: toFloatSafe(e.target.value, 0), unit: dim.unit })}
          className="w-24 rounded border border-border-default bg-background-default px-2 py-1 text-body-large outline-none focus:border-border-strong"
        />
        <span className="text-body-medium text-text-tertiary">{dim.unit}</span>
      </div>
    )
  }
  return <span className="text-body-medium text-text-tertiary">unsupported $type</span>
}

function Preview({ entry }: { entry: AtomicEntry }) {
  const value = entry.node.$value
  if (entry.$type === "fontFamily") {
    const stack = Array.isArray(value) ? (value as string[]).join(", ") : ""
    return (
      <div className="truncate text-body-large" style={{ fontFamily: stack }}>
        The quick brown fox
      </div>
    )
  }
  if (entry.$type === "fontWeight") {
    return (
      <div className="text-body-large" style={{ fontWeight: value as number }}>
        The quick brown fox
      </div>
    )
  }
  if (entry.$type === "dimension") {
    const dim = (value as DimensionValue) ?? { value: 0, unit: "rem" }
    const css = `${dim.value}${dim.unit}`
    if (entry.group === "sizes") {
      return (
        <div className="truncate" style={{ fontSize: css }}>
          Sample
        </div>
      )
    }
    if (entry.group === "line-heights") {
      return (
        <div className="text-body-large leading-none" style={{ lineHeight: css }}>
          two<br />lines
        </div>
      )
    }
    if (entry.group === "letter-spacings") {
      return (
        <div className="text-body-large" style={{ letterSpacing: css }}>
          spaced text
        </div>
      )
    }
  }
  return null
}

function groupAtomic(tree: W3CTree): { group: string; entries: AtomicEntry[] }[] {
  const map = new Map<string, AtomicEntry[]>()
  walk(tree, [], map)
  const order = ["families", "weights", "sizes", "line-heights", "letter-spacings"]
  const out: { group: string; entries: AtomicEntry[] }[] = []
  for (const g of order) {
    const list = map.get(g)
    if (list && list.length) out.push({ group: g, entries: list })
  }
  for (const [g, list] of map.entries()) {
    if (!order.includes(g)) out.push({ group: g, entries: list })
  }
  return out
}

function walk(
  node: W3CTree | W3CTokenNode,
  path: string[],
  map: Map<string, AtomicEntry[]>,
) {
  if (isTokenNode(node)) {
    const group = path[1] ?? "root"
    const entry: AtomicEntry = {
      path,
      id: path.join("."),
      group,
      $type: node.$type ?? "unknown",
      node,
    }
    const list = map.get(group) ?? []
    list.push(entry)
    map.set(group, list)
    return
  }
  if (typeof node !== "object" || node === null) return
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue
    walk(child as W3CTree | W3CTokenNode, [...path, key], map)
  }
}

function parseFamilies(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

function toIntSafe(input: string, fallback: number): number {
  const n = Number.parseInt(input, 10)
  return Number.isFinite(n) ? n : fallback
}

function toFloatSafe(input: string, fallback: number): number {
  const n = Number.parseFloat(input)
  return Number.isFinite(n) ? n : fallback
}
