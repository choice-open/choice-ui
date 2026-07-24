import { Button, Input, Select, Switch } from "@choice-ui/react"
import { useState } from "react"

export function SaveProfileBlock() {
  const [name, setName] = useState("Maya Lin")
  const [theme, setTheme] = useState("Auto")
  const [autoSync, setAutoSync] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <section className="flex flex-col rounded-lg bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Profile
        </span>
        <h3 className="text-heading-small">Workspace settings</h3>
      </header>
      <div className="flex flex-col gap-4 px-5 py-4">
        <Field label="Display name">
          <Input value={name} onChange={setName} className="w-full" />
        </Field>
        <Field label="Default theme">
          <Select value={theme} onChange={setTheme}>
            <Select.Trigger className="w-full">
              <Select.Value>{theme}</Select.Value>
            </Select.Trigger>
            <Select.Content>
              {["Auto", "Light", "Dark", "High contrast"].map((opt) => (
                <Select.Item key={opt} value={opt}>
                  <Select.Value>{opt}</Select.Value>
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </Field>
        <Switch value={autoSync} onChange={setAutoSync}>
          Auto-sync edits to GitHub
        </Switch>
        <Switch value={showAdvanced} onChange={setShowAdvanced}>
          Reveal advanced controls in customize panel
        </Switch>
      </div>
      <footer className="flex justify-end gap-2 border-t border-border-default px-5 py-3">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save changes</Button>
      </footer>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-body-medium text-text-secondary">{label}</span>
      {children}
    </label>
  )
}
