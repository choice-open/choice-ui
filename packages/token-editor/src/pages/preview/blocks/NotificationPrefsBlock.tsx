import { Switch } from "@choice-ui/react"
import { useState } from "react"

type Pref = {
  id: string
  title: string
  description: string
  defaultOn: boolean
}

const PREFS: Pref[] = [
  {
    id: "build-complete",
    title: "Build complete",
    description: "Email when a build finishes successfully or fails.",
    defaultOn: true,
  },
  {
    id: "token-changed",
    title: "Token changed",
    description: "Push notification when teammates edit shared tokens.",
    defaultOn: false,
  },
  {
    id: "review-requested",
    title: "Review requested",
    description: "Slack ping when you're tagged on a token diff for review.",
    defaultOn: true,
  },
  {
    id: "weekly-digest",
    title: "Weekly digest",
    description: "Summary of every change shipped, delivered Monday morning.",
    defaultOn: false,
  },
  {
    id: "sync-conflict",
    title: "Sync conflicts",
    description: "Alert immediately when remote and local diverge.",
    defaultOn: true,
  },
]

export function NotificationPrefsBlock() {
  const [values, setValues] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PREFS.map((p) => [p.id, p.defaultOn])),
  )

  return (
    <section className="flex flex-col rounded-lg border border-border-default bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <h3 className="text-sm font-semibold">Notifications</h3>
        <p className="text-xs text-text-secondary">Choose how you want to be alerted.</p>
      </header>
      <ul className="divide-y divide-border-default">
        {PREFS.map((p) => (
          <li
            key={p.id}
            className="flex items-start justify-between gap-6 px-5 py-3.5"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{p.title}</span>
              <span className="text-xs leading-relaxed text-text-secondary">
                {p.description}
              </span>
            </div>
            <Switch
              value={values[p.id]}
              onChange={(next) => setValues((prev) => ({ ...prev, [p.id]: next }))}
              aria-label={p.title}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
