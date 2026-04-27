import { Button, Input } from "@choice-ui/react"
import { useState } from "react"

const TIMELINE = [
  { stage: "Lint & format", at: "auto · on save", state: "pass" as const },
  { stage: "Type check", at: "auto · on commit", state: "pass" as const },
  { stage: "Visual regression", at: "Wed 14:00", state: "queued" as const },
  { stage: "Production deploy", at: "Wed 16:30", state: "queued" as const },
]

export function ReleaseScheduleBlock() {
  const [date, setDate] = useState("Wed, Apr 30")
  const [tag, setTag] = useState("v0.4.0")

  return (
    <section className="flex flex-col rounded-lg bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Release
        </span>
        <h3 className="text-heading-small">Schedule the next ship</h3>
      </header>
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-body-medium text-text-secondary">Tag</span>
            <Input value={tag} onChange={setTag} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-body-medium text-text-secondary">Cut date</span>
            <Input value={date} onChange={setDate} />
          </label>
        </div>
        <ol className="flex flex-col">
          {TIMELINE.map((step, idx) => (
            <li key={step.stage} className="flex items-start gap-3 py-1.5">
              <Pin state={step.state} index={idx + 1} />
              <div className="flex flex-1 items-baseline justify-between">
                <span className="text-body-medium text-text-default">{step.stage}</span>
                <span className="text-body-small text-text-tertiary">{step.at}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <footer className="flex justify-end gap-2 border-t border-border-default px-5 py-3">
        <Button variant="secondary">Save draft</Button>
        <Button variant="primary">Schedule release</Button>
      </footer>
    </section>
  )
}

function Pin({ state, index }: { state: "pass" | "queued"; index: number }) {
  return (
    <span
      className={
        "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-body-small tabular-nums " +
        (state === "pass"
          ? "bg-background-success-secondary text-text-on-accent"
          : "bg-background-component text-text-secondary")
      }
    >
      {state === "pass" ? "✓" : index}
    </span>
  )
}
