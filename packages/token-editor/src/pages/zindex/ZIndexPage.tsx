import { useMemo } from "react"
import { NumberInput } from "../../components/AtomicValueEditors"
import { collectTokens } from "../../lib/w3c"
import { useEditorStore } from "../../state/store"

const FILE = "zindex-w3c.json"

export function ZIndexPage() {
  const tree = useEditorStore((s) => s.files[FILE])
  const setTokenValue = useEditorStore((s) => s.setTokenValue)
  const dirty = useEditorStore((s) => s.dirty)

  const entries = useMemo(() => {
    const all = collectTokens(tree)
    return [...all].sort((a, b) => {
      const av = (a.node.$value as number) ?? 0
      const bv = (b.node.$value as number) ?? 0
      return av - bv
    })
  }, [tree])

  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <h2 className="text-heading-medium">Z-Index</h2>
        <p className="text-body-large text-text-secondary">
          Layering scale. Sorted ascending so the stack order is visible at a
          glance.
        </p>
      </header>
      <div className="flex flex-col gap-1.5">
        {entries.map((e) => (
          <div
            key={e.id}
            className="grid grid-cols-[minmax(160px,1fr)_140px] items-center gap-4 rounded border border-border-default p-3"
          >
            <div className="font-mono text-body-medium">
              {e.id}
              {dirty.has(`${FILE}#${e.id}`) ? (
                <span className="ml-2 text-body-small text-text-accent">●</span>
              ) : null}
            </div>
            <NumberInput
              value={e.node.$value as number}
              step={10}
              onChange={(next) => setTokenValue(FILE, e.path, next)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
