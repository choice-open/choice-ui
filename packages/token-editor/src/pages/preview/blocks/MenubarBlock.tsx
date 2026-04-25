import { Dropdown, Kbd, Menubar } from "@choice-ui/react"

export function MenubarBlock() {
  return (
    <section className="flex flex-col rounded-lg border border-border-default bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          App chrome
        </span>
        <h3 className="text-heading-small">Editor menubar</h3>
      </header>
      <div className="px-3 py-3">
        <Menubar className="rounded-md border border-border-default px-1 py-0.5">
          <Menubar.Item>
            <Menubar.Trigger>File</Menubar.Trigger>
            <Dropdown.Content>
              <Dropdown.Item shortcut={{ keys: "N", modifier: "command" }}>
                <Dropdown.Value>New theme</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item shortcut={{ keys: "O", modifier: "command" }}>
                <Dropdown.Value>Open W3C JSON…</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item shortcut={{ keys: "S", modifier: "command" }}>
                <Dropdown.Value>Save snapshot</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item asLink>
                <Dropdown.Value>Recent themes</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Menubar.Item>
          <Menubar.Item>
            <Menubar.Trigger>Edit</Menubar.Trigger>
            <Dropdown.Content>
              <Dropdown.Item shortcut={{ keys: "Z", modifier: "command" }}>
                <Dropdown.Value>Undo edit</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item shortcut={{ keys: "Z", modifier: ["command", "shift"] }}>
                <Dropdown.Value>Redo</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item variant="danger">
                <Dropdown.Value>Reset to defaults</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Menubar.Item>
          <Menubar.Item>
            <Menubar.Trigger>Theme</Menubar.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>
                <Dropdown.Value>Auto</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.Value>Light</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.Value>Dark</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item shortcut={{ keys: "R", modifier: ["command", "shift"] }}>
                <Dropdown.Value>Toggle live preview</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Menubar.Item>
          <Menubar.Item>
            <Menubar.Trigger>Help</Menubar.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>
                <Dropdown.Value>Documentation</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.Value>Report a bug</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>
                <Dropdown.Value>About Choice UI</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Menubar.Item>
        </Menubar>
        <p className="mt-3 text-body-small text-text-tertiary">
          Press <Kbd>F10</Kbd> to focus the menubar from the keyboard.
        </p>
      </div>
    </section>
  )
}
