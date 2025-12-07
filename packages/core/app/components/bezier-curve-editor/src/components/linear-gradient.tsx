interface LinearGradientProps {
  endColor?: string
  mainColor?: string
  startColor?: string
}

export const LinearGradient = (props: LinearGradientProps) => {
  const {
    startColor = "var(--color-accent-foreground)",
    endColor = "var(--color-danger-foreground)",
    mainColor = "var(--color-default-boundary)",
  } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="0"
      height="0"
      style={
        {
          "--main-color": mainColor,
          "--start-color": startColor,
          "--end-color": endColor,
        } as React.CSSProperties
      }
    >
      <defs>
        <linearGradient
          id="in"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop
            offset="0%"
            stopColor="var(--main-color)"
          />
          <stop
            offset="50%"
            stopColor="var(--main-color)"
          />
          <stop
            offset="70%"
            stopColor="var(--end-color)"
          />
          <stop
            offset="100%"
            stopColor="var(--end-color)"
          />
        </linearGradient>
        <linearGradient
          id="out"
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
            offset="30%"
            stopColor="var(--start-color)"
          />
          <stop
            offset="50%"
            stopColor="var(--main-color)"
          />
          <stop
            offset="100%"
            stopColor="var(--main-color)"
          />
        </linearGradient>
        <linearGradient
          id="inOut"
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
    </svg>
  )
}
