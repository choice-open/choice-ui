import { useMemo } from "react"
import { DimensionInput } from "../../components/AtomicValueEditors"
import { collectTokens } from "../../lib/w3c"
import { useEditorStore } from "../../state/store"

const FILE = "spacing-w3c.json"
const SCALE_STEPS = [1, 2, 3, 4, 6, 8, 12, 16] as const

export function SpacingPage() {
  const tree = useEditorStore((s) => s.files[FILE])
  const setTokenValue = useEditorStore((s) => s.setTokenValue)
  const dirty = useEditorStore((s) => s.dirty)

  const entries = useMemo(() => collectTokens(tree), [tree])
  const defaultEntry = entries.find((e) => e.id === "spacing.default")
  const defaultDim =
    (defaultEntry?.node.$value as { value: number; unit: string } | undefined) ?? null

  return (
    <div className="flex flex-col gap-6 p-6">
      <header>
        <h2 className="text-lg font-semibold">Spacing</h2>
        <p className="text-sm text-text-secondary">
          Atomic spacing primitives. `spacing(N)` multiplies `spacing.default` by
          `N`; `spacing("[…]")` and `spacing("1/2")` are computed at runtime
          and don't live in the JSON.
        </p>
      </header>

      <div className="flex flex-col gap-2">
        {entries.map((e) => {
          const dim = e.node.$value as { value: number; unit: string }
          return (
            <div
              key={e.id}
              className="grid grid-cols-[minmax(160px,1fr)_240px_1fr] items-center gap-4 rounded border border-border-default p-3"
            >
              <div className="font-mono text-xs">
                {e.id}
                {dirty.has(`${FILE}#${e.id}`) ? (
                  <span className="ml-2 text-[10px] text-text-accent">●</span>
                ) : null}
                {e.node.$description ? (
                  <div className="text-[10px] text-text-tertiary">{e.node.$description}</div>
                ) : null}
              </div>
              <DimensionInput
                value={dim}
                step={dim.unit === "rem" ? 0.0625 : 1}
                onChange={(next) => setTokenValue(FILE, e.path, next)}
              />
              <div className="font-mono text-[11px] text-text-tertiary">
                {`${dim.value}${dim.unit}`}
                {dim.unit === "rem" ? ` ≈ ${Math.round(dim.value * 16 * 100) / 100}px` : null}
              </div>
            </div>
          )
        })}
      </div>

      {defaultDim ? <ScalePreview baseDim={defaultDim} /> : null}
    </div>
  )
}

function ScalePreview({ baseDim }: { baseDim: { value: number; unit: string } }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-medium uppercase tracking-wide text-text-secondary">
        scale preview
      </h3>
      <p className="text-xs text-text-tertiary">
        Bars at `spacing(N)` = N × {baseDim.value}
        {baseDim.unit}.
      </p>
      <div className="flex flex-col gap-1">
        {SCALE_STEPS.map((n) => {
          const css = `${baseDim.value * n}${baseDim.unit}`
          return (
            <div key={n} className="flex items-center gap-3">
              <span className="w-20 font-mono text-xs text-text-tertiary">spacing({n})</span>
              <div
                className="h-4 rounded-sm bg-background-accent"
                style={{ width: css }}
              />
              <span className="font-mono text-[11px] text-text-tertiary">{css}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
