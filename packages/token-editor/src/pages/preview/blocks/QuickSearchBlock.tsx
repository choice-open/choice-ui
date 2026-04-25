import { Input, Kbd } from "@choice-ui/react"
import { Search } from "@choiceform/icons-react"

const RECENT = [
  "color.blue.500",
  "spacing.default",
  "typography.heading.large",
  "shadows.lg",
]

export function QuickSearchBlock() {
  return (
    <section className="flex flex-col rounded-lg border border-border-default bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Quick actions
        </span>
        <h3 className="text-heading-small">Jump anywhere in the editor</h3>
      </header>
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex items-center gap-2 rounded-md border border-border-default bg-background-component/40 px-3 py-2">
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-text-tertiary" />
          <Input
            placeholder="Search tokens, components, exports…"
            className="flex-1 border-0 bg-transparent p-0 outline-none"
          />
          <Kbd keys="command">K</Kbd>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-body-small uppercase tracking-wide text-text-tertiary">
            Recent
          </span>
          <ul className="flex flex-col">
            {RECENT.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-background-component"
                >
                  <span className="font-mono text-body-medium text-text-default">{item}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
