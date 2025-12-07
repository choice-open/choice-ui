import React, { useRef } from "react"
import { VALUE_ATTR, useLayoutEffect } from "../utils"
import { useCommand } from "./use-command"

export function useValue(
  id: string,
  ref: React.RefObject<HTMLElement>,
  deps: (string | React.ReactNode | React.RefObject<HTMLElement>)[],
  aliases: string[] = [],
) {
  const valueRef = useRef<string>()
  const context = useCommand()

  useLayoutEffect(() => {
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
      return undefined // 关键：和原始实现一致，找不到值时返回undefined
    })()

    const keywords = aliases.map((alias) => alias.trim())

    context.value(id, value || "", keywords)
    ref.current?.setAttribute(VALUE_ATTR, value || "")
    valueRef.current = value
  }) // 和原始实现一致：故意不使用依赖数组

  return valueRef
}
