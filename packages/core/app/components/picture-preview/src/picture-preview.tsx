import { Dropdown } from "@choice-ui/dropdown"
import { IconButton } from "@choice-ui/icon-button"
import { tcx } from "@choice-ui/shared"
import { Add, Delete, ImageRemove, LoaderCircle } from "@choiceform/icons-react"
import { forwardRef, HTMLProps, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useEventCallback, useHover } from "usehooks-ts"
import { HOTKEYS, Position, useDraggable, useHotkeys, useWheelHandler } from "./hooks"
import { PicturePreviewTv } from "./tv"

const ZOOM_STEP = 0.1
const INITIAL_ZOOM = 1

// 基于实际百分比的缩放限制
const MIN_ACTUAL_PERCENT = 2 // 最小 2%
const MAX_ACTUAL_PERCENT = 1000 // 最大 1000%

interface PicturePreviewProps extends HTMLProps<HTMLDivElement> {
  defaultText?: {
    error: string
    fitToScreen: string
    zoomIn: string
    zoomOut: string
    zoomTo100: string
    zoomTo200: string
    zoomTo50: string
  }
  fileName?: string
  onClose?: () => void
  src: string
  control?: {
    enable?: boolean
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
    show?: "always" | "hover"
  }
}

export const PicturePreview = forwardRef<HTMLDivElement, PicturePreviewProps>(
  function PicturePreview(props, ref) {
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
      control = {
        enable: true,
        position: "bottom-right",
        show: "hover",
      },
      ...rest
    } = props

    const [zoom, setZoom] = useState(INITIAL_ZOOM)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null)
    const [baseScale, setBaseScale] = useState(1)
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    // 基于实际百分比计算内部缩放限制（防止除零）
    const minZoom = useMemo(
      () => (baseScale > 0 ? MIN_ACTUAL_PERCENT / 100 / baseScale : 0.01),
      [baseScale],
    )
    const maxZoom = useMemo(
      () => (baseScale > 0 ? MAX_ACTUAL_PERCENT / 100 / baseScale : 100),
      [baseScale],
    )

    const internalRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLDivElement>(null)

    const zoomRef = useRef(zoom)

    const rafId = useRef<number | null>(null)

    const scheduleUpdate = useEventCallback(() => {
      if (rafId.current !== null) {
        return
      }

      rafId.current = requestAnimationFrame(() => {
        setZoom(zoomRef.current)
        rafId.current = null
      })
    })

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

    const handlePositionChange = useEventCallback((newPosition: Position) => {
      updatePosition(newPosition)
    })

    // Handle zoom at mouse position (zoom + pan in one update)
    const handleZoomAtPoint = useEventCallback(
      (params: { newZoom: number; newPosition: Position }) => {
        zoomRef.current = params.newZoom
        updatePosition(params.newPosition)
        scheduleUpdate()
      },
    )

    useWheelHandler(internalRef, zoomRef, positionRef, {
      minZoom,
      maxZoom,
      zoomStep: ZOOM_STEP,
      onPan: handlePositionChange,
      onZoomAtPoint: handleZoomAtPoint,
    })

    const zoomIn = useEventCallback(() => {
      zoomRef.current = Math.min(maxZoom, zoomRef.current + ZOOM_STEP)
      scheduleUpdate()
    })

    const zoomOut = useEventCallback(() => {
      zoomRef.current = Math.max(minZoom, zoomRef.current - ZOOM_STEP)
      scheduleUpdate()
    })

    const resetView = useEventCallback(() => {
      zoomRef.current = INITIAL_ZOOM
      updatePosition({ x: 0, y: 0 })
      scheduleUpdate()
    })

    const fitToView = useEventCallback(() => {
      if (!canvasRef.current || !naturalSize || !internalRef.current || baseScale <= 0) return

      const containerRect = internalRef.current.getBoundingClientRect()
      const containerWidth = containerRect.width
      const containerHeight = containerRect.height

      // 防止除零
      if (naturalSize.width <= 0 || naturalSize.height <= 0) return

      // 根据长边计算适应屏幕的缩放比例
      const scaleX = containerWidth / naturalSize.width
      const scaleY = containerHeight / naturalSize.height
      const fitScale = Math.min(scaleX, scaleY)

      // 将实际缩放比例转换为内部 zoom 值
      // actualZoom = zoom * baseScale, 所以 zoom = actualZoom / baseScale
      zoomRef.current = fitScale / baseScale

      updatePosition({ x: 0, y: 0 })
      scheduleUpdate()
    })

    const handleDoubleClick = useEventCallback(() => {
      fitToView()
    })

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

    const handleZoomMenuItemClick = useEventCallback((zoomLevel: number) => {
      zoomRef.current = zoomLevel
      scheduleUpdate()
    })

    const setActualZoomPercent = useEventCallback((percent: number) => {
      if (baseScale === 0) return
      const newZoom = percent / 100 / baseScale
      zoomRef.current = Math.max(minZoom, Math.min(maxZoom, newZoom))
      scheduleUpdate()
    })

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

    const calculateBaseScale = useCallback(() => {
      if (!naturalSize || !internalRef.current) return 1

      const containerRect = internalRef.current.getBoundingClientRect()
      const containerWidth = containerRect.width
      const containerHeight = containerRect.height

      // 防止除零
      if (
        naturalSize.width <= 0 ||
        naturalSize.height <= 0 ||
        containerWidth <= 0 ||
        containerHeight <= 0
      ) {
        return 1
      }

      const scaleX = containerWidth / naturalSize.width
      const scaleY = containerHeight / naturalSize.height

      return Math.min(scaleX, scaleY)
    }, [naturalSize])

    useEffect(() => {
      if (!naturalSize || !internalRef.current) return

      const updateBaseScale = () => {
        const scale = calculateBaseScale()
        setBaseScale(scale)
      }

      // 初始计算
      updateBaseScale()

      // 监听容器尺寸变化
      const resizeObserver = new ResizeObserver(() => {
        updateBaseScale()
      })

      resizeObserver.observe(internalRef.current)

      return () => {
        resizeObserver.disconnect()
      }
    }, [naturalSize, calculateBaseScale])

    useEffect(() => {
      setIsLoading(true)
      setIsError(false)
      setNaturalSize(null)

      const img = new Image()
      let isCancelled = false

      img.onload = () => {
        if (isCancelled) return
        setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
        setIsLoading(false)
      }

      img.onerror = () => {
        if (isCancelled) return
        setIsError(true)
        setIsLoading(false)
      }

      img.src = src

      return () => {
        isCancelled = true
        // 清理图片加载，防止内存泄漏
        img.onload = null
        img.onerror = null
        img.src = ""
      }
    }, [src])

    const actualZoomPercent = useMemo(() => {
      return Math.round(zoom * baseScale * 100)
    }, [zoom, baseScale])

    const tv = PicturePreviewTv({
      isLoading,
      isError,
      isMenuOpen: menuIsOpen,
      controlPosition: control.position,
      controlShow: control.show,
    })

    return (
      <div
        ref={internalRef}
        className={tcx(tv.root(), className)}
        {...rest}
      >
        {isLoading && (
          <div className={tv.loading()}>
            <LoaderCircle
              className="animate-spin"
              width={32}
              height={32}
            />
          </div>
        )}
        {isError && (
          <div className={tv.loading()}>
            <ImageRemove
              width={32}
              height={32}
            />
            <span>{defaultText.error}</span>
          </div>
        )}

        {!isError && (
          <div className={tv.content()}>
            <div
              ref={canvasRef}
              className={tv.canvas()}
              style={transformStyle}
              onMouseDown={handleMouseDown}
              onDoubleClick={handleDoubleClick}
            >
              <img
                src={src}
                alt={fileName || "Preview"}
                className={tv.image()}
                style={
                  naturalSize
                    ? {
                        width: naturalSize.width * baseScale,
                        height: naturalSize.height * baseScale,
                      }
                    : undefined
                }
                draggable={false}
                loading="eager"
                decoding="async"
                onLoad={() => setIsLoading(false)}
                onError={() => setIsError(true)}
              />
            </div>
          </div>
        )}

        {isError || isLoading || control.enable === false ? null : (
          <div className={tv.controlGroup()}>
            <IconButton
              onClick={zoomOut}
              className="rounded-none"
              size="large"
              tooltip={{
                content: defaultText.zoomOut,
                shortcut: {
                  keys: "-",
                  modifier: ["command"],
                },
              }}
            >
              <Delete />
            </IconButton>

            <Dropdown
              selection
              open={menuIsOpen}
              onOpenChange={setMenuIsOpen}
            >
              <Dropdown.Trigger
                variant="ghost"
                className="border-x-default rounded-none"
                size="large"
              >
                <span className="flex-1">{actualZoomPercent}%</span>
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
                  selected={actualZoomPercent === 50}
                  onMouseUp={() => setActualZoomPercent(50)}
                >
                  <span className="flex-1">{defaultText.zoomTo50}</span>
                </Dropdown.Item>
                <Dropdown.Item
                  selected={actualZoomPercent === 100}
                  onMouseUp={() => setActualZoomPercent(100)}
                >
                  <span className="flex-1">{defaultText.zoomTo100}</span>
                </Dropdown.Item>
                <Dropdown.Item
                  selected={actualZoomPercent === 200}
                  onMouseUp={() => setActualZoomPercent(200)}
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
                  modifier: ["command"],
                },
              }}
            >
              <Add />
            </IconButton>
          </div>
        )}
      </div>
    )
  },
)
