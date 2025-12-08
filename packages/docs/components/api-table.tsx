"use client"

import { InfoCircle } from "@choiceform/icons-react"
import { IconButton } from "~/components"

export type PropDoc = {
  name: string
  type: string
  required: boolean
  defaultValue?: string
  description?: string
}

export type PropsGroup = {
  displayName?: string
  description?: string
  props?: PropDoc[]
}

type ApiTableProps = {
  props: PropsGroup[]
}

function cleanDescription(text?: string): string {
  if (!text) return ""
  const withoutCode = text.replace(/```[\s\S]*?```/g, "")
  const withoutExample = withoutCode.replace(/@example[\s\S]*/gi, "")
  const firstLine = withoutExample
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)[0]
  return firstLine ?? ""
}

export function ApiTable({ props }: ApiTableProps) {
  if (!props || props.length === 0) return null

  return (
    <section
      id="api"
      className="space-y-4"
    >
      <h2 className="md-h2">API</h2>
      {props.map((group, idx) => (
        <div
          key={`${group.displayName ?? idx}-${idx}`}
          className="space-y-2"
        >
          {group.displayName && <h4 className="md-h4">{group.displayName}</h4>}
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-left">
              <thead className="bg-muted/50">
                <tr className="text-secondary-foreground border-b">
                  <th className="w-1/4 px-4 py-2 font-semibold">Prop</th>
                  <th className="w-2/4 px-4 py-2 font-semibold">Type</th>
                  <th className="w-1/4 px-4 py-2 font-semibold">Default</th>
                </tr>
              </thead>
              <tbody>
                {(group.props ?? []).map((prop) => (
                  <tr key={prop.name}>
                    <td className="px-4 py-2 font-mono">
                      <div className="flex items-center gap-2">
                        <span>{prop.name}</span>
                        {prop.description && (
                          <IconButton
                            variant="ghost"
                            tooltip={{ content: cleanDescription(prop.description) || "—" }}
                          >
                            <InfoCircle />
                          </IconButton>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 font-mono whitespace-pre-wrap">{prop.type}</td>
                    <td className="text-muted-foreground px-4 py-2 font-mono">
                      {prop.defaultValue ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </section>
  )
}
