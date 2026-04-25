import { Badge, ProgressBar } from "@choice-ui/react"

type Row = {
  name: string
  value: number
  status: "live" | "pending" | "draft"
}

const ROWS: Row[] = [
  { name: "Button", value: 100, status: "live" },
  { name: "Input", value: 95, status: "live" },
  { name: "Modal", value: 80, status: "pending" },
  { name: "Table", value: 60, status: "draft" },
  { name: "Combobox", value: 42, status: "draft" },
]

const STATUS_VARIANT = {
  live: "success",
  pending: "warning",
  draft: "default",
} as const

export function CoverageBlock() {
  return (
    <section className="flex flex-col rounded-lg border border-border-default bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Coverage
        </span>
        <h3 className="text-heading-small">Token coverage by component</h3>
      </header>
      <ul className="flex flex-col gap-4 px-5 py-4">
        {ROWS.map((row) => (
          <li key={row.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-body-medium text-text-default">{row.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_VARIANT[row.status]} strong={row.status !== "draft"}>
                  {row.status}
                </Badge>
                <span className="text-body-medium tabular-nums text-text-secondary">
                  {row.value}%
                </span>
              </div>
            </div>
            <ProgressBar value={row.value}>
              <ProgressBar.Track>
                <ProgressBar.Connects />
              </ProgressBar.Track>
            </ProgressBar>
          </li>
        ))}
      </ul>
    </section>
  )
}
