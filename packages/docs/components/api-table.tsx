"use client"

import { InfoCircle } from "@choiceform/icons-react"
import { useTheme } from "next-themes"
import { Highlight, Language, themes } from "prism-react-renderer"
import { Fragment } from "react/jsx-runtime"
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

const CodeBlock = ({ code, language }: { code: string; language: Language }) => {
  const { theme } = useTheme()
  const highlightTheme = theme === "dark" ? themes.vsDark : themes.vsLight
  return (
    <Highlight
      theme={highlightTheme}
      code={code}
      language={language}
    >
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <code style={{ ...style, backgroundColor: "transparent" }}>
          {tokens.map((line, i) => {
            const { key, ...lineProps } = getLineProps({ line, key: i })
            return (
              <div
                key={i}
                {...lineProps}
              >
                {line.map((token, tokenKey) => {
                  const { key: tokenPropsKey, ...tokenProps } = getTokenProps({
                    token,
                    key: tokenKey,
                  })
                  return (
                    <span
                      key={tokenKey}
                      {...tokenProps}
                    />
                  )
                })}
              </div>
            )
          })}
        </code>
      )}
    </Highlight>
  )
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
  const { theme } = useTheme()
  const highlightTheme = theme === "dark" ? themes.vsDark : themes.vsLight

  return (
    <section
      id="api"
      className="space-y-4"
    >
      <h2 className="md-h2">API</h2>
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full min-w-0 text-left">
              {props.map((group, idx) => (
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
                    {(group.props ?? []).map((prop) => (
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
                          <CodeBlock
                            code={prop.type}
                            language="typescript"
                          />
                        </td>
                        <td className="px-4 py-2">
                          {prop.defaultValue ? (
                            <CodeBlock
                              code={prop.defaultValue}
                              language="typescript"
                            />
                          ) : (
                            <span className="text-secondary-foreground"> - </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Fragment>
              ))}
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
