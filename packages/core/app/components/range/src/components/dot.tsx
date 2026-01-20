import { tcx } from "@choice-ui/shared"
import { forwardRef } from "react"
import { useRangeContext } from "../context/range-context"
import { useRangeTupleContext } from "../context/range-tuple-context"
import { rangeTv } from "../tv"

export interface RangeDotProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export interface RangeTupleDotProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

// Helper function to compute dot status (moved outside component to avoid recreating)
function getDotStatus(isOver: boolean, isDefault: boolean): string {
  if (isOver && isDefault) return "default-over"
  if (isOver) return "over"
  if (isDefault) return "default"
  return "under"
}

export const RangeDot = forwardRef<HTMLDivElement, RangeDotProps>(function RangeDot(props, ref) {
  const { className, ...rest } = props

  const {
    currentValue,
    step,
    transforms,
    thumbSize,
    defaultStepValue,
    dotsData,
    defaultDotPosition,
    defaultValue,
    tv,
  } = useRangeContext()

  const hasStepOrDefault = step > 1 || defaultValue !== undefined

  if (!hasStepOrDefault) {
    return null
  }

  const renderDots = () => {
    if (dotsData) {
      const { minTransform, maxTransform } = transforms

      return dotsData.map(({ value: dotValue, position: dotPosition }, idx) => {
        const dotTransform = minTransform + dotPosition * (maxTransform - minTransform)

        const isDefault = defaultStepValue === dotValue
        const isOver = dotValue <= currentValue

        const { dot } = rangeTv({
          defaultStepValue: isDefault,
          overStepValue: isOver,
        })

        return (
          <div
            key={dotValue}
            ref={idx === 0 ? ref : undefined}
            className={tcx(dot(), className)}
            data-status={getDotStatus(isOver, isDefault)}
            style={{
              left: dotTransform + thumbSize / 2,
            }}
            {...rest}
          />
        )
      })
    }

    if (defaultDotPosition !== null && defaultDotPosition !== undefined && defaultStepValue) {
      const isOver = defaultStepValue <= currentValue

      return (
        <div
          ref={ref}
          className={tcx(rangeTv({ defaultStepValue: true }).dot(), className)}
          data-status={isOver ? "over" : "default"}
          style={{
            left:
              transforms.minTransform +
              defaultDotPosition * (transforms.maxTransform - transforms.minTransform) +
              thumbSize / 2,
          }}
          {...rest}
        />
      )
    }

    return null
  }

  return <div className={tv.dotContainer()}>{renderDots()}</div>
})

RangeDot.displayName = "RangeDot"

export const RangeTupleDot = forwardRef<HTMLDivElement, RangeTupleDotProps>(
  function RangeTupleDot(props, ref) {
    const { className, ...rest } = props

    const {
      currentValue,
      step,
      transforms,
      thumbSize,
      defaultStepValue,
      dotsData,
      defaultDotPositions,
      normalizedDefaultValue,
      tv,
    } = useRangeTupleContext()

    const hasStepOrDefault = step > 1 || normalizedDefaultValue !== undefined

    if (!hasStepOrDefault) {
      return null
    }

    const renderDots = () => {
      if (dotsData) {
        const { minTransform, maxTransform } = transforms

        return dotsData.map(({ value: dotValue, position: dotPosition }, idx) => {
          const dotTransform = minTransform + dotPosition * (maxTransform - minTransform)

          const isWithinRange = dotValue >= currentValue[0] && dotValue <= currentValue[1]
          const isDefaultValue = defaultStepValue?.includes(dotValue)

          const { dot } = rangeTv({
            defaultStepValue: isDefaultValue,
            overStepValue: isWithinRange,
          })

          return (
            <div
              key={dotValue}
              ref={idx === 0 ? ref : undefined}
              className={tcx(dot(), className)}
              data-status={getDotStatus(isWithinRange, !!isDefaultValue)}
              data-position={idx === 0 ? "left" : "right"}
              style={{
                left: dotTransform + thumbSize / 2,
              }}
              {...rest}
            />
          )
        })
      }

      if (defaultDotPositions && defaultStepValue) {
        const leftIsOver = defaultStepValue[0] >= currentValue[0]
        const rightIsOver = defaultStepValue[1] <= currentValue[1]

        return defaultDotPositions.map((position, idx) => (
          <div
            key={`default-${idx}`}
            ref={idx === 0 ? ref : undefined}
            className={tcx(rangeTv({ defaultStepValue: true }).dot(), className)}
            data-status={
              leftIsOver && idx === 0
                ? "left-over"
                : rightIsOver && idx === 1
                  ? "right-over"
                  : "default"
            }
            data-position={idx === 0 ? "left" : "right"}
            style={{
              left:
                transforms.minTransform +
                position * (transforms.maxTransform - transforms.minTransform) +
                thumbSize / 2,
            }}
            {...rest}
          />
        ))
      }

      return null
    }

    return <div className={tv.dotContainer()}>{renderDots()}</div>
  },
)

RangeTupleDot.displayName = "RangeTupleDot"
