import { tcx } from "@choiceform/design-shared"
import { useMemo } from "react"
import { SpinnerSpinVariant } from "./tv"

export interface SpinnerSpinProps {
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

export const SpinnerSpin = ({
  className,
  classNames,
  label,
  size = "medium",
  variant,
  ...reset
}: SpinnerSpinProps) => {
  const style = useMemo(() => {
    const containerSize = {
      small: 16,
      medium: 24,
      large: 32,
    }[size]

    return {
      "--container": `${containerSize}px`,
      "--shape": `${containerSize / 3}px`,
      "--bounce": "calc(var(--container) - var(--shape))",
    } as React.CSSProperties
  }, [size])

  const slots = useMemo(
    () =>
      SpinnerSpinVariant({
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
      {...reset}
    >
      <div
        data-slot="container"
        className={slots.container({ class: classNames?.container })}
        style={style}
      >
        {[...Array(4)].map((_, index) => (
          <i
            key={index}
            className={slots.shape({ class: classNames?.shape })}
          />
        ))}
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
