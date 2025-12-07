import { tcv, tcx } from "@choiceform/design-shared"
import { useEffect, useMemo, useState } from "react"

interface SpringVisualizerProps extends React.ComponentPropsWithoutRef<"svg"> {
  bounce?: number
  classNames?: {
    base?: string
    curve?: string
  }
  damping?: number
  delay?: number
  duration?: number
  endColor?: string
  mainColor?: string
  mass?: number
  mode?: "physics" | "time"
  size?: { height: number; width: number }
  startColor?: string
  stiffness?: number
  strokeWidth?: number
}

const DEFAULT_SIZE = { width: 256, height: 128 } as const

const SpringVisualizerVariants = tcv({
  slots: {
    base: "overflow-visible",
    curve: "stroke-[url(#springGradient)]",
  },
})

export const SpringVisualizer = ({
  classNames,
  size,
  strokeWidth = 2,
  stiffness = 100,
  damping = 30,
  mass = 1,
  delay = 0,
  mode = "physics",
  duration = 0.8,
  bounce = 0.3,
  startColor = "var(--color-accent-foreground)",
  endColor = "var(--color-default-boundary)",
}: SpringVisualizerProps) => {
  const sizeValue = useMemo(() => size ?? DEFAULT_SIZE, [size])
  const sizeWidth = sizeValue.width
  const sizeHeight = sizeValue.height

  /** 根据 mode 计算 path */
  const generatedPath = useMemo(() => {
    return mode === "time"
      ? generateTimeSpringPath(duration, bounce, sizeWidth, sizeHeight, strokeWidth)
      : generatePhysicsSpringPath(stiffness, damping, mass, sizeWidth, sizeHeight, strokeWidth)
  }, [mode, duration, bounce, stiffness, damping, mass, sizeWidth, sizeHeight, strokeWidth])

  /** 控制 delay */
  const [path, setPath] = useState("")
  useEffect(() => {
    if (delay > 0) {
      const id = setTimeout(() => setPath(generatedPath), delay * 1000)
      return () => clearTimeout(id)
    } else {
      setPath(generatedPath)
    }
  }, [generatedPath, delay])

  const { base, curve } = SpringVisualizerVariants({})

  return (
    <svg
      className={tcx(base({ class: classNames?.base }))}
      style={
        {
          "--start-color": startColor,
          "--end-color": endColor,
        } as React.CSSProperties
      }
      xmlns="http://www.w3.org/2000/svg"
      width={sizeWidth}
      height={sizeHeight}
      viewBox={`0 0 ${sizeWidth} ${sizeHeight}`}
    >
      <defs>
        <linearGradient
          id="springGradient"
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={sizeHeight}
          x2={sizeWidth}
          y2={0}
        >
          <stop
            offset="0%"
            stopColor="var(--start-color)"
          />
          <stop
            offset="20%"
            stopColor="var(--start-color)"
          />
          <stop
            offset="80%"
            stopColor="var(--end-color)"
          />
          <stop
            offset="100%"
            stopColor="var(--end-color)"
          />
        </linearGradient>
      </defs>

      <path
        className={curve({ class: classNames?.curve })}
        d={path}
        fill="none"
        strokeWidth={strokeWidth}
        clipRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** physics 模式 */
const generatePhysicsSpringPath = (
  stiffness: number,
  damping: number,
  mass: number,
  sizeWidth: number,
  sizeHeight: number,
  strokeWidth: number,
) => {
  const numPoints = 200
  const amplitude = sizeHeight / 2 - strokeWidth * 2
  const naturalFrequency = Math.sqrt(stiffness / mass)
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass))
  let path = ""

  const startTime = 0
  const endTime = mass
  const initialY = sizeHeight / 2
  const skipPoints = 4

  for (let i = skipPoints; i <= numPoints; i++) {
    const t = startTime + (i / numPoints) * (endTime - startTime)
    let displacement

    if (dampingRatio < 1) {
      const dampedFrequency = naturalFrequency * Math.sqrt(1 - dampingRatio ** 2)
      displacement = Math.exp(-dampingRatio * naturalFrequency * t) * Math.cos(dampedFrequency * t)
    } else if (dampingRatio === 1) {
      displacement = Math.exp(-naturalFrequency * t) * (1 + naturalFrequency * t)
    } else {
      const r1 = -naturalFrequency * (dampingRatio - Math.sqrt(dampingRatio ** 2 - 1))
      const r2 = -naturalFrequency * (dampingRatio + Math.sqrt(dampingRatio ** 2 - 1))
      displacement = Math.exp(r1 * t) - Math.exp(r2 * t)
    }

    const y = initialY + amplitude * displacement
    const x = ((i / numPoints) * sizeWidth).toFixed(2)

    if (i === skipPoints) {
      path += `M ${x} ${y.toFixed(2)}`
    } else {
      path += ` L ${x} ${y.toFixed(2)}`
    }
  }

  return path
}

/** time 模式 */
const generateTimeSpringPath = (
  durationSec: number,
  bounceRatio: number,
  sizeWidth: number,
  sizeHeight: number,
  strokeWidth: number,
) => {
  const numPoints = 200
  const amplitude = sizeHeight / 2 - strokeWidth * 2
  let path = ""

  const initialY = sizeHeight / 2
  const d = Math.max(0, durationSec)
  const b = Math.min(1, Math.max(0, bounceRatio))

  if (d === 0) {
    // duration=0 时画一条基线
    const inset = Math.max(1, strokeWidth)
    const yBottom = Math.max(0, sizeHeight - inset - 4)
    const xStart = inset
    const xEnd = sizeWidth - inset
    return `M ${xStart.toFixed(2)} ${yBottom.toFixed(2)} L ${xEnd.toFixed(2)} ${yBottom.toFixed(2)}`
  }

  const oscillations = 1.5 + 3.5 * b
  const omega = (oscillations * Math.PI * 2) / d
  const decay = (4 - 3 * b) / d
  const skipPoints = 4

  for (let i = skipPoints; i <= numPoints; i++) {
    const t = (i / numPoints) * d
    const displacement = Math.exp(-decay * t) * Math.cos(omega * t)
    const y = initialY + amplitude * displacement
    const x = ((i / numPoints) * sizeWidth).toFixed(2)
    if (i === skipPoints) {
      path += `M ${x} ${y.toFixed(2)}`
    } else {
      path += ` L ${x} ${y.toFixed(2)}`
    }
  }

  return path
}
