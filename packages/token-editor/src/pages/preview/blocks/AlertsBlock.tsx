import {
  CircleCheckLargeSolid,
  CircleErrorSolid,
  CircleWarningLargeSolid,
} from "@choiceform/icons-react"

type Alert = {
  id: string
  kind: "success" | "warning" | "error"
  title: string
  body: string
  when: string
}

const ALERTS: Alert[] = [
  {
    id: "build",
    kind: "success",
    title: "Build #142 passed",
    body: "All seven token files compiled in 4.2s.",
    when: "2 min ago",
  },
  {
    id: "sync",
    kind: "warning",
    title: "Sync conflict in shadows-w3c.json",
    body: "Local override for `shadows.lg` differs from main. Resolve to continue.",
    when: "6 hours ago",
  },
  {
    id: "lint",
    kind: "error",
    title: "Lint failed",
    body: "`color.brand.500` resolves to a non-srgb hex. Fix or revert.",
    when: "yesterday",
  },
]

const ICONS = {
  success: CircleCheckLargeSolid,
  warning: CircleWarningLargeSolid,
  error: CircleErrorSolid,
}

const STYLES = {
  success: "text-text-success",
  warning: "text-text-warning",
  error: "text-text-danger",
}

export function AlertsBlock() {
  return (
    <section className="flex flex-col rounded-lg border border-border-default bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Alerts
        </span>
        <h3 className="text-heading-small">What you missed</h3>
      </header>
      <ul className="flex flex-col divide-y divide-border-default">
        {ALERTS.map((alert) => {
          const Icon = ICONS[alert.kind]
          return (
            <li key={alert.id} className="flex items-start gap-3 px-5 py-3">
              <Icon className={"mt-0.5 h-4 w-4 flex-shrink-0 " + STYLES[alert.kind]} />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-body-medium text-text-default">
                    {alert.title}
                  </span>
                  <span className="flex-shrink-0 text-body-small text-text-tertiary">
                    {alert.when}
                  </span>
                </div>
                <span className="text-body-medium text-text-secondary">{alert.body}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
