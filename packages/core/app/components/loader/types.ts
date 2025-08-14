import type { ReactNode } from "react"

export interface LoaderStage {
  label: string
  icon?: ReactNode | ReactNode[]
}

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  stages: LoaderStage[]
  currentStage?: number
  onStageChange?: (stage: number) => void
  duration?: number
}
