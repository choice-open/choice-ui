import { Command, Kbd } from "@choice-ui/react"
import {
  CircleQuestionLarge,
  Download,
  Refresh,
  Search,
  ToolbarStar,
} from "@choiceform/icons-react"

const ITEMS = [
  { id: "search", label: "Search tokens", icon: Search, shortcut: "K" },
  { id: "refresh", label: "Refresh live preview", icon: Refresh, shortcut: "R" },
  { id: "export", label: "Export tokens.css", icon: Download, shortcut: "E" },
  { id: "fav", label: "Toggle favorites", icon: ToolbarStar, shortcut: "F" },
  { id: "help", label: "Open help", icon: CircleQuestionLarge, shortcut: "?" },
]

export function CommandPaletteBlock() {
  return (
    <section className="flex flex-col rounded-lg border border-border-default bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Command palette
        </span>
        <h3 className="text-heading-small">Keyboard-first navigation</h3>
      </header>
      <div className="px-5 py-4">
        <Command className="overflow-hidden rounded-md border border-border-default">
          <Command.Input placeholder="Type a command…" />
          <Command.List>
            {ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <Command.Item key={item.id} prefixElement={<Icon />}>
                  <Command.Value>{item.label}</Command.Value>
                  <span className="ml-auto">
                    <Kbd keys="command">{item.shortcut}</Kbd>
                  </span>
                </Command.Item>
              )
            })}
          </Command.List>
        </Command>
      </div>
    </section>
  )
}
