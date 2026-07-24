import {
  Button,
  Checkbox,
  NumericInput,
  Radio,
  Range,
  Separator,
  Textarea,
  Tooltip,
} from "@choice-ui/react"
import { useState } from "react"

type Channel = "stable" | "beta" | "experimental"

export function PublishOptionsBlock() {
  const [channel, setChannel] = useState<Channel>("stable")
  const [graceMinutes, setGraceMinutes] = useState(30)
  const [opacityFloor, setOpacityFloor] = useState(80)
  const [notifySlack, setNotifySlack] = useState(true)
  const [includeChangelog, setIncludeChangelog] = useState(false)
  const [notes, setNotes] = useState("Bumps the brand blue swatch to match marketing.")

  return (
    <section className="flex flex-col rounded-lg bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Publish
        </span>
        <h3 className="text-heading-small">Promote tokens to a release channel</h3>
      </header>
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-body-medium text-text-secondary">Release channel</span>
          <div className="flex flex-col gap-1.5">
            <Radio
              value={channel === "stable"}
              onChange={(on) => on && setChannel("stable")}
            >
              Stable · widely shipped
            </Radio>
            <Radio value={channel === "beta"} onChange={(on) => on && setChannel("beta")}>
              Beta · feature-flagged consumers
            </Radio>
            <Radio
              value={channel === "experimental"}
              onChange={(on) => on && setChannel("experimental")}
            >
              Experimental · internal only
            </Radio>
          </div>
        </div>

        <Separator />

        <label className="flex flex-col gap-1.5">
          <Tooltip content="Window where consumers can roll back without engineering help">
            <span className="text-body-medium text-text-secondary">
              Grace window (minutes) <em className="not-italic text-text-tertiary">ⓘ</em>
            </span>
          </Tooltip>
          <NumericInput
            value={graceMinutes}
            onChange={(v) => setGraceMinutes(Number(v))}
            className="w-32"
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-body-medium text-text-secondary">
            Minimum alpha for shadow layers · {opacityFloor}%
          </span>
          <Range value={opacityFloor} onChange={setOpacityFloor} min={0} max={100} />
        </div>

        <Separator />

        <label className="flex flex-col gap-1.5">
          <span className="text-body-medium text-text-secondary">Release notes</span>
          <Textarea
            value={notes}
            onChange={setNotes}
            placeholder="What changed and why?"
            className="min-h-20"
          />
        </label>

        <div className="flex flex-col gap-2">
          <Checkbox value={notifySlack} onChange={setNotifySlack}>
            Notify #design-systems on Slack
          </Checkbox>
          <Checkbox value={includeChangelog} onChange={setIncludeChangelog}>
            Append to public changelog
          </Checkbox>
        </div>
      </div>
      <footer className="flex justify-end gap-2 border-t border-border-default px-5 py-3">
        <Button variant="secondary">Save draft</Button>
        <Button variant="primary">Publish</Button>
      </footer>
    </section>
  )
}
