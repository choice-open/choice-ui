import { HTMLAttributes, memo } from "react"

export interface ResizeHandleProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const ResizeHandle = memo(function ResizeHandle({ className, ...props }: ResizeHandleProps) {
  return (
    <div
      className={className}
      {...props}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.11111 2L2 9.11111M10 6.44444L6.44444 10"
          className="stroke-secondary-foreground"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
})

ResizeHandle.displayName = "ResizeHandle"
