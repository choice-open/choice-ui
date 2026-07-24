import { Checkbox, IconButton, NumericInput } from "@choice-ui/react"
import { ArrowDown, ArrowUp, Trash } from "@choiceform/icons-react"
import { useMemo } from "react"
import { ShadowColorPopover } from "../../components/ShadowColorPopover"
import { isTokenNode, type W3CTokenNode, type W3CTree } from "../../lib/w3c"
import { useEditorStore } from "../../state/store"

type ShadowMode = "light" | "dark"

type ShadowLayer = {
  offsetX?: string
  offsetY?: string
  blur?: string
  spread?: string
  color?: string
  inset?: boolean
}

type ShadowEntry = {
  path: string[]
  id: string
  node: W3CTokenNode
  light: ShadowLayer[]
  dark: ShadowLayer[]
}

const FILE = "shadows-w3c.json"

const NEW_LAYER: ShadowLayer = {
  offsetX: "0px",
  offsetY: "0px",
  blur: "0px",
  spread: "0px",
  color: "rgba(0, 0, 0, 0.1)",
}

export function ShadowsPage() {
  const tree = useEditorStore((s) => s.files[FILE])
  const dirty = useEditorStore((s) => s.dirty)
  const setModeValue = useEditorStore((s) => s.setModeValue)

  const entries = useMemo(() => collectShadows(tree), [tree])

  const writeMode = (path: string[], mode: ShadowMode, layers: ShadowLayer[]) => {
    // Single-layer was historically stored as a bare object; preserve that
    // shape on write so the JSON diff stays minimal for unchanged structure.
    const value = layers.length === 1 ? layers[0] : layers
    setModeValue(FILE, path, mode, value)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <header>
        <h2 className="text-heading-medium">Shadows</h2>
        <p className="text-body-large text-text-secondary">
          Each token holds an ordered list of shadow layers per mode. Layers
          stack with later entries overlaying earlier ones — same as
          CSS `box-shadow`.
        </p>
      </header>

      {entries.map((entry) => (
        <section
          key={entry.id}
          className="flex flex-col gap-3 rounded border border-border-default p-4"
        >
          <div className="flex items-baseline justify-between">
            <h3 className="font-mono text-body-large">
              {entry.id}
              {dirty.has(`${FILE}#${entry.id}`) ? (
                <span className="ml-2 text-body-small text-text-accent">●</span>
              ) : null}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ModeColumn
              mode="light"
              layers={entry.light}
              onChange={(next) => writeMode(entry.path, "light", next)}
            />
            <ModeColumn
              mode="dark"
              layers={entry.dark}
              onChange={(next) => writeMode(entry.path, "dark", next)}
            />
          </div>
        </section>
      ))}
    </div>
  )
}

function ModeColumn({
  mode,
  layers,
  onChange,
}: {
  mode: ShadowMode
  layers: ShadowLayer[]
  onChange: (next: ShadowLayer[]) => void
}) {
  const updateLayer = (i: number, patch: Partial<ShadowLayer>) => {
    const next = layers.map((l, idx) => (idx === i ? { ...l, ...patch } : l))
    onChange(next)
  }
  const removeLayer = (i: number) => onChange(layers.filter((_, idx) => idx !== i))
  const addLayer = () => onChange([...layers, { ...NEW_LAYER }])
  const moveLayer = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= layers.length) return
    const next = [...layers]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-body-medium uppercase text-text-secondary">{mode}</span>
        <Preview mode={mode} layers={layers} />
      </div>
      <div className="flex flex-col gap-1.5">
        {layers.map((layer, i) => (
          <LayerCard
            key={i}
            index={i}
            layer={layer}
            canMoveUp={i > 0}
            canMoveDown={i < layers.length - 1}
            onUpdate={(patch) => updateLayer(i, patch)}
            onRemove={() => removeLayer(i)}
            onMoveUp={() => moveLayer(i, -1)}
            onMoveDown={() => moveLayer(i, 1)}
          />
        ))}
        <button
          type="button"
          onClick={addLayer}
          className="rounded border border-dashed border-border-default px-2 py-1 text-body-medium text-text-secondary hover:bg-background-component"
        >
          + Add layer
        </button>
      </div>
    </div>
  )
}

