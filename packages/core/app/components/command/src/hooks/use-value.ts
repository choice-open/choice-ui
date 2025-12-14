import React, { useRef } from "react"
import { VALUE_ATTR } from "../utils"
import { useCommand } from "./use-command"
import { useIsomorphicLayoutEffect } from "usehooks-ts"

export function useValue(
  id: string,
  ref: React.RefObject<HTMLElement>,
  deps: (string | React.ReactNode | React.RefObject<HTMLElement>)[],
  aliases: string[] = [],
) {
  const valueRef = useRef<string>()
  const context = useCommand()

  useIsomorphicLayoutEffect(() => {
    const value = (() => {
      for (const part of deps) {
        if (typeof part === "string") {
          return part.trim()
        }

        if (typeof part === "object" && part && "current" in part) {
          if (part.current) {
            return part.current.textContent?.trim()
          }
          return valueRef.current
        }
      }
      return undefined // Critical: consistent with original implementation, return undefined when value not found
    })()

    const keywords = aliases.map((alias) => alias.trim())

    context.value(id, value || "", keywords)
    ref.current?.setAttribute(VALUE_ATTR, value || "")
    valueRef.current = value
  }) // Consistent with original implementation: intentionally no dependency array

  return valueRef
}
