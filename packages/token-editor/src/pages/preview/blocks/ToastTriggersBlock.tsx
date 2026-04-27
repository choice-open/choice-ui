import { Button, Toaster, toast } from "@choice-ui/react"

const TOASTER_ID = "preview"

const ACTIONS = [
  {
    label: "Saved",
    variant: "primary" as const,
    fire: () =>
      toast.use(TOASTER_ID).success("Tokens saved", {
        description: "All edits committed to the in-memory store.",
      }),
  },
  {
    label: "Build failed",
    variant: "secondary" as const,
    fire: () =>
      toast.use(TOASTER_ID).error("Build failed", {
        description: "Lint rejected `color.brand.500` — non-srgb hex.",
      }),
  },
  {
    label: "Compiling…",
    variant: "secondary" as const,
    fire: () =>
      toast.use(TOASTER_ID).loading("Compiling tokens", {
        description: "Running Terrazzo plugins in-browser.",
      }),
  },
  {
    label: "Sync info",
    variant: "secondary" as const,
    fire: () =>
      toast.use(TOASTER_ID).info("Theme synced with main", {
        description: "12 tokens overwritten with upstream values.",
      }),
  },
]

export function ToastTriggersBlock() {
  return (
    <section className="flex flex-col rounded-lg bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Toasts
        </span>
        <h3 className="text-heading-small">Trigger a notification</h3>
      </header>
      <div className="flex flex-col gap-2 px-5 py-4">
        <div className="grid grid-cols-2 gap-2">
          {ACTIONS.map((a) => (
            <Button key={a.label} variant={a.variant} onClick={a.fire}>
              {a.label}
            </Button>
          ))}
        </div>
        <p className="text-body-small text-text-tertiary">
          Each variant fires a toast through the shared `Toaster`. Tap the toast
          to dismiss it.
        </p>
      </div>
      <Toaster id={TOASTER_ID} />
    </section>
  )
}
