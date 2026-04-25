import { Loader, Skeleton, SpinnerBounce } from "@choice-ui/react"

const STAGES = [
  { label: "Lint", icon: <Dot /> },
  { label: "Type check", icon: <Dot /> },
  { label: "Build" , icon: <Dot /> },
  { label: "Deploy", icon: <Dot /> },
]

export function SyncStatusBlock() {
  return (
    <section className="flex flex-col rounded-lg border border-border-default bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Sync status
        </span>
        <h3 className="text-heading-small">Pipeline running…</h3>
      </header>
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <SpinnerBounce />
          <span className="text-body-medium text-text-secondary">
            Validating tokens against schema
          </span>
        </div>

        <Loader stages={STAGES} currentStage={2} />

        <div className="flex flex-col gap-2">
          <span className="text-body-small uppercase tracking-wide text-text-tertiary">
            Streaming changelog
          </span>
          <div className="flex flex-col gap-1.5">
            <Skeleton loading width="100%" height={10} />
            <Skeleton loading width="80%" height={10} />
            <Skeleton loading width="65%" height={10} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Dot() {
  return <span className="block h-1.5 w-1.5 rounded-full bg-current" />
}
