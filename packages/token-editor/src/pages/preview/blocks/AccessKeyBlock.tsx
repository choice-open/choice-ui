import { Button, OtpInput } from "@choice-ui/react"
import { useState } from "react"

export function AccessKeyBlock() {
  const [code, setCode] = useState("")
  const complete = code.length === 6

  return (
    <section className="flex flex-col rounded-lg border border-border-default bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Access
        </span>
        <h3 className="text-heading-small">Verify publish key</h3>
      </header>
      <div className="flex flex-col gap-3 px-5 py-4">
        <p className="text-body-medium text-text-secondary">
          We just sent a 6-digit code to your registered Slack channel. Enter it
          to authorize the publish.
        </p>
        <OtpInput maxLength={6} value={code} onChange={setCode}>
          <OtpInput.Group>
            <OtpInput.Slot index={0} />
            <OtpInput.Slot index={1} />
            <OtpInput.Slot index={2} />
          </OtpInput.Group>
          <OtpInput.Separator />
          <OtpInput.Group>
            <OtpInput.Slot index={3} />
            <OtpInput.Slot index={4} />
            <OtpInput.Slot index={5} />
          </OtpInput.Group>
        </OtpInput>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className="text-body-small text-text-accent hover:underline"
          >
            Resend code
          </button>
          <Button variant="primary" disabled={!complete}>
            Authorize
          </Button>
        </div>
      </div>
    </section>
  )
}
