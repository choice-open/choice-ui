import { Avatar, Badge, Dropdown, IconButton } from "@choice-ui/react"
import { EllipsisVerticalSmall } from "@choiceform/icons-react"

type Activity = {
  id: string
  user: string
  initials: string
  color: "blue" | "violet" | "pink" | "neutral" | "yellow"
  action: string
  status: "live" | "pending" | "archived" | "failed"
  when: string
}

const ACTIVITIES: Activity[] = [
  {
    id: "1",
    user: "Maya Lin",
    initials: "ML",
    color: "blue",
    action: "Updated 12 color tokens",
    status: "live",
    when: "2 minutes ago",
  },
  {
    id: "2",
    user: "Jordan Park",
    initials: "JP",
    color: "violet",
    action: "Reverted spacing scale",
    status: "pending",
    when: "14 minutes ago",
  },
  {
    id: "3",
    user: "Sam Chen",
    initials: "SC",
    color: "pink",
    action: "Created theme preset · Aurora",
    status: "live",
    when: "an hour ago",
  },
  {
    id: "4",
    user: "Alex Hunt",
    initials: "AH",
    color: "neutral",
    action: "Removed 8 deprecated tokens",
    status: "archived",
    when: "3 hours ago",
  },
  {
    id: "5",
    user: "Riley Ng",
    initials: "RN",
    color: "yellow",
    action: "Synced with main branch",
    status: "failed",
    when: "yesterday",
  },
]

export function RecentActivityBlock() {
  return (
    <section className="flex flex-col rounded-lg bg-background-default shadow-sm">
      <header className="flex items-baseline justify-between border-b border-border-default px-5 py-4">
        <div>
          <h3 className="text-heading-small">Recent activity</h3>
          <p className="text-body-medium text-text-secondary">Latest token edits across your team</p>
        </div>
        <button
          type="button"
          className="text-body-medium text-text-accent hover:underline"
        >
          View all
        </button>
      </header>
      <ul className="divide-y divide-border-default">
        {ACTIVITIES.map((a) => (
          <li
            key={a.id}
            className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 px-5 py-3"
          >
            <Avatar name={a.user} color={a.color} />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-body-large">{a.user}</span>
              <span className="truncate text-body-medium text-text-secondary">{a.action}</span>
            </div>
            <StatusBadge status={a.status} />
            <span className="text-body-medium tabular-nums text-text-tertiary">{a.when}</span>
            <Dropdown>
              <Dropdown.Trigger asChild>
                <IconButton variant="ghost" aria-label="More actions">
                  <EllipsisVerticalSmall />
                </IconButton>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>
                  <Dropdown.Value>View diff</Dropdown.Value>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.Value>Copy permalink</Dropdown.Value>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item variant="danger">
                  <Dropdown.Value>Revert change</Dropdown.Value>
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>
          </li>
        ))}
      </ul>
    </section>
  )
}

function StatusBadge({ status }: { status: Activity["status"] }) {
  const map = {
    live: { label: "Live", variant: "success" as const, strong: true },
    pending: { label: "Pending", variant: "warning" as const, strong: true },
    archived: { label: "Archived", variant: "default" as const, strong: false },
    failed: { label: "Failed", variant: "error" as const, strong: true },
  }
  const config = map[status]
  return (
    <Badge variant={config.variant} strong={config.strong}>
      {config.label}
    </Badge>
  )
}
