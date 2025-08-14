import React, { createContext, useContext } from "react"
import type { LoaderStage } from "../types"

interface LoaderContextValue {
  currentStage: number
  stages: LoaderStage[]
}

const LoaderContext = createContext<LoaderContextValue | undefined>(undefined)

export const LoaderProvider: React.FC<LoaderContextValue & { children: React.ReactNode }> = ({
  children,
  ...value
}) => {
  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
}

export const useLoader = () => {
  const context = useContext(LoaderContext)
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider")
  }
  return context
}
