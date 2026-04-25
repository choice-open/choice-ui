import { useMemo } from "react"
import { ColorEditPopover } from "../../components/ColorEditPopover"
import { ColorSwatchButton } from "../../components/ColorSwatchButton"
import { collectColorTokens, type ColorEntry } from "../../lib/w3c"
import { useEditorStore } from "../../state/store"

export function ColorsPage() {
  const colorsTree = useEditorStore((s) => s.files["colors-w3c.json"])
  const setColorMode = useEditorStore((s) => s.setColorMode)
  const dirty = useEditorStore((s) => s.dirty)

  const grouped = useMemo(() => {
    const all = collectColorTokens(colorsTree)
    const primitives = all.filter((e) => !e.lightIsAlias && !e.darkIsAlias)
    const semantics = all.filter((e) => e.lightIsAlias || e.darkIsAlias)
    return groupByCategory(primitives, semantics)
  }, [colorsTree])

  return (
    <div className="flex flex-col gap-8 p-6">
      <header>
        <h2 className="text-lg font-semibold">Colors</h2>
        <p className="text-sm text-text-secondary">
          Click any swatch to edit. Light and dark are tracked independently.
          Aliased tokens are read-only in v0.1.
        </p>
      </header>

      {grouped.map(({ category, entries }) => (
        <section key={category} className="flex flex-col gap-3">
          <h3 className="text-sm font-medium uppercase tracking-wide text-text-secondary">
            {category}
            <span className="ml-2 text-xs text-text-tertiary">({entries.length})</span>
          </h3>
          <div className="grid grid-cols-[minmax(160px,1fr)_repeat(2,auto)] items-center gap-x-4 gap-y-2">
            <div className="text-xs text-text-tertiary">Token</div>
            <div className="text-xs text-text-tertiary">Light</div>
            <div className="text-xs text-text-tertiary">Dark</div>
            {entries.map((entry) => (
              <ColorRow
                key={entry.id}
                entry={entry}
                isDirty={isDirty(dirty, entry)}
                onChange={(mode, value) =>
                  setColorMode("colors-w3c.json", entry.path, mode, value)
                }
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function ColorRow({
  entry,
  isDirty,
  onChange,
}: {
  entry: ColorEntry
  isDirty: boolean
  onChange: (mode: "light" | "dark", value: ReturnType<typeof Object>) => void
}) {
  return (
    <>
      <div className="font-mono text-xs">
        {entry.id}
        {isDirty ? <span className="ml-2 text-[10px] text-text-accent">●</span> : null}
      </div>
      <ColorEditPopover
        value={entry.light}
        label={`${entry.id} · light`}
        onChange={(v) => onChange("light", v)}
      >
        <div>
          <ColorSwatchButton value={entry.light} isAlias={entry.lightIsAlias} />
        </div>
      </ColorEditPopover>
      <ColorEditPopover
        value={entry.dark}
        label={`${entry.id} · dark`}
        onChange={(v) => onChange("dark", v)}
      >
        <div>
          <ColorSwatchButton value={entry.dark} isAlias={entry.darkIsAlias} />
        </div>
      </ColorEditPopover>
    </>
  )
}

function groupByCategory(
  primitives: ColorEntry[],
  semantics: ColorEntry[],
): { category: string; entries: ColorEntry[] }[] {
  const map = new Map<string, ColorEntry[]>()
  for (const e of primitives) {
    const list = map.get(e.category) ?? []
    list.push(e)
    map.set(e.category, list)
  }
  const out: { category: string; entries: ColorEntry[] }[] = []
  const order = ["hues", "pale", "neutrals"]
  for (const cat of order) {
    const list = map.get(cat)
    if (list && list.length) out.push({ category: cat, entries: list })
  }
  for (const [cat, list] of map.entries()) {
    if (!order.includes(cat)) out.push({ category: cat, entries: list })
  }
  if (semantics.length) {
    out.push({ category: "semantic (read-only in v0.1)", entries: semantics })
  }
  return out
}

function isDirty(dirty: Set<string>, entry: ColorEntry) {
  return dirty.has(`colors-w3c.json#${entry.id}`)
}
