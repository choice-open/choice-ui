import { Avatar, Badge, Table } from "@choice-ui/react"
import { useState } from "react"

type Contributor = {
  id: string
  name: string
  initials: string
  color: "blue" | "violet" | "pink" | "neutral" | "yellow"
  role: "Designer" | "Engineer" | "PM"
  edits: number
  lastSeen: string
}

const ROWS: Contributor[] = [
  {
    id: "1",
    name: "Maya Lin",
    initials: "ML",
    color: "blue",
    role: "Designer",
    edits: 142,
    lastSeen: "now",
  },
  {
    id: "2",
    name: "Jordan Park",
    initials: "JP",
    color: "violet",
    role: "Engineer",
    edits: 87,
    lastSeen: "2h ago",
  },
  {
    id: "3",
    name: "Sam Chen",
    initials: "SC",
    color: "pink",
    role: "Designer",
    edits: 54,
    lastSeen: "1d ago",
  },
  {
    id: "4",
    name: "Alex Hunt",
    initials: "AH",
    color: "neutral",
    role: "PM",
    edits: 12,
    lastSeen: "3d ago",
  },
  {
    id: "5",
    name: "Riley Ng",
    initials: "RN",
    color: "yellow",
    role: "Engineer",
    edits: 9,
    lastSeen: "1w ago",
  },
]

const ROLE_VARIANT = {
  Designer: "brand",
  Engineer: "component",
  PM: "default",
} as const

export function ContributorsTableBlock() {
  const [selected, setSelected] = useState<(string | number)[]>([])
  return (
    <section className="flex flex-col rounded-lg bg-background-default shadow-sm">
      <header className="flex items-baseline justify-between border-b border-border-default px-5 py-4">
        <div>
          <span className="text-body-small uppercase tracking-wide text-text-tertiary">
            Team
          </span>
          <h3 className="text-heading-small">Top contributors this month</h3>
        </div>
        {selected.length > 0 ? (
          <span className="text-body-small text-text-secondary">
            {selected.length} selected
          </span>
        ) : null}
      </header>
      <Table
        data={ROWS}
        getRowKey={(row) => row.id}
        selectable
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        height={280}
      >
        <Table.Header>
          <Table.Column id="who" flex={2}>
            <Table.Value>Member</Table.Value>
          </Table.Column>
          <Table.Column id="role" width={110}>
            <Table.Value>Role</Table.Value>
          </Table.Column>
          <Table.Column id="edits" width={80}>
            <Table.Value>Edits</Table.Value>
          </Table.Column>
          <Table.Column id="last" width={100}>
            <Table.Value>Last seen</Table.Value>
          </Table.Column>
        </Table.Header>
        <Table.Body<Contributor>>
          {(row, index) => (
            <Table.Row rowKey={row.id} index={index}>
              <Table.Cell columnId="who">
                <div className="flex items-center gap-2">
                  <Avatar name={row.name} color={row.color} />
                  <span className="text-body-medium">{row.name}</span>
                </div>
              </Table.Cell>
              <Table.Cell columnId="role">
                <Badge variant={ROLE_VARIANT[row.role]}>{row.role}</Badge>
              </Table.Cell>
              <Table.Cell columnId="edits">
                <Table.Value>
                  <span className="tabular-nums">{row.edits}</span>
                </Table.Value>
              </Table.Cell>
              <Table.Cell columnId="last">
                <Table.Value>
                  <span className="text-text-tertiary">{row.lastSeen}</span>
                </Table.Value>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </section>
  )
}
