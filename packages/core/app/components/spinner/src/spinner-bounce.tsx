import { tcx } from "@choiceform/design-shared"
import { useMemo } from "react"
import { SpinnerBounceVariant } from "./tv"

interface SpinnerBounceProps {
  className?: string
  classNames?: {
    base?: string
    container?: string
    label?: string
    shape?: string
  }
  label?: string
  size?: "small" | "medium" | "large"
  variant?: "default" | "primary"
}

export const SpinnerBounce = ({
  className,
  classNames,
  size = "medium",
  variant,
  label,
  ...reset
}: SpinnerBounceProps) => {
  const shapeSize = {
    small: 4,
    medium: 6,
    large: 8,
  }[size]

  const style = {
    "--container": `${shapeSize * 4}px`,
    "--shape": `${shapeSize}px`,
  } as React.CSSProperties

  const slots = useMemo(
    () =>
      SpinnerBounceVariant({
        size,
        variant,
      }),
    [size, variant],
  )

  return (
    <div
      role="status"
      data-slot="base"
      aria-label="Loading"
      className={tcx(slots.base({ class: classNames?.base }), className)}
      style={style}
      {...reset}
    >
      <div
        data-slot="container"
        className={slots.container({ class: classNames?.container })}
      >
        <div
          data-slot="shape"
          className={slots.shape({ class: classNames?.shape })}
        />
        <div
          data-slot="shape"
          className={slots.shape({ class: classNames?.shape })}
        />
      </div>
      {label && (
        <span
          data-slot="label"
          className={slots.label({
            class: classNames?.label,
          })}
        >
          {label}
        </span>
      )}
    </div>
  )
}
