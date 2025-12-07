import type { ReactNode } from "react"

export interface LoaderStage {
  icon?: ReactNode | ReactNode[]
  label: string
}

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStage?: number
  duration?: number
  onStageChange?: (stage: number) => void
  stages: LoaderStage[]
}
