import { useMemo } from "react"
import { parseMdIntoBlocks } from "../utils"

export function useMdBlocks(content: string): string[] {
  return useMemo(() => parseMdIntoBlocks(content), [content])
}