function LayerCard({
  index,
  layer,
  canMoveUp,
  canMoveDown,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  index: number
  layer: ShadowLayer
  canMoveUp: boolean
  canMoveDown: boolean
  onUpdate: (patch: Partial<ShadowLayer>) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  return (
    <div className="flex flex-col gap-2 rounded border border-border-default bg-background-component/50 p-2.5 text-body-medium">
      <div className="flex items-center justify-between">
        <span className="text-body-small text-text-tertiary">
          {layer.inset ? "Inner shadow" : "Drop shadow"} · {index + 1}
        </span>
        <div className="flex items-center gap-0.5">
          <IconButton
            variant="ghost"
            disabled={!canMoveUp}
            onClick={onMoveUp}
            aria-label="Move up"
          >
            <ArrowUp />
          </IconButton>
          <IconButton
            variant="ghost"
            disabled={!canMoveDown}
            onClick={onMoveDown}
            aria-label="Move down"
          >
            <ArrowDown />
          </IconButton>
          <IconButton variant="ghost" onClick={onRemove} aria-label="Remove layer">
            <Trash />
          </IconButton>
        </div>
      </div>

      <Field label="Position">
        <PxRow
          glyph="X"
          value={layer.offsetX}
          onChange={(v) => onUpdate({ offsetX: v })}
        />
        <PxRow
          glyph="Y"
          value={layer.offsetY}
          onChange={(v) => onUpdate({ offsetY: v })}
        />
      </Field>

      <Field label="Blur">
        <PxRow
          glyph="B"
          value={layer.blur}
          onChange={(v) => onUpdate({ blur: v })}
        />
      </Field>

      <Field label="Spread">
        <PxRow
          glyph="S"
          value={layer.spread}
          onChange={(v) => onUpdate({ spread: v })}
        />
      </Field>

      <Field label="Color">
        <ShadowColorPopover
          value={layer.color}
          onChange={(v) => onUpdate({ color: v })}
        />
      </Field>

      <Field label="Inset">
        <Checkbox
          value={!!layer.inset}
          onChange={(v) => onUpdate({ inset: v || undefined })}
        >
          Render shadow inside the box
        </Checkbox>
      </Field>
    </div>
  )
}

/**
 * Figma's editor uses fixed-width labels with the input rail to the right.
 * Same here — keeps every row aligned even when one input has a glyph
 * decoration and another (Color) is a swatch + hex + alpha pair.
 */
function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[64px_1fr] items-start gap-2">
      <span className="pt-1 text-body-small text-text-secondary">{label}</span>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  )
}

function PxRow({
  glyph,
  value,
  onChange,
}: {
  glyph: string
  value: string | undefined
  onChange: (next: string) => void
}) {
  const num = parsePx(value)
  return (
    <NumericInput
      value={Number.isFinite(num) ? num : 0}
      expression="{value}px"
      onChange={(v) => {
        const n = typeof v === "number" ? v : Number.parseFloat(String(v))
        onChange(formatPx(n))
      }}
    >
      <NumericInput.Prefix>
        <span className="font-mono text-body-small text-text-tertiary">{glyph}</span>
      </NumericInput.Prefix>
    </NumericInput>
  )
}

function Preview({ mode, layers }: { mode: ShadowMode; layers: ShadowLayer[] }) {
  const css = layersToCss(layers) || "none"
  return (
    <div
      className="flex h-12 w-20 items-center justify-center rounded text-body-small"
      style={{
        background: mode === "dark" ? "#1a1a1a" : "#f5f5f5",
        color: mode === "dark" ? "#888" : "#666",
        boxShadow: css,
      }}
    >
      preview
    </div>
  )
}

function collectShadows(tree: W3CTree): ShadowEntry[] {
  const out: ShadowEntry[] = []
  walk(tree, [], out)
  return out
}

function walk(
  node: W3CTree | W3CTokenNode,
  path: string[],
  out: ShadowEntry[],
) {
  if (isTokenNode(node) && node.$type === "shadow") {
    const ext = (node.$extensions as { mode?: { light?: unknown; dark?: unknown } } | undefined)
      ?.mode
    const lightRaw = ext?.light ?? node.$value
    const darkRaw = ext?.dark ?? node.$value
    out.push({
      path,
      id: path.join("."),
      node,
      light: normalizeLayers(lightRaw),
      dark: normalizeLayers(darkRaw),
    })
    return
  }
  if (typeof node !== "object" || node === null) return
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue
    walk(child as W3CTree | W3CTokenNode, [...path, key], out)
  }
}

function normalizeLayers(value: unknown): ShadowLayer[] {
  if (Array.isArray(value)) return value as ShadowLayer[]
  if (value && typeof value === "object") return [value as ShadowLayer]
  return []
}

function layersToCss(layers: ShadowLayer[]): string {
  return layers
    .map((l) => {
      const parts: string[] = []
      if (l.inset) parts.push("inset")
      parts.push(l.offsetX ?? "0")
      parts.push(l.offsetY ?? "0")
      parts.push(l.blur ?? "0")
      if (l.spread) parts.push(l.spread)
      parts.push(l.color ?? "transparent")
      return parts.join(" ")
    })
    .join(", ")
}

function parsePx(value: string | undefined): number {
  if (!value) return 0
  const n = Number.parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

function formatPx(n: number): string {
  if (!Number.isFinite(n)) return "0px"
  return `${n}px`
}
