import { tcx } from "@choice-ui/shared"
import React, { forwardRef, useMemo } from "react"
import { useRangeContext } from "../context/range-context"
import { useRangeTupleContext } from "../context/range-tuple-context"
import { rangeTv } from "../tv"

// ============================================================================
// Base Thumb Component
// ============================================================================

interface BaseThumbProps {
  className?: string
  thumbRef: React.MutableRefObject<HTMLDivElement | null>
  inputRef: React.MutableRefObject<HTMLInputElement | null>
  thumbSize: number
  transformX: number
  isDragging: boolean
  disabled: boolean
  readOnly: boolean
  tv: ReturnType<typeof rangeTv>
  thumbTv: ReturnType<typeof rangeTv>
  onPointerDown: (e: React.PointerEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  isDefaultValue?: boolean
}

const BaseThumb = forwardRef<HTMLDivElement, BaseThumbProps>(function BaseThumb(props, ref) {
  const {
    className,
    thumbRef,
    inputRef,
    thumbSize,
    transformX,
    isDragging,
    disabled,
    readOnly,
    tv,
    thumbTv,
    onPointerDown,
    onKeyDown,
    isDefaultValue,
  } = props

  const thumbStyle = useMemo(
    () => ({
      width: thumbSize,
      height: thumbSize,
      transform: `translate(${transformX}px, -50%)`,
      willChange: isDragging ? "transform" : "auto",
    }),
    [thumbSize, transformX, isDragging],
  )

  return (
    <div
      ref={(node) => {
        if (thumbRef && "current" in thumbRef) {
          thumbRef.current = node
        }
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      }}
      onPointerDown={onPointerDown}
      className={tv.thumbWrapper()}
      style={thumbStyle}
    >
      <div
        className={tcx(thumbTv.thumb(), className)}
        data-status={isDefaultValue ? "default" : undefined}
      >
        <input
          ref={(node) => {
            if (inputRef && "current" in inputRef) {
              inputRef.current = node
            }
          }}
          type="text"
          onKeyDown={onKeyDown}
          className={tv.input()}
          tabIndex={disabled || readOnly ? -1 : 0}
          readOnly
        />
      </div>
    </div>
  )
})

// ============================================================================
// Range Thumb (Single Value)
// ============================================================================

export interface RangeThumbProps {
  className?: string
  size?: number
}

export const RangeThumb = forwardRef<HTMLDivElement, RangeThumbProps>(
  function RangeThumb(props, ref) {
    // size prop is extracted by parent component and passed via context

    const { className, size: _size } = props

    const {
      disabled,
      readOnly,
      transforms,
      thumbSize,
      thumbRef,
      inputRef,
      isDragging,
      isDefaultValue,
      handlePointerDown,
      handleKeyDown,
      tv,
    } = useRangeContext()

    return (
      <BaseThumb
        ref={ref}
        className={className}
        thumbRef={thumbRef}
        inputRef={inputRef}
        thumbSize={thumbSize}
        transformX={transforms.transformX}
        isDragging={isDragging.current}
        disabled={disabled}
        readOnly={readOnly}
        tv={tv}
        thumbTv={tv}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        isDefaultValue={isDefaultValue}
      />
    )
  },
)

RangeThumb.displayName = "RangeThumb"

// ============================================================================
// Range Tuple Thumb (Dual Value)
// ============================================================================

type ThumbIndex = 0 | 1

export interface RangeTupleThumbProps {
  className?: string
  size?: number
  index: ThumbIndex
}

export const RangeTupleThumb = forwardRef<HTMLDivElement, RangeTupleThumbProps>(
  function RangeTupleThumb(props, ref) {
    // size prop is extracted by parent component and passed via context
    const { className, size: _size, index } = props

    const {
      disabled,
      readOnly,
      transforms,
      thumbSize,
      thumb0Ref,
      thumb1Ref,
      input0Ref,
      input1Ref,
      isDragging,
      isDefaultValue,
      handlePointerDown,
      handleKeyDown,
      tv,
      thumbTv0,
      thumbTv1,
    } = useRangeTupleContext()

    const thumbRef = index === 0 ? thumb0Ref : thumb1Ref
    const inputRef = index === 0 ? input0Ref : input1Ref
    const thumbTv = index === 0 ? thumbTv0 : thumbTv1
    const transformX = index === 0 ? transforms.transformX0 : transforms.transformX1

    return (
      <BaseThumb
        ref={ref}
        className={className}
        thumbRef={thumbRef}
        inputRef={inputRef}
        thumbSize={thumbSize}
        transformX={transformX}
        isDragging={isDragging.current === index}
        disabled={disabled}
        readOnly={readOnly}
        tv={tv}
        thumbTv={thumbTv}
        onPointerDown={(e) => handlePointerDown(e, index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        isDefaultValue={isDefaultValue}
      />
    )
  },
)

RangeTupleThumb.displayName = "RangeTupleThumb"
