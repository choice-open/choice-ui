import { Badge } from "@choice-ui/react"

const STATS = [
  { label: "Tokens edited", value: "243", delta: "+12", trend: "up" as const },
  { label: "Sessions today", value: "8", delta: "+2", trend: "up" as const },
  { label: "Coverage", value: "94%", delta: "−1%", trend: "down" as const },
]

export function EditVelocityBlock() {
  return (
    <section className="flex flex-col rounded-lg border border-border-default bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Edit velocity
        </span>
        <h3 className="text-heading-small">This session at a glance</h3>
      </header>
      <dl className="grid grid-cols-3 divide-x divide-border-default">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 px-4 py-4">
            <dt className="text-body-small uppercase tracking-wide text-text-tertiary">
              {stat.label}
            </dt>
            <dd className="text-heading-medium tabular-nums">{stat.value}</dd>
            <Badge
              variant={stat.trend === "up" ? "success" : "warning"}
              strong={false}
              className="self-start"
            >
              {stat.delta}
            </Badge>
          </div>
        ))}
      </dl>
      <footer className="border-t border-border-default px-5 py-3">
        <button
          type="button"
          className="text-body-medium text-text-accent hover:underline"
        >
          View changelog →
        </button>
      </footer>
    </section>
  )
}
