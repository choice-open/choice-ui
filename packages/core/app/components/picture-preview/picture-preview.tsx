import { Add, Delete, ImageRemove, InfoSquare, LoaderCircle, Reload } from "@choiceform/icons-react"
import { forwardRef, HTMLProps, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { tcx } from "~/utils"
import { Dropdown } from "../dropdown"
import { IconButton } from "../icon-button"
import { HOTKEYS, Position, useDraggable, useHotkeys, useWheelHandler } from "./hooks"
import { PicturePreviewTv } from "./tv"

const MIN_ZOOM = 0.01
const MAX_ZOOM = 10
const ZOOM_STEP = 0.1
const INITIAL_ZOOM = 1

interface PicturePreviewProps extends HTMLProps<HTMLDivElement> {
  src: string
  fileName?: string
  onClose?: () => void
  defaultText?: {
    zoomIn: string
    zoomOut: string
    zoomTo50: string
    zoomTo100: string
    zoomTo200: string
    fitToScreen: string
    error: string
  }
}

export const PicturePreview = forwardRef<HTMLDivElement, PicturePreviewProps>((props, ref) => {
  const {
    src,
    fileName,
    className,
    onClose,
    defaultText = {
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      zoomReset: "Reset zoom",
      fitToScreen: "Fit to screen",
      zoomTo50: "Zoom to 50%",
      zoomTo100: "Zoom to 100%",
      zoomTo200: "Zoom to 200%",
      error: "Image loading failed, please try again.",
    },
    ...rest
  } = props

  const [zoom, setZoom] = useState(INITIAL_ZOOM)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const internalRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const zoomRef = useRef(zoom)

  const rafId = useRef<number | null>(null)

  const scheduleUpdate = useCallback(() => {
    if (rafId.current !== null) {
      return
    }

    rafId.current = requestAnimationFrame(() => {
      setZoom(zoomRef.current)
      rafId.current = null
    })
  }, [])

  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  const { position, isDragging, handleMouseDown, updatePosition, positionRef } = useDraggable()

  const handleZoomChange = useCallback(
    (newZoom: number) => {
      zoomRef.current = newZoom
      scheduleUpdate()
    },
    [scheduleUpdate],
  )

  const handlePositionChange = useCallback(
    (newPosition: Position) => {
      updatePosition(newPosition)
    },
    [updatePosition],
  )

  useWheelHandler(internalRef, zoomRef, positionRef, {
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    zoomStep: ZOOM_STEP,
    onZoom: handleZoomChange,
    onPan: handlePositionChange,
  })

  const zoomIn = useCallback(() => {
    handleZoomChange(Math.min(MAX_ZOOM, zoomRef.current + ZOOM_STEP))
  }, [handleZoomChange])

  const zoomOut = useCallback(() => {
    handleZoomChange(Math.max(MIN_ZOOM, zoomRef.current - ZOOM_STEP))
  }, [handleZoomChange])

  const resetView = useCallback(() => {
    zoomRef.current = INITIAL_ZOOM
    updatePosition({ x: 0, y: 0 })
    scheduleUpdate()
  }, [updatePosition, scheduleUpdate])

  const fitToView = useCallback(() => {
    if (!canvasRef.current) return

    zoomRef.current = 1
    updatePosition({ x: 0, y: 0 })
    scheduleUpdate()
  }, [updatePosition, scheduleUpdate])

  useHotkeys([
    {
      hotkey: HOTKEYS.ZOOM_IN,
      handler: () => zoomIn(),
    },
    {
      hotkey: HOTKEYS.ZOOM_OUT,
      handler: () => zoomOut(),
    },
    {
      hotkey: HOTKEYS.ZOOM_RESET,
      handler: () => resetView(),
    },
    {
      hotkey: HOTKEYS.FIT_TO_SCREEN,
      handler: () => fitToView(),
    },
  ])

  const handleZoomMenuItemClick = useCallback(
    (zoomLevel: number) => {
      zoomRef.current = zoomLevel
      scheduleUpdate()
    },
    [scheduleUpdate],
  )

  useEffect(() => {
    if (!internalRef.current) return

    if (typeof ref === "function") {
      ref(internalRef.current)
    } else if (ref) {
      try {
        ref.current = internalRef.current
      } catch (err) {
        console.warn("Unable to assign to ref.current. Ref may be read-only.")
      }
    }
  }, [ref])

  const transformStyle = useMemo(() => {
    return {
      transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
      willChange: "transform",
      backfaceVisibility: "hidden" as const,
    }
  }, [position.x, position.y, zoom, isDragging])

  useEffect(() => {
    setIsLoading(true)
    const img = new Image()
    img.src = src
    img.onload = () => {
      setIsLoading(false)
    }
    img.onerror = () => {
      setIsLoading(false)
    }
  }, [src])

  const styles = PicturePreviewTv({ isLoading, isError })

  return (
    <div
      ref={internalRef}
      className={tcx(styles.root(), className)}
      {...rest}
    >
      {isLoading && (
        <div className={styles.loading()}>
          <LoaderCircle
            className="animate-spin"
            width={32}
            height={32}
          />
        </div>
      )}
      {isError && (
        <div className={styles.loading()}>
          <ImageRemove
            width={32}
            height={32}
          />
          <span>{defaultText.error}</span>
        </div>
      )}

      <div className={styles.content()}>
        <div
          ref={canvasRef}
          className={styles.canvas()}
          style={transformStyle}
          onMouseDown={handleMouseDown}
        >
          <img
            src={src}
            alt={fileName || "Preview"}
            className={styles.image()}
            draggable={false}
            loading="eager"
            decoding="async"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsError(true)}
          />
        </div>
      </div>

      {isError || isLoading ? null : (
        <div className={styles.controlGroup()}>
          <IconButton
            onClick={zoomOut}
            className="rounded-none"
            size="large"
            tooltip={{
              content: defaultText.zoomOut,
              shortcut: {
                keys: "-",
                modifier: "command",
              },
            }}
          >
            <Delete />
          </IconButton>

          <Dropdown selection>
            <Dropdown.Trigger
              variant="ghost"
              className="border-x-default rounded-none"
              size="large"
            >
              <span className="flex-1">{Math.round(zoom * 100)}%</span>
            </Dropdown.Trigger>

            <Dropdown.Content>
              <Dropdown.Item
                onMouseUp={() => handleZoomMenuItemClick(zoomRef.current + ZOOM_STEP)}
                shortcut={{
                  keys: "+",
                  modifier: "command",
                }}
              >
                <span className="flex-1">{defaultText.zoomIn}</span>
              </Dropdown.Item>
              <Dropdown.Item
                onMouseUp={() => handleZoomMenuItemClick(zoomRef.current - ZOOM_STEP)}
                shortcut={{
                  keys: "-",
                  modifier: "command",
                }}
              >
                <span className="flex-1">{defaultText.zoomOut}</span>
              </Dropdown.Item>
              <Dropdown.Item
                selected={zoomRef.current === 0.5}
                onMouseUp={() => handleZoomMenuItemClick(0.5)}
              >
                <span className="flex-1">{defaultText.zoomTo50}</span>
              </Dropdown.Item>
              <Dropdown.Item
                selected={zoomRef.current === 1}
                onMouseUp={() => handleZoomMenuItemClick(1)}
              >
                <span className="flex-1">{defaultText.zoomTo100}</span>
              </Dropdown.Item>
              <Dropdown.Item
                selected={zoomRef.current === 2}
                onMouseUp={() => handleZoomMenuItemClick(2)}
              >
                <span className="flex-1">{defaultText.zoomTo200}</span>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                onMouseUp={() => {
                  fitToView()
                }}
                shortcut={{
                  keys: "1",
                  modifier: "command",
                }}
              >
                <span className="flex-1">{defaultText.fitToScreen}</span>
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>

          <IconButton
            onClick={zoomIn}
            className="rounded-none"
            size="large"
            tooltip={{
              content: defaultText.zoomIn,
              shortcut: {
                keys: "+",
                modifier: "command",
              },
            }}
          >
            <Add />
          </IconButton>
        </div>
      )}
    </div>
  )
})
