import { tcx } from "@choiceform/design-shared"
import { Label } from "@choiceform/label"
import React, { createContext, forwardRef, useCallback, useContext, useMemo } from "react"
import tinycolor from "tinycolor2"
import { progressBarTv } from "./tv"

export interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "role"> {
  dynamicColors?: Array<string | { at?: number; color: string }>
  indeterminate?: boolean
  max?: number
  min?: number
  showValue?: boolean
  size?: "small" | "large" | "default"
  striped?: boolean
  value?: number
  variant?: "accent" | "default" | "reset" | "based-on-value"
}

interface ProgressBarContextValue {
  basedOnValueColor?: string
  percent: number
  striped: boolean
  tv: ReturnType<typeof progressBarTv>
  variant: NonNullable<ProgressBarProps["variant"]>
}

const ProgressBarContext = createContext<ProgressBarContextValue | null>(null)

function useProgressBarContext() {
  const ctx = useContext(ProgressBarContext)
  if (!ctx) {
    throw new Error(
      "ProgressBar subcomponents must be used within <ProgressBar>\u2014<ProgressBar.Track> / <ProgressBar.Fill> inside",
    )
  }
  return ctx
}

const ProgressBarBase = forwardRef<HTMLDivElement, ProgressBarProps>(
  function ProgressBarBase(props, ref) {
    const {
      className,
      children,
      value = 0,
      min = 0,
      max = 100,
      showValue,
      size = "small",
      variant = "accent",
      indeterminate = false,
      striped = false,
      dynamicColors = ["#ff2b3a", "#ff9900", "#00d046"],
      "aria-label": ariaLabel,
      ...rest
    } = props

    const percent = useMemo(() => {
      const clamped = Math.min(Math.max(value, min), max)
      const ratio = max === min ? 0 : (clamped - min) / (max - min)
      return Math.round(ratio * 100)
    }, [value, min, max])

    const getAriaValueText = useCallback(() => `${percent}%`, [percent])
    const tv = progressBarTv({ size, variant, indeterminate, striped })

    const basedOnValueColor = useMemo(() => {
      if (variant !== "based-on-value") return undefined
      const total = max - min
      const t = total <= 0 ? 0 : (value - min) / total

      let stops = dynamicColors.map((s) =>
        typeof s === "string" ? { at: undefined as number | undefined, color: s } : s,
      )

      const anyHasAt = stops.some((s) => typeof s.at === "number")
      if (!anyHasAt) {
        const n = Math.max(stops.length - 1, 1)
        stops = stops.map((s, i) => ({ color: s.color, at: i / n }))
      } else {
        // Clamp provided ats and collect known/unknown
        stops = stops.map((s) => ({ at: s.at, color: s.color }))
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
          stops = stops.map((s, i) => ({ color: s.color, at: i / n }))
        } else {
          const result: Array<{ at: number; color: string }> = Array(stops.length)
          // Place known
          for (const s of withAt) result[s.i] = { at: s.at, color: s.color }
          // Before first
          const before = withoutAt.filter((x) => x.i < withAt[0].i).sort((a, b) => a.i - b.i)
          before.forEach((s, idx) => {
            const count = before.length + 1
            result[s.i] = { at: (withAt[0].at * (idx + 1)) / count, color: s.color }
          })
          // After last
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
          // Between anchors
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
      const mixed = tinycolor.mix(left.color, right.color, localT * 100)
      return mixed.toHexString()
    }, [variant, dynamicColors, value, min, max])

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : percent}
        aria-valuetext={indeterminate ? undefined : getAriaValueText()}
        aria-label={ariaLabel}
        className={tcx(tv.root(), className)}
        {...rest}
      >
        <ProgressBarContext.Provider
          value={{ percent, tv, striped, variant: variant!, basedOnValueColor }}
        >
          {children}
        </ProgressBarContext.Provider>
      </div>
    )
  },
)

ProgressBarBase.displayName = "ProgressBar"

interface ProgressBarLabelProps extends React.ComponentProps<typeof Label> {
  indeterminate?: boolean
  showValue?: boolean
}

const ProgressBarLabel = (props: ProgressBarLabelProps) => {
  const { className, showValue, indeterminate, children, ...rest } = props
  const { percent } = useProgressBarContext()
  const getAriaValueText = useCallback(() => `${percent}%`, [percent])

  const { tv } = useProgressBarContext()

  return (
    <Label
      className={tcx(tv.label(), className)}
      action={
        showValue &&
        !indeterminate && (
          <div className={tv.labelWrapper()}>
            <span className={tv.value()}>{getAriaValueText()}</span>
          </div>
        )
      }
      {...rest}
    >
      {children}
    </Label>
  )
}

const Track = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { tv } = useProgressBarContext()
  const { className, children, ...rest } = props
  return (
    <div
      className={tcx(tv.track(), className)}
      {...rest}
    >
      {children}
    </div>
  )
}

interface FillProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: React.CSSProperties
}

const Connects = (props: FillProps) => {
  const { percent, tv, striped, variant, basedOnValueColor } = useProgressBarContext()
  const { className, style, ...rest } = props
  const fillStyle = useMemo(() => {
    return {
      transform: `translateX(${percent - 100}%)`,
      backgroundSize: striped ? "1.25rem 1.25rem" : undefined,
      backgroundImage: striped
        ? "linear-gradient(45deg,rgba(255,255,255,.2) 25%,transparent 0,transparent 50%,rgba(255,255,255,.2) 0,rgba(255,255,255,.2) 75%,transparent 0,transparent)"
        : undefined,
      backgroundColor: variant === "based-on-value" ? basedOnValueColor : style?.backgroundColor,
      ...style,
    } as React.CSSProperties
  }, [percent, striped, style, variant, basedOnValueColor])
  return (
    <div
      className={tcx(tv.connects(), className)}
      style={fillStyle}
      {...rest}
    />
  )
}

type ProgressBarComponent = typeof ProgressBarBase & {
  Connects: typeof Connects
  Label: typeof ProgressBarLabel
  Track: typeof Track
}

export const ProgressBar: ProgressBarComponent = Object.assign(ProgressBarBase, {
  Label: ProgressBarLabel,
  Track,
  Connects,
})
