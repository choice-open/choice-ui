import { forwardRef, HTMLProps, memo } from "react"

export const FieldDescription = memo(
  forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(function FieldDescription(props, ref) {
    return (
      <div
        ref={ref}
        {...props}
      />
    )
  }),
)
