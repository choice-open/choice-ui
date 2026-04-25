import { Badge } from "@choice-ui/react"

type Row = {
  label: string
  variant: "success" | "warning" | "error" | "brand" | "default" | "component"
  strong: boolean
  description: string
}

const ROWS: Row[] = [
  {
    label: "Live",
    variant: "success",
    strong: true,
    description: "Shipped to production. Reflected in the live theme.",
  },
  {
    label: "Pending",
    variant: "warning",
    strong: true,
    description: "Edited locally, awaiting review.",
  },
  {
    label: "Failed",
    variant: "error",
    strong: true,
    description: "Sync rejected — token clashes with main.",
  },
  {
    label: "Beta",
    variant: "brand",
    strong: true,
    description: "Available behind a feature flag.",
  },
  {
    label: "Archived",
    variant: "default",
    strong: false,
    description: "Read-only. Kept for historical references.",
  },
]

export function StatusBadgesBlock() {
  return (
    <section className="flex flex-col rounded-lg border border-border-default bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Conventions
        </span>
        <h3 className="text-heading-small">State language</h3>
      </header>
      <ul className="flex flex-col divide-y divide-border-default">
        {ROWS.map((row) => (
          <li key={row.label} className="flex items-start gap-3 px-5 py-3">
            <Badge variant={row.variant} strong={row.strong} className="min-w-16 justify-center">
              {row.label}
            </Badge>
            <span className="text-body-medium text-text-secondary">{row.description}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
