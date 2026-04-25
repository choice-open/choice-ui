import { useMemo } from "react"
import { AliasPickerPopover } from "../../components/AliasPickerPopover"
import { ColorEditPopover } from "../../components/ColorEditPopover"
import { ColorSwatchButton } from "../../components/ColorSwatchButton"
import {
  type ColorEntry,
  type ColorMode,
  collectColorTokens,
  collectPrimitiveOptions,
  isAlias,
  resolveColorValue,
} from "../../lib/w3c"
import { useEditorStore } from "../../state/store"

export function ColorsPage() {
  const colorsTree = useEditorStore((s) => s.files["colors-w3c.json"])
  const setModeValue = useEditorStore((s) => s.setModeValue)
  const dirty = useEditorStore((s) => s.dirty)

  const grouped = useMemo(() => {
    const all = collectColorTokens(colorsTree)
    const primitives = all.filter((e) => !e.lightIsAlias && !e.darkIsAlias)
    const semantics = all.filter((e) => e.lightIsAlias || e.darkIsAlias)
    return groupByCategory(primitives, semantics)
  }, [colorsTree])

  const primitiveOptions = useMemo(() => collectPrimitiveOptions(colorsTree), [colorsTree])

  return (
    <div className="flex flex-col gap-8 p-6">
      <header>
        <h2 className="text-heading-medium">Colors</h2>
        <p className="text-body-large text-text-secondary">
          Primitive tokens edit a concrete RGB value per mode. Semantic
          tokens point at a primitive — pick a different one or break it
          into a literal color.
        </p>
      </header>

      {grouped.map(({ category, entries, kind }) => (
        <section key={category} className="flex flex-col gap-3">
          <h3 className="text-body-large-strong uppercase tracking-wide text-text-secondary">
            {category}
            <span className="ml-2 text-body-medium text-text-tertiary">({entries.length})</span>
          </h3>
          <div className="grid grid-cols-[minmax(180px,1fr)_repeat(2,auto)] items-center gap-x-4 gap-y-2">
            <div className="text-body-medium text-text-tertiary">Token</div>
            <div className="text-body-medium text-text-tertiary">Light</div>
            <div className="text-body-medium text-text-tertiary">Dark</div>
            {entries.map((entry) =>
              kind === "semantic" ? (
                <SemanticRow
                  key={entry.id}
                  entry={entry}
                  isDirty={isDirty(dirty, entry)}
                  primitiveOptions={primitiveOptions}
                  onPickAlias={(mode, alias) =>
                    setModeValue("colors-w3c.json", entry.path, mode, alias)
                  }
                />
              ) : (
                <PrimitiveRow
                  key={entry.id}
                  entry={entry}
                  isDirty={isDirty(dirty, entry)}
                  onChangeColor={(mode, value) =>
                    setModeValue("colors-w3c.json", entry.path, mode, value)
                  }
                />
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  )
}

function PrimitiveRow({
  entry,
  isDirty,
  onChangeColor,
}: {
  entry: ColorEntry
  isDirty: boolean
  onChangeColor: (mode: ColorMode, value: ReturnType<typeof Object>) => void
}) {
  return (
    <>
      <div className="font-mono text-body-medium">
        {entry.id}
        {isDirty ? <span className="ml-2 text-body-small text-text-accent">●</span> : null}
      </div>
      <ColorEditPopover
        value={entry.light}
        label={`${entry.id} · light`}
        onChange={(v) => onChangeColor("light", v)}
      >
        <div>
          <ColorSwatchButton value={entry.light} isAlias={false} />
        </div>
      </ColorEditPopover>
      <ColorEditPopover
        value={entry.dark}
        label={`${entry.id} · dark`}
        onChange={(v) => onChangeColor("dark", v)}
      >
        <div>
          <ColorSwatchButton value={entry.dark} isAlias={false} />
        </div>
      </ColorEditPopover>
    </>
  )
}

function SemanticRow({
  entry,
  isDirty,
  primitiveOptions,
  onPickAlias,
}: {
  entry: ColorEntry
  isDirty: boolean
  primitiveOptions: ReturnType<typeof collectPrimitiveOptions>
  onPickAlias: (mode: ColorMode, alias: string) => void
}) {
  const colorsTree = useEditorStore((s) => s.files["colors-w3c.json"])
  const lightAlias = isAlias(entry.lightRaw) ? entry.lightRaw : null
  const darkAlias = isAlias(entry.darkRaw) ? entry.darkRaw : null
  const lightResolved = resolveColorValue(colorsTree, entry.lightRaw, "light")
  const darkResolved = resolveColorValue(colorsTree, entry.darkRaw, "dark")
  return (
    <>
      <div className="font-mono text-body-medium">
        {entry.id}
        {isDirty ? <span className="ml-2 text-body-small text-text-accent">●</span> : null}
        {lightAlias ? (
          <div className="text-body-small text-text-tertiary">→ {lightAlias}</div>
        ) : null}
      </div>
      <AliasPickerPopover
        options={primitiveOptions}
        currentAlias={lightAlias}
        mode="light"
        label={`${entry.id} · light`}
        onPick={(alias) => onPickAlias("light", alias)}
      >
        <div>
          <ColorSwatchButton value={lightResolved} isAlias={false} />
        </div>
      </AliasPickerPopover>
      <AliasPickerPopover
        options={primitiveOptions}
        currentAlias={darkAlias}
        mode="dark"
        label={`${entry.id} · dark`}
        onPick={(alias) => onPickAlias("dark", alias)}
      >
        <div>
          <ColorSwatchButton value={darkResolved} isAlias={false} />
        </div>
      </AliasPickerPopover>
    </>
  )
}

type GroupKind = "primitive" | "semantic"

function groupByCategory(
  primitives: ColorEntry[],
  semantics: ColorEntry[],
): { category: string; entries: ColorEntry[]; kind: GroupKind }[] {
  const out: { category: string; entries: ColorEntry[]; kind: GroupKind }[] = []
  const map = new Map<string, ColorEntry[]>()
  for (const e of primitives) {
    const list = map.get(e.category) ?? []
    list.push(e)
    map.set(e.category, list)
  }
  const order = ["hues", "pale", "neutrals"]
  for (const cat of order) {
    const list = map.get(cat)
    if (list && list.length) out.push({ category: cat, entries: list, kind: "primitive" })
  }
  for (const [cat, list] of map.entries()) {
    if (!order.includes(cat))
      out.push({ category: cat, entries: list, kind: "primitive" })
  }
  if (semantics.length) {
    const byCat = new Map<string, ColorEntry[]>()
    for (const e of semantics) {
      const list = byCat.get(e.category) ?? []
      list.push(e)
      byCat.set(e.category, list)
    }
    for (const [cat, list] of byCat.entries()) {
      out.push({ category: cat, entries: list, kind: "semantic" })
    }
  }
  return out
}

function isDirty(dirty: Set<string>, entry: ColorEntry) {
  return dirty.has(`colors-w3c.json#${entry.id}`)
}
