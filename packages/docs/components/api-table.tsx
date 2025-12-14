"use client"

import { InfoCircle } from "@choiceform/icons-react"
import { Fragment } from "react/jsx-runtime"
import { Badge, IconButton } from "~/components"

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

function splitUnionType(type: string): string[] {
  return type
    .split(/\s*\|\s*/g)
    .map((t) => t.trim())
    .filter(Boolean)
}

export function ApiTable({ props }: ApiTableProps) {
  if (!props || props.length === 0) return null

  return (
    <section
      id="api"
      className="space-y-4"
    >
      <h2 className="md-h2">API reference</h2>
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full min-w-0 text-left">
              {props.map((group, idx) => {
                // 过滤掉 type 为空的 props
                const validProps = (group.props ?? []).filter((prop) => prop.type?.trim())
                // 如果没有有效的 props，不渲染这个 group
                if (validProps.length === 0) return null

                return (
                  <Fragment key={`${group.displayName ?? idx}-${idx}`}>
                    <thead className="bg-secondary-background">
                      <tr className="text-secondary-foreground">
                        <th className="font-strong text-default-foreground px-4 py-2">
                          {group.displayName}
                        </th>
                        <th className="px-4 py-2 font-semibold">Type</th>
                        <th className="px-4 py-2 font-semibold">Default</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validProps.map((prop) => (
                        <tr key={prop.name}>
                          <td className="px-4 py-2">
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
                          <td className="px-4 py-2 whitespace-pre-wrap">
                            {(() => {
                              const unionParts = splitUnionType(prop.type)
                              if (unionParts.length > 1) {
                                return (
                                  <span className="inline-flex flex-wrap items-center gap-2">
                                    {unionParts.map((part, i) => (
                                      <Fragment key={`${prop.name}-type-${part}-${i}`}>
                                        <Badge className="bg-secondary-background text-secondary-foreground border-none select-text">
                                          {part}
                                        </Badge>
                                        {i < unionParts.length - 1 ? (
                                          <span className="text-secondary-foreground">|</span>
                                        ) : null}
                                      </Fragment>
                                    ))}
                                  </span>
                                )
                              }

                              if (prop.type.includes("Object")) {
                                return (
                                  <Badge className="bg-secondary-background text-secondary-foreground border-none select-text">
                                    {prop.type}
                                  </Badge>
                                )
                              }

                              return <span className="text-secondary-foreground">{prop.type}</span>
                            })()}
                          </td>
                          <td className="px-4 py-2">
                            {prop.defaultValue ? (
                              <Badge className="bg-secondary-background text-secondary-foreground border-none select-text">
                                {prop.defaultValue}
                              </Badge>
                            ) : (
                              <span className="text-secondary-foreground"> - </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Fragment>
                )
              })}
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
