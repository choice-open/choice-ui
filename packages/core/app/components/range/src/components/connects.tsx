import { tcx } from "@choice-ui/shared"
import { forwardRef, useMemo } from "react"
import { useRangeContext } from "../context/range-context"
import { useRangeTupleContext } from "../context/range-tuple-context"
import { rangeTv } from "../tv"

// ============================================================================
// Range Connects (仅连接条)
// ============================================================================

export interface RangeConnectsProps {
  className?: string
}

export const RangeConnects = forwardRef<HTMLDivElement, RangeConnectsProps>(
  function RangeConnects(props, ref) {
    const { className } = props

    const { currentValue, disabled, min, transforms, thumbSize, trackHeight, tv } =
      useRangeContext()

    const connectsStatus = useMemo(() => {
      if (disabled) return "disabled"
      if (currentValue < 0) return "negative"
      return "positive"
    }, [disabled, currentValue])

    const connectStyle = useMemo(() => {
      return {
        left:
          min < 0
            ? currentValue < 0
              ? `${transforms.transformX + thumbSize / 2}px`
              : "50%"
            : trackHeight / 2 + "px",
        right:
          min < 0
            ? currentValue >= 0
              ? `calc(100% - ${transforms.transformX + thumbSize / 2}px)`
              : "50%"
            : `calc(100% - ${transforms.transformX + thumbSize / 2}px)`,
        height: trackHeight,
      }
    }, [min, currentValue, transforms.transformX, thumbSize, trackHeight])

    return (
      <div
        ref={ref}
        className={tcx(tv.connect(), disabled && "bg-disabled-background", className)}
        data-connect-status={connectsStatus}
        style={connectStyle}
      />
    )
  },
)

RangeConnects.displayName = "RangeConnects"

// ============================================================================
// Range Container (包含 track 背景和 dots)
// ============================================================================

export interface RangeContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
  height?: number
}

// RangeContainer is a logical component that renders multiple siblings (Fragment)
// It doesn't wrap content in a DOM element, so ref forwarding is not applicable
export function RangeContainer(props: RangeContainerProps) {
  // height prop is extracted by parent component and passed via context
  const { children, className, height: _height, ...rest } = props

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
    hasCustomDot,
    hasCustomConnects,
  } = useRangeContext()

  const hasStepOrDefault = step > 1 || defaultValue !== undefined

  const renderDots = () => {
    if (dotsData) {
      const { minTransform, maxTransform } = transforms

      return dotsData.map(({ value: dotValue, position: dotPosition }) => {
        const dotTransform = minTransform + dotPosition * (maxTransform - minTransform)
        const { dot } = rangeTv({
          defaultStepValue: defaultStepValue === dotValue,
          overStepValue: dotValue <= currentValue,
        })
        return (
          <div
            key={dotValue}
            className={dot()}
            style={{
              left: dotTransform + thumbSize / 2,
            }}
          />
        )
      })
    }

    if (defaultDotPosition !== null && defaultDotPosition !== undefined) {
      return (
        <div
          className={rangeTv({ defaultStepValue: true }).dot()}
          style={{
            left:
              transforms.minTransform +
              defaultDotPosition * (transforms.maxTransform - transforms.minTransform) +
              thumbSize / 2,
          }}
        />
      )
    }

    return null
  }

  return (
    <>
      {/* Render default Connects if no custom children */}
      {!hasCustomConnects && (
        <RangeConnects
          className={tcx(tv.connect(), className)}
          {...rest}
        />
      )}

      {/* Render custom children (e.g., custom Connects) */}
      {children}

      {hasStepOrDefault && !hasCustomDot && (
        <div className={tv.dotContainer()}>{renderDots()}</div>
      )}
    </>
  )
}

RangeContainer.displayName = "RangeContainer"

// ============================================================================
// Range Tuple Connects (仅连接条)
// ============================================================================

export interface RangeTupleConnectsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const RangeTupleConnects = forwardRef<HTMLDivElement, RangeTupleConnectsProps>(
  function RangeTupleConnects(props, ref) {
    const { className, ...rest } = props

    const { transforms, thumbSize, trackHeight, tv } = useRangeTupleContext()

    const connectStyle = useMemo(() => {
      return {
        left: `${transforms.transformX0 + thumbSize / 2}px`,
        right: `calc(100% - ${transforms.transformX1 + thumbSize / 2}px)`,
        height: trackHeight,
      }
    }, [transforms.transformX0, transforms.transformX1, thumbSize, trackHeight])

    return (
      <div
        ref={ref}
        className={tcx(tv.connect(), className)}
        style={connectStyle}
        {...rest}
      />
    )
  },
)

RangeTupleConnects.displayName = "RangeTupleConnects"

// ============================================================================
// Range Tuple Container (包含 track 背景和 dots)
// ============================================================================

export interface RangeTupleContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
  height?: number
}

// RangeTupleContainer is a logical component that renders multiple siblings (Fragment)
// It doesn't wrap content in a DOM element, so ref forwarding is not applicable
export function RangeTupleContainer(props: RangeTupleContainerProps) {
  // height prop is extracted by parent component and passed via context
  const { children, className, height: _height, ...rest } = props

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
    hasCustomDot,
    hasCustomConnects,
  } = useRangeTupleContext()

  const hasStepOrDefault = step > 1 || normalizedDefaultValue !== undefined

  const renderDots = () => {
    if (dotsData) {
      const { minTransform, maxTransform } = transforms

      return dotsData.map(({ value: dotValue, position: dotPosition }) => {
        const dotTransform = minTransform + dotPosition * (maxTransform - minTransform)

        // Check if dot is within the selected range
        const isWithinRange = dotValue >= currentValue[0] && dotValue <= currentValue[1]
        const isDefaultValue = defaultStepValue?.includes(dotValue)

        const { dot } = rangeTv({
          defaultStepValue: isDefaultValue,
          overStepValue: isWithinRange,
        })

        return (
          <div
            key={dotValue}
            className={dot()}
            style={{
              left: dotTransform + thumbSize / 2,
            }}
          />
        )
      })
    }

    if (defaultDotPositions) {
      return defaultDotPositions.map((position, idx) => (
        <div
          key={`default-${idx}`}
          className={rangeTv({ defaultStepValue: true }).dot()}
          style={{
            left:
              transforms.minTransform +
              position * (transforms.maxTransform - transforms.minTransform) +
              thumbSize / 2,
          }}
        />
      ))
    }

    return null
  }

  return (
    <>
      {/* Render default Connects if no custom children */}
      {!hasCustomConnects && (
        <RangeTupleConnects
          className={tcx(tv.connect(), className)}
          {...rest}
        />
      )}

      {/* Render custom children (e.g., custom Connects) */}
      {children}

      {hasStepOrDefault && !hasCustomDot && (
        <div className={tv.dotContainer()}>{renderDots()}</div>
      )}
    </>
  )
}

RangeTupleContainer.displayName = "RangeTupleContainer"
