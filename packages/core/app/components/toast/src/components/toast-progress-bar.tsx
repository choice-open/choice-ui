import { motion, useAnimationControls } from "framer-motion"
import { memo, useEffect, useRef } from "react"
import { toastRootTv } from "../tv"

export interface ToastProgressBarProps {
  duration: number
  isPaused: boolean
  tv: ReturnType<typeof toastRootTv>
}

export const ToastProgressBar = memo(function ToastProgressBar({
  duration,
  isPaused,
  tv,
}: ToastProgressBarProps) {
  const controls = useAnimationControls()
  const progressRef = useRef({ elapsed: 0, lastTime: Date.now() })

  // Initial animation start
  useEffect(() => {
    progressRef.current = { elapsed: 0, lastTime: Date.now() }
    controls.start({
      x: "-100%",
      transition: {
        duration: duration / 1000,
        ease: "linear",
      },
    })
  }, [controls, duration])

  // Handle pause/resume
  useEffect(() => {
    const durationSec = duration / 1000

    if (isPaused) {
      // Pause: stop the animation and record elapsed time
      const now = Date.now()
      progressRef.current.elapsed += (now - progressRef.current.lastTime) / 1000
      controls.stop()
    } else {
      // Resume: continue from where we left off
      const remaining = Math.max(0, durationSec - progressRef.current.elapsed)
      progressRef.current.lastTime = Date.now()

      if (remaining > 0) {
        controls.start({
          x: "-100%",
          transition: {
            duration: remaining,
            ease: "linear",
          },
        })
      }
    }
  }, [isPaused, controls, duration])

  return (
    <div className={tv.progressTrack()}>
      <motion.div
        className={tv.progressIndicator()}
        initial={{ x: 0 }}
        animate={controls}
      />
    </div>
  )
})

ToastProgressBar.displayName = "ToastProgressBar"
