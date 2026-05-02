import { createContext, ReactNode, useContext } from "react"
import type { LoaderStage } from "../types"

interface LoaderContextValue {
  currentStage: number
  stages: LoaderStage[]
}

const LoaderContext = createContext<LoaderContextValue | undefined>(undefined)

export const LoaderProvider = ({
  children,
  ...value
}: LoaderContextValue & { children: ReactNode }) => {
  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
}

export const useLoader = () => {
  const context = useContext(LoaderContext)
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider")
  }
  return context
}
