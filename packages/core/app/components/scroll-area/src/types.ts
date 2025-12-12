export type ScrollbarVisibilityType = "auto" | "always" | "scroll" | "hover"
export type ScrollbarMode =
  | "default"
  | "large-y"
  | "large-t"
  | "large-b"
  | "large-x"
  | "large-l"
  | "large-r"
export type ScrollAreaVariant = "default" | "light" | "dark"
export type ScrollOrientation = "vertical" | "horizontal" | "both"
export type HoverBoundary = "none" | "hover"

export interface ScrollState {
  clientHeight: number
  clientWidth: number
  scrollHeight: number
  scrollLeft: number
  scrollTop: number
  scrollWidth: number
}

/**
 * Scroll position information - simplified version, only providing core data
 */
export interface ScrollPosition {
  /** Horizontal scroll position (0-1) */
  left: number
  /** Vertical scroll position (0-1) */
  top: number
}

/**
 * Render prop function type
 */
export type ScrollAreaRenderProp = (position: ScrollPosition) => React.ReactNode

export interface ScrollAreaContextType {
  content: HTMLDivElement | null
  hoverBoundary: HoverBoundary
  isHovering: boolean
  isScrolling: boolean
  orientation: ScrollOrientation
  // ID related properties
  rootId: string
  scrollState: ScrollState
  scrollbarMode: ScrollbarMode
  scrollbarX: HTMLDivElement | null
  scrollbarXId: string
  scrollbarY: HTMLDivElement | null
  scrollbarYId: string
  setContent: (el: HTMLDivElement | null) => void
  setScrollbarX: (el: HTMLDivElement | null) => void
  setScrollbarY: (el: HTMLDivElement | null) => void
  setThumbX: (el: HTMLDivElement | null) => void
  setThumbY: (el: HTMLDivElement | null) => void
  setViewport: (el: HTMLDivElement | null) => void
  thumbX: HTMLDivElement | null
  thumbY: HTMLDivElement | null
  type: ScrollbarVisibilityType
  variant: ScrollAreaVariant
  viewport: HTMLDivElement | null
  viewportId: string
}

export interface ScrollAreaProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  /** Accessible name */
  "aria-label"?: string
  /** Reference to the element ID providing the label */
  "aria-labelledby"?: string
  /** Standard children or render prop function */
  children?: React.ReactNode | ScrollAreaRenderProp
  hoverBoundary?: HoverBoundary
  orientation?: ScrollOrientation
  scrollbarMode?: ScrollbarMode
  type?: ScrollbarVisibilityType
  variant?: ScrollAreaVariant
}

export interface ScrollbarProps extends React.ComponentPropsWithoutRef<"div"> {
  orientation?: "vertical" | "horizontal"
}

export interface ThumbProps extends React.ComponentPropsWithoutRef<"div"> {
  orientation?: "vertical" | "horizontal"
}
