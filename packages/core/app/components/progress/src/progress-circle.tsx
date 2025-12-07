import { tcx } from "@choiceform/design-shared"
import React, { createContext, forwardRef, useContext, useMemo } from "react"
import tinycolor from "tinycolor2"
import { progressCircleTv } from "./tv"

export interface ProgressCircleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "role"> {
  dynamicColors?: Array<string | { at?: number; color: string }>
  max?: number
  min?: number
  size?: number
  strokeWidth?: number
  value?: number
  variant?: "accent" | "default" | "based-on-value" | "reset"
}

interface ProgressCircleContextValue {
  percent: number
  size: number
  strokeColor?: string
  strokeWidth: number
  tv: ReturnType<typeof progressCircleTv>
  variant: NonNullable<ProgressCircleProps["variant"]>
}

const ProgressCircleContext = createContext<ProgressCircleContextValue | null>(null)

function useProgressCircleContext() {
  const ctx = useContext(ProgressCircleContext)
  if (!ctx) throw new Error("ProgressCircle subcomponents must be used within <ProgressCircle>")
  return ctx
}

const ProgressCircleBase = forwardRef<HTMLDivElement, ProgressCircleProps>(
  function ProgressCircle(props, ref) {
    const {
      className,
      value = 0,
      min = 0,
      max = 100,
      size = 64,
      strokeWidth = size / 16,
      variant = "accent",
      dynamicColors,
      "aria-label": ariaLabel,
      ...rest
    } = props

    const percent = useMemo(() => {
      const clamped = Math.min(Math.max(value, min), max)
      const ratio = max === min ? 0 : (clamped - min) / (max - min)
      return Math.round(ratio * 100)
    }, [value, min, max])

    const tv = progressCircleTv({ variant })

    const center = size / 2
    const radius = center - strokeWidth
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percent / 100) * circumference

    // Resolve dynamic stroke color when variant is based-on-value
    const strokeColor = useMemo(() => {
      if (variant !== "based-on-value") return undefined
      const total = max - min
      const t = total <= 0 ? 0 : (value - min) / total
      const colors = (dynamicColors ?? ["#ef4444", "#f59e0b", "#22c55e"]).map((s) =>
        typeof s === "string" ? { at: undefined as number | undefined, color: s } : s,
      )

      let stops = colors
      const anyHasAt = stops.some((s) => typeof s.at === "number")
      if (!anyHasAt) {
        const n = Math.max(stops.length - 1, 1)
        stops = stops.map((s, i) => ({ at: i / n, color: s.color }))
      } else {
        const withAt = stops
          .map((s, i) => ({ ...s, i }))
          .filter((s) => typeof s.at === "number") as Array<{
          at: number
          color: string
          i: number
        }>
        const withoutAt = stops
          .map((s, i) => ({ ...s, i }))
          .filter((s) => typeof s.at !== "number") as Array<{
          at?: number
          color: string
          i: number
        }>
        withAt.forEach((s) => (s.at = Math.min(1, Math.max(0, s.at))))
        withAt.sort((a, b) => a.at - b.at)
        if (withAt.length === 0) {
          const n = Math.max(stops.length - 1, 1)
          stops = stops.map((s, i) => ({ at: i / n, color: s.color }))
        } else {
          const result: Array<{ at: number; color: string }> = Array(stops.length)
          for (const s of withAt) result[s.i] = { at: s.at, color: s.color }
          const before = withoutAt.filter((x) => x.i < withAt[0].i).sort((a, b) => a.i - b.i)
          before.forEach((s, idx) => {
            const count = before.length + 1
            result[s.i] = { at: (withAt[0].at * (idx + 1)) / count, color: s.color }
          })
          const after = withoutAt
            .filter((x) => x.i > withAt[withAt.length - 1].i)
            .sort((a, b) => a.i - b.i)
          after.forEach((s, idx) => {
            const count = after.length + 1
            result[s.i] = {
              at:
                withAt[withAt.length - 1].at +
                ((1 - withAt[withAt.length - 1].at) * (idx + 1)) / count,
              color: s.color,
            }
          })
          for (let k = 0; k < withAt.length - 1; k++) {
            const left = withAt[k]
            const right = withAt[k + 1]
            const between = withoutAt
              .filter((x) => x.i > left.i && x.i < right.i)
              .sort((a, b) => a.i - b.i)
            between.forEach((s, idx) => {
              const count = between.length + 1
              result[s.i] = {
                at: left.at + ((right.at - left.at) * (idx + 1)) / count,
                color: s.color,
              }
            })
          }
          stops = stops.map((s, i) => result[i] ?? { at: 1, color: s.color })
        }
      }
      stops.sort((a, b) => a.at! - b.at!)
      const tt = Math.min(1, Math.max(0, t))
      let left = stops[0]
      let right = stops[stops.length - 1]
      for (let i = 0; i < stops.length - 1; i++) {
        const a = stops[i]
        const b = stops[i + 1]
        if (tt >= (a.at as number) && tt <= (b.at as number)) {
          left = a
          right = b
          break
        }
      }
      const span = (right.at as number) - (left.at as number)
      const localT = span <= 0 ? 0 : (tt - (left.at as number)) / span
      return tinycolor.mix(left.color, right.color, localT * 100).toHexString()
    }, [variant, dynamicColors, value, min, max])

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={percent}
        aria-valuetext={`${percent}%`}
        aria-label={ariaLabel}
        className={tcx(tv.root(), className)}
        {...rest}
      >
        <ProgressCircleContext.Provider
          value={{ percent, size, strokeWidth, variant: variant!, tv, strokeColor }}
        >
          <svg
            className={tv.svg()}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
          >
            <circle
              className={tv.track()}
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
            />
            <circle
              className={tv.fill()}
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${center} ${center})`}
              style={variant === "based-on-value" ? { stroke: strokeColor } : undefined}
            />
          </svg>
          {props.children}
        </ProgressCircleContext.Provider>
      </div>
    )
  },
)

ProgressCircleBase.displayName = "ProgressCircle"

const Value = (props: React.HTMLAttributes<HTMLSpanElement>) => {
  const { percent, tv } = useProgressCircleContext()
  const { className, children, ...rest } = props
  return (
    <span
      className={tcx(tv.value(), className)}
      {...rest}
    >
      {children ?? `${percent}%`}
    </span>
  )
}
Value.displayName = "ProgressCircle.Value"

type ProgressCircleComponent = typeof ProgressCircleBase & {
  Value: typeof Value
}

export const ProgressCircle: ProgressCircleComponent = Object.assign(ProgressCircleBase, {
  Value,
})
