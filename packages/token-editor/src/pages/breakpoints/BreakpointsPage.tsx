import { useMemo } from "react"
import { DimensionInput } from "../../components/AtomicValueEditors"
import { collectTokens } from "../../lib/w3c"
import { useEditorStore } from "../../state/store"

const FILE = "breakpoints-w3c.json"

export function BreakpointsPage() {
  const tree = useEditorStore((s) => s.files[FILE])
  const setTokenValue = useEditorStore((s) => s.setTokenValue)
  const dirty = useEditorStore((s) => s.dirty)

  const entries = useMemo(() => collectTokens(tree), [tree])

  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <h2 className="text-heading-medium">Breakpoints</h2>
        <p className="text-body-large text-text-secondary">
          Responsive breakpoint scale, in rem. Used by `breakpoint.up()` /
          `down()` helpers and the matching SCSS mixins.
        </p>
      </header>
      <div className="flex flex-col gap-2">
        {entries.map((e) => {
          const dim = e.node.$value as { value: number; unit: string }
          const px = Math.round(dim.value * 16)
          return (
            <div
              key={e.id}
              className="grid grid-cols-[minmax(140px,1fr)_240px_1fr] items-center gap-4 rounded border border-border-default p-3"
            >
              <div className="font-mono text-body-medium">
                {e.id}
                {dirty.has(`${FILE}#${e.id}`) ? (
                  <span className="ml-2 text-body-small text-text-accent">●</span>
                ) : null}
              </div>
              <DimensionInput
                value={dim}
                step={0.25}
                onChange={(next) => setTokenValue(FILE, e.path, next)}
              />
              <div className="font-mono text-body-medium text-text-tertiary">≈ {px}px</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
