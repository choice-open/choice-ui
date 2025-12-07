import React from "react"
import { CommandContext } from "../context"

export const useCommand = () => {
  const context = React.useContext(CommandContext)
  if (!context) {
    throw new Error("useCommand must be used within a Command component")
  }
  return context
}
