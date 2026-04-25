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
  type W3CColorTokenValue,
  type W3CColorValue,
  type W3CTree,
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

      {grouped.map(({ category, entries }) => (
        <section key={category} className="flex flex-col gap-3">
          <h3 className="text-body-large-strong uppercase tracking-wide text-text-secondary">
            {category}
            <span className="ml-2 text-body-medium text-text-tertiary">({entries.length})</span>
          </h3>
          <div className="grid grid-cols-[minmax(180px,1fr)_repeat(2,auto)] items-center gap-x-4 gap-y-2">
            <div className="text-body-medium text-text-tertiary">Token</div>
            <div className="text-body-medium text-text-tertiary">Light</div>
            <div className="text-body-medium text-text-tertiary">Dark</div>
            {entries.map((entry) => (
              <Row
                key={entry.id}
                entry={entry}
                tree={colorsTree}
                isDirty={isDirty(dirty, entry)}
                primitiveOptions={primitiveOptions}
                onChange={(mode, value) =>
                  setModeValue("colors-w3c.json", entry.path, mode, value)
                }
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
  tree,
  isDirty,
  primitiveOptions,
  onChange,
}: {
  entry: ColorEntry
  tree: W3CTree
  isDirty: boolean
  primitiveOptions: ReturnType<typeof collectPrimitiveOptions>
  onChange: (mode: ColorMode, value: W3CColorTokenValue) => void
}) {
  const lightAlias = isAlias(entry.lightRaw) ? entry.lightRaw : null
  return (
    <>
      <div className="font-mono text-body-medium">
        {entry.id}
        {isDirty ? <span className="ml-2 text-body-small text-text-accent">●</span> : null}
        {lightAlias ? (
          <div className="text-body-small text-text-tertiary">→ {lightAlias}</div>
        ) : null}
      </div>
      <ModeCell
        entry={entry}
        tree={tree}
        mode="light"
        primitiveOptions={primitiveOptions}
        onChange={onChange}
      />
      <ModeCell
        entry={entry}
        tree={tree}
        mode="dark"
        primitiveOptions={primitiveOptions}
        onChange={onChange}
      />
    </>
  )
}

/**
 * Renders the right editor for one (entry, mode) cell. Aliased sides get the
 * primitive picker; literal sides get the rgb popover. A token can be mixed
 * (light alias + dark literal, or vice versa); each side decides
 * independently from the rest of the row.
 */
function ModeCell({
  entry,
  tree,
  mode,
  primitiveOptions,
  onChange,
}: {
  entry: ColorEntry
  tree: W3CTree
  mode: ColorMode
  primitiveOptions: ReturnType<typeof collectPrimitiveOptions>
  onChange: (mode: ColorMode, value: W3CColorTokenValue) => void
}) {
  const isAliasSide = mode === "light" ? entry.lightIsAlias : entry.darkIsAlias
  const literalValue: W3CColorValue | null =
    mode === "light" ? entry.light : entry.dark
  const rawValue = mode === "light" ? entry.lightRaw : entry.darkRaw

  if (isAliasSide) {
    const currentAlias = isAlias(rawValue) ? rawValue : null
    const resolved = resolveColorValue(tree, rawValue, mode)
    return (
      <AliasPickerPopover
        options={primitiveOptions}
        currentAlias={currentAlias}
        mode={mode}
        label={`${entry.id} · ${mode}`}
        onPick={(alias) => onChange(mode, alias)}
      >
        <div>
          <ColorSwatchButton value={resolved} isAlias={false} />
        </div>
      </AliasPickerPopover>
    )
  }

  return (
    <ColorEditPopover
      value={literalValue}
      label={`${entry.id} · ${mode}`}
      onChange={(v) => onChange(mode, v)}
    >
      <div>
        <ColorSwatchButton value={literalValue} isAlias={false} />
      </div>
    </ColorEditPopover>
  )
}

function groupByCategory(
  primitives: ColorEntry[],
  semantics: ColorEntry[],
): { category: string; entries: ColorEntry[] }[] {
  const out: { category: string; entries: ColorEntry[] }[] = []
  const map = new Map<string, ColorEntry[]>()
  for (const e of primitives) {
    const list = map.get(e.category) ?? []
    list.push(e)
    map.set(e.category, list)
  }
  const order = ["hues", "pale", "neutrals"]
  for (const cat of order) {
    const list = map.get(cat)
    if (list && list.length) out.push({ category: cat, entries: list })
  }
  for (const [cat, list] of map.entries()) {
    if (!order.includes(cat)) out.push({ category: cat, entries: list })
  }
  if (semantics.length) {
    const byCat = new Map<string, ColorEntry[]>()
    for (const e of semantics) {
      const list = byCat.get(e.category) ?? []
      list.push(e)
      byCat.set(e.category, list)
    }
    for (const [cat, list] of byCat.entries()) {
      out.push({ category: cat, entries: list })
    }
  }
  return out
}

function isDirty(dirty: Set<string>, entry: ColorEntry) {
  return dirty.has(`colors-w3c.json#${entry.id}`)
}
