import { Popover, ScrollArea } from "@choice-ui/react"
import { type ReactNode, useMemo, useState } from "react"
import type { ColorMode, PrimitiveOption } from "../lib/w3c"

type Props = {
  options: PrimitiveOption[]
  currentAlias: string | null
  mode: ColorMode
  label: string
  onPick: (alias: string) => void
  children: ReactNode
}

export function AliasPickerPopover({
  options,
  currentAlias,
  mode,
  label,
  onPick,
  children,
}: Props) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.id.toLowerCase().includes(q))
  }, [query, options])

  return (
    <Popover interactions="click" placement="right-start">
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content className="w-72 p-0">
        <div className="border-b border-border-default p-2">
          <div className="mb-1 text-body-medium text-text-secondary">{label}</div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search primitives…"
            autoFocus
            className="w-full rounded border border-border-default bg-background-default px-2 py-1 text-body-large outline-none focus:border-border-strong"
          />
        </div>
        <ScrollArea className="max-h-64">
          <ul className="flex flex-col py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-body-medium text-text-tertiary">No matches.</li>
            ) : (
              filtered.map((option) => {
                const swatch = mode === "dark" ? option.dark : option.light
                const isCurrent = option.alias === currentAlias
                return (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() => onPick(option.alias)}
                      className={
                        "flex w-full items-center gap-2 px-3 py-1.5 text-left text-body-large hover:bg-background-component " +
                        (isCurrent ? "bg-background-component" : "")
                      }
                    >
                      <span
                        className="h-4 w-4 flex-shrink-0 rounded border border-border-default"
                        style={{
                          background: swatch
                            ? srgbCss(swatch.components, swatch.alpha ?? 1)
                            : "transparent",
                        }}
                      />
                      <span className="font-mono text-body-medium">{option.id}</span>
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </ScrollArea>
      </Popover.Content>
    </Popover>
  )
}

function srgbCss(components: readonly number[], alpha: number) {
  const [r, g, b] = components
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`
}
