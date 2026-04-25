import { DateInput, TextField } from "@choice-ui/react"

export function DateRangeBlock() {
  return (
    <section className="flex flex-col rounded-lg border border-border-default bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Time range
        </span>
        <h3 className="text-heading-small">Filter edits by date</h3>
      </header>
      <div className="flex flex-col gap-3 px-5 py-4">
        <DateInput placeholder="Start date">
          <TextField.Label>From</TextField.Label>
        </DateInput>
        <DateInput placeholder="End date">
          <TextField.Label>To</TextField.Label>
        </DateInput>
        <p className="text-body-small text-text-tertiary">
          Showing 47 edits across 12 tokens between the selected dates.
        </p>
      </div>
    </section>
  )
}
