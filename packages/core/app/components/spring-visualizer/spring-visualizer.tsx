import { useEffect, useState } from "react"
import { tv } from "tailwind-variants"
import { tcx } from "~/utils"

interface SpringVisualizerProps extends React.ComponentPropsWithoutRef<"svg"> {
  classNames?: {
    base?: string
    curve?: string
  }
  damping: number
  delay: number
  endColor?: string
  mainColor?: string
  mass: number
  size?: { height: number; width: number }
  startColor?: string
  stiffness: number
  strokeWidth?: number
}

export const SpringVisualizer = ({
  classNames,
  size = { width: 256, height: 128 },
  strokeWidth = 2,
  stiffness = 100,
  damping = 30,
  mass = 1,
  delay = 0,
  startColor = "var(--color-accent-foreground)",
  endColor = "var(--color-default-boundary)",
}: SpringVisualizerProps) => {
  const [path, setPath] = useState("")

  const SpringVisualizerVariants = tv({
    slots: {
      base: "overflow-visible",
      curve: "stroke-[url(#springGradient)]",
    },
  })

  useEffect(() => {
    const generateDampedSpringPath = (stiffness: number, damping: number, mass: number) => {
      const numPoints = 200
      const amplitude = size.height / 2 - strokeWidth * 2
      const naturalFrequency = Math.sqrt(stiffness / mass)
      const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass))
      let path = ""

      const startTime = 0
      const endTime = mass

      const initialY = size.height / 2

      const skipPoints = 4

      for (let i = skipPoints; i <= numPoints; i++) {
        const t = startTime + (i / numPoints) * (endTime - startTime)
        let displacement

        if (dampingRatio < 1) {
          const dampedFrequency = naturalFrequency * Math.sqrt(1 - dampingRatio ** 2)
          displacement =
            Math.exp(-dampingRatio * naturalFrequency * t) * Math.cos(dampedFrequency * t)
        } else if (dampingRatio === 1) {
          displacement = Math.exp(-naturalFrequency * t) * (1 + naturalFrequency * t)
        } else {
          const r1 = -naturalFrequency * (dampingRatio - Math.sqrt(dampingRatio ** 2 - 1))
          const r2 = -naturalFrequency * (dampingRatio + Math.sqrt(dampingRatio ** 2 - 1))
          displacement = Math.exp(r1 * t) - Math.exp(r2 * t)
        }

        const y = initialY + amplitude * displacement
        const x = ((i / numPoints) * size.width).toFixed(2)

        if (i === skipPoints) {
          path += `M ${x} ${y.toFixed(2)}`
        } else {
          path += ` L ${x} ${y.toFixed(2)}`
        }
      }

      return path
    }

    const timeoutId = setTimeout(() => {
      setPath(generateDampedSpringPath(stiffness, damping, mass))
    }, delay * 1000)

    return () => clearTimeout(timeoutId)
  }, [stiffness, damping, mass, size, strokeWidth, delay])

  const { base, curve } = SpringVisualizerVariants({})

  return (
    <svg
      className={tcx(
        base({
          class: classNames?.base,
        }),
        classNames,
      )}
      style={
        {
          "--start-color": startColor,
          "--end-color": endColor,
        } as React.CSSProperties
      }
      xmlns="http://www.w3.org/2000/svg"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
    >
      <defs>
        <linearGradient
          id="springGradient"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
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
