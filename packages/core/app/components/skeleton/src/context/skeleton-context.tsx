import { createContext, useContext, type ReactNode } from "react"

export interface SkeletonContextValue {
  loading: boolean
}

const SkeletonContext = createContext<SkeletonContextValue | undefined>(undefined)

export function useSkeletonContext(): SkeletonContextValue | undefined {
  return useContext(SkeletonContext)
}

export interface SkeletonProviderProps {
  children: ReactNode
  loading: boolean
}

export function SkeletonProvider({ children, loading }: SkeletonProviderProps) {
  return <SkeletonContext.Provider value={{ loading }}>{children}</SkeletonContext.Provider>
}

export { SkeletonContext }
