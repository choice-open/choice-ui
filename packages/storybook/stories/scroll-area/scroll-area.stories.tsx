import {
  Badge,
  Button,
  Label,
  Modal,
  Popover,
  Range,
  ScrollArea,
  Tooltip,
  useScrollPerformanceMonitor,
} from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useMemo, useState } from "react"

const meta: Meta<typeof ScrollArea> = {
  title: "Layouts/ScrollArea",
  component: ScrollArea,
  tags: ["upgrade", "autodocs"],
}

export default meta

type Story = StoryObj<typeof ScrollArea>

const getContents = (count: number = 20) => {
  const sentences =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  return sentences.repeat(count)
}

/**
 * Basic: Demonstrates the simplest ScrollArea implementation.
 *
 * Features:
 * - Standard scrollbar appearance
 * - Vertical scrolling with large content
 * - Fixed container dimensions
 *
 * This example shows the fundamental usage pattern with a viewport
 * containing a large number of items. The component requires explicit
 * height and width, with overflow handling.
 */
export const Basic: Story = {
  render: function BasicStory() {
    return (
      <ScrollArea
        className="relative h-64 w-64 overflow-hidden border"
        orientation="vertical"
      >
        <ScrollArea.Viewport>
          <ScrollArea.Content className="p-4">{getContents()}</ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    )
  },
}

/**
 * InModal: Demonstrates using ScrollArea within a Modal component.
 *
 * Features:
 * - Integration with Modal component
 * - Enhanced scrollbar appearance with 'padding-y' mode
 * - Properly contained scrolling area
 *
 * This pattern is useful for:
 * - Modal dialogs with large content
 * - Maintaining fixed modal size while allowing content scrolling
 * - Forms or data displays that exceed available modal space
 *
 * The 'padding-y' scrollbar mode provides a more prominent vertical scrollbar
 * that's easier to interact with in modal contexts.
 */
export const InModal: Story = {
  render: function InModalStory() {
    return (
      <Modal className="overflow-hidden">
        <Modal.Content className="h-64 w-64">
          <ScrollArea
            className="relative h-64 overflow-hidden"
            scrollbarMode="padding-y"
          >
            <ScrollArea.Viewport className="p-4">
              <ScrollArea.Content>{getContents()}</ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb orientation="vertical" />
            </ScrollArea.Scrollbar>
          </ScrollArea>
        </Modal.Content>
      </Modal>
    )
  },
}

/**
 * InModalWithHeader: Demonstrates ScrollArea within a Modal that has a header.
 *
 * Features:
 * - Modal with header and scrollable content area
 * - 'padding-b' scrollbar mode for combined scrollbar experience
 * - Proper spacing with internal padding
 *
 * This pattern is useful for:
 * - Content panels with clear section headers
 * - Document viewers or content browsers
 * - Settings or configuration panels with many options
 *
 * The 'padding-b' scrollbar mode provides enhanced scrollbars for both
 * horizontal and vertical directions when needed.
 */
export const InModalWithHeader: Story = {
  render: function InModalWithHeaderStory() {
    return (
      <Modal className="overflow-hidden">
        <Modal.Header title="ScrollArea" />
        <Modal.Content className="h-64 w-64">
          <ScrollArea
            className="relative h-64 overflow-hidden"
            scrollbarMode="padding-b"
          >
            <ScrollArea.Viewport className="p-4">
              <ScrollArea.Content>{getContents()}</ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb orientation="vertical" />
            </ScrollArea.Scrollbar>
          </ScrollArea>
        </Modal.Content>
      </Modal>
    )
  },
}

/**
 * Orientation: Demonstrates the different scrollbar orientations.
 *
 * Features:
 * - Vertical scrolling: adds vertical scrollbar + thumb automatically
 * - Horizontal scrolling: adds horizontal scrollbar + thumb automatically
 * - Both directions: adds both scrollbars + corner component automatically
 */
export const Orientation: Story = {
  render: function OrientationStory() {
    const contents = useMemo(() => {
      const sentences =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      return sentences.repeat(10)
    }, [])

    return (
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <Label>Vertical Scrolling:</Label>
          <ScrollArea
            className="relative h-40 w-full overflow-hidden rounded-lg border"
            orientation="vertical"
          >
            <ScrollArea.Viewport>
              <ScrollArea.Content className="p-4">{contents}</ScrollArea.Content>
            </ScrollArea.Viewport>
          </ScrollArea>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Horizontal Scrolling:</Label>
          <ScrollArea
            className="relative h-40 w-full overflow-hidden rounded-lg border"
            orientation="horizontal"
          >
            <ScrollArea.Viewport className="h-full">
              <ScrollArea.Content className="flex gap-4 p-4">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-selected-background flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-md"
                  >
                    {i + 1}
                  </div>
                ))}
              </ScrollArea.Content>
            </ScrollArea.Viewport>
          </ScrollArea>
        </div>

        <div className="col-span-2 flex flex-col gap-2">
          <Label>Both Directions (with auto Corner):</Label>
          <ScrollArea
            className="relative h-80 w-full overflow-hidden rounded-lg border"
            orientation="both"
          >
            <ScrollArea.Viewport>
              <ScrollArea.Content className="grid w-max grid-cols-10 gap-2 p-4">
                {Array.from({ length: 200 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-component-background/10 flex h-32 w-32 items-center justify-center rounded-md"
                  >
                    {i + 1}
                  </div>
                ))}
              </ScrollArea.Content>
            </ScrollArea.Viewport>
          </ScrollArea>
        </div>
      </div>
    )
  },
}

/**
 * Variant: Demonstrates ScrollArea with different theme variants.
 *
 * Features:
 * - Default variant: follows the page theme dynamically (light/dark mode)
 * - Dark variant: suitable for dark mode interfaces with enhanced visibility
 * - Light variant: clean, minimal appearance for light mode interfaces
 */
export const Variant: Story = {
  render: function VariantStory() {
    const defaultContents = useMemo(() => {
      return Array.from({ length: 50 }, (_, i) => (
        <div
          key={i}
          className="p-2"
        >
          Default theme item {i}
        </div>
      ))
    }, [])

    const darkContents = useMemo(() => {
      return Array.from({ length: 50 }, (_, i) => (
        <div
          key={i}
          className="p-2"
        >
          Dark theme item {i}
        </div>
      ))
    }, [])

    const lightContents = useMemo(() => {
      return Array.from({ length: 50 }, (_, i) => (
        <div
          key={i}
          className="p-2"
        >
          Light theme item {i}
        </div>
      ))
    }, [])

    return (
      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col gap-2">
          <Label>Default</Label>
          <ScrollArea
            className="h-64 w-64 overflow-hidden rounded-lg border"
            variant="default"
          >
            <ScrollArea.Viewport>
              <ScrollArea.Content>{defaultContents}</ScrollArea.Content>
            </ScrollArea.Viewport>
          </ScrollArea>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Light</Label>
          <ScrollArea
            className="h-64 w-64 overflow-hidden rounded-lg border bg-white text-gray-900"
            variant="light"
          >
            <ScrollArea.Viewport>
              <ScrollArea.Content>{lightContents}</ScrollArea.Content>
            </ScrollArea.Viewport>
          </ScrollArea>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Dark</Label>
          <ScrollArea
            className="bg-menu-background h-64 w-64 overflow-hidden rounded-lg text-white"
            variant="dark"
          >
            <ScrollArea.Viewport>
              <ScrollArea.Content>{darkContents}</ScrollArea.Content>
            </ScrollArea.Viewport>
          </ScrollArea>
        </div>
      </div>
    )
  },
}

/**
 * ScrollType: Demonstrates different scrollbar visibility types.
 *
 * Features:
 * - Auto: scrollbars visible when content overflows (default browser behavior)
 * - Always: scrollbars always visible regardless of content
 * - Scroll: scrollbars visible only when actively scrolling
 * - Hover: scrollbars visible when scrolling or hovering (macOS-like behavior)
 */
export const ScrollType: Story = {
  render: function ScrollTypeStory() {
    const autoContents = useMemo(() => {
      return Array.from({ length: 50 }, (_, i) => (
        <div
          key={i}
          className="border-b p-2"
        >
          Auto item {i}
        </div>
      ))
    }, [])

    const alwaysContents = useMemo(() => {
      return Array.from({ length: 50 }, (_, i) => (
        <div
          key={i}
          className="border-b p-2"
        >
          Always item {i}
        </div>
      ))
    }, [])

    const scrollContents = useMemo(() => {
      return Array.from({ length: 50 }, (_, i) => (
        <div
          key={i}
          className="border-b p-2"
        >
          Scroll item {i}
        </div>
      ))
    }, [])

    return (
      <div className="grid grid-cols-4 gap-8">
        <div className="flex flex-col gap-2">
          <Label>Auto</Label>
          <ScrollArea
            className="h-64 w-48 overflow-hidden rounded-lg border"
            type="auto"
          >
            <ScrollArea.Viewport>
              <ScrollArea.Content>{autoContents}</ScrollArea.Content>
            </ScrollArea.Viewport>
          </ScrollArea>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Always</Label>
          <ScrollArea
            className="h-64 w-48 overflow-hidden rounded-lg border"
            type="always"
          >
            <ScrollArea.Viewport>
              <ScrollArea.Content>{alwaysContents}</ScrollArea.Content>
            </ScrollArea.Viewport>
          </ScrollArea>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Scroll</Label>
          <ScrollArea
            className="h-64 w-48 overflow-hidden rounded-lg border"
            type="scroll"
          >
            <ScrollArea.Viewport>
              <ScrollArea.Content>{scrollContents}</ScrollArea.Content>
            </ScrollArea.Viewport>
          </ScrollArea>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Hover</Label>
          <ScrollArea
            className="h-64 w-48 overflow-hidden rounded-lg border"
            type="hover"
          >
            <ScrollArea.Viewport>
              <ScrollArea.Content>{scrollContents}</ScrollArea.Content>
            </ScrollArea.Viewport>
          </ScrollArea>
        </div>
      </div>
    )
  },
}

/**
 * RenderProp: Demonstrates the render prop pattern for accessing scroll position.
 *
 * Features:
 * - Render prop pattern with scroll position data
 * - Real-time scroll position updates (top and left as 0-1 values)
 * - Dynamic UI updates based on scroll position
 * - Performance optimized with memoization
 *
 * This pattern is useful for:
 * - Creating scroll-based animations
 * - Implementing scroll progress indicators
 * - Building custom scroll-dependent UI elements
 * - Showing scroll position feedback to users
 */
export const RenderProp: Story = {
  render: function RenderPropStory() {
    const contents = useMemo(() => {
      return Array.from({ length: 100 }, (_, i) => (
        <div
          key={i}
          className="border-b p-2"
        >
          Render prop item {i}
        </div>
      ))
    }, [])

    return (
      <ScrollArea
        className="relative h-64 w-64 overflow-hidden rounded-lg border"
        type="hover"
      >
        {({ top, left }) => (
          <>
            <ScrollArea.Viewport className="h-full">
              <ScrollArea.Content>
                <div className="sticky top-0 z-2 bg-white/50 p-2 backdrop-blur">
                  Scroll Progress:{" "}
                  <span className="font-strong text-accent-foreground">
                    {Math.round(top * 100)}%
                  </span>
                </div>
                {contents}
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb orientation="vertical" />
            </ScrollArea.Scrollbar>
          </>
        )}
      </ScrollArea>
    )
  },
}

/**
 * VirtualList: Demonstrates ScrollArea with @tanstack/react-virtual for performance.
 *
 * Features:
 * - Virtual scrolling for large datasets (10,000+ items)
 * - Optimized performance with only visible items rendered
 * - Smooth scrolling experience with custom scrollbars
 * - Proper integration between ScrollArea and react-virtual
 * - Memory efficient rendering of massive lists
 *
 * This pattern is essential for:
 * - Large data tables or lists
 * - Chat applications with thousands of messages
 * - File browsers with many entries
 * - Any UI that needs to handle massive datasets efficiently
 * - Performance-critical applications where smooth scrolling is required
 *
 * The virtual scrolling technique renders only the visible items plus a buffer,
 * dramatically improving performance compared to rendering all items at once.
 */
export const VirtualList: Story = {
  render: function VirtualListStory() {
    // Generate large dataset for demonstration
    const items = useMemo(() => {
      return Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        description: `Description for item ${i}`,
        value: Math.floor(Math.random() * 1000),
      }))
    }, [])

    const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null)

    const virtualizer = useVirtualizer({
      count: items.length,
      getScrollElement: () => scrollElement,
      estimateSize: () => 48,
      overscan: 5,
    })

    return (
      <ScrollArea
        className="relative h-96 w-80 overflow-hidden rounded-xl border"
        type="hover"
        scrollbarMode="padding-y"
      >
        <ScrollArea.Viewport
          className="h-full"
          ref={setScrollElement}
        >
          <ScrollArea.Content
            style={{
              height: virtualizer.getTotalSize(),
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const item = items[virtualItem.index]
              return (
                <div
                  key={virtualItem.key}
                  className="hover:bg-secondary-background absolute top-0 left-0 w-full border-b p-2"
                  style={{
                    height: virtualItem.size,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-strong">{item.name}</div>
                      <div className="text-secondary-foreground">{item.description}</div>
                    </div>
                    <Badge strong>{item.value}</Badge>
                  </div>
                </div>
              )
            })}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    )
  },
}

/**
 * DynamicContent: Tests ScrollArea with dynamically changing content.
 *
 * Features:
 * - 🔧 Tests fix for scrollbar length not updating with content changes
 * - Demonstrates real-time scrollbar updates when content is added/removed
 * - Shows proper scrollbar hiding when content becomes smaller than container
 * - Tests MutationObserver and ResizeObserver integration
 *
 * This story validates the fixes for:
 * - Scrollbar length not updating when content changes dynamically
 * - Proper scrollbar visibility when content shrinks below container size
 */
export const DynamicContent: Story = {
  render: function DynamicContentStory() {
    const [itemCount, setItemCount] = useState(5)
    const [itemHeight, setItemHeight] = useState(60)

    const items = useMemo(() => {
      return Array.from({ length: itemCount }, (_, i) => ({
        id: i,
        title: `Dynamic Item ${i + 1}`,
        content: `This is the content of the ${i + 1}th item`,
      }))
    }, [itemCount, itemHeight])

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-[auto_1fr] gap-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label>Item Count: {itemCount}</Label>

              <Range
                value={itemCount}
                onChange={(value) => setItemCount(value)}
                min={1}
                max={50}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Item Height: {itemHeight}px</Label>

              <Range
                value={itemHeight}
                onChange={(value) => setItemHeight(value)}
                min={48}
                max={120}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setItemCount((prev) => Math.max(1, prev - 5))}
              >
                Remove Item
              </Button>
              <Button onClick={() => setItemCount((prev) => prev + 5)}>Add Item</Button>
            </div>
          </div>

          <ScrollArea
            className="relative h-80 w-80 overflow-hidden rounded-xl border border-gray-200"
            orientation="vertical"
            type="auto"
            scrollbarMode="padding-y"
          >
            <ScrollArea.Viewport>
              <ScrollArea.Content className="p-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-secondary-background flex flex-col justify-center gap-1 rounded-md px-2"
                      style={{ height: itemHeight }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="font-strong">{item.title}</div>
                        <Badge>{itemHeight}px</Badge>
                      </div>
                      <div className="text-secondary-foreground">{item.content}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea.Content>
            </ScrollArea.Viewport>
          </ScrollArea>
        </div>
      </div>
    )
  },
}

/**
 * NestedScrollArea: Demonstrates nested ScrollArea components.
 *
 * Features:
 * - Outer ScrollArea with both horizontal and vertical scrolling
 * - Inner ScrollArea components within a grid layout
 * - Independent scrolling for each nested area
 *
 * This pattern is useful for:
 * - Dashboard widgets with individual scroll areas
 * - Card-based layouts with scrollable content
 * - Complex UI with multiple independent scroll regions
 */
export const NestedScrollArea: Story = {
  render: function NestedScrollAreaStory() {
    const items = useMemo(() => {
      return Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        title: `Item ${i + 1}`,
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        value: Math.floor(Math.random() * 1000),
      }))
    }, [])

    return (
      <ScrollArea
        className="relative h-80 w-full overflow-hidden rounded-xl border border-gray-200"
        orientation="both"
        type="hover"
      >
        <ScrollArea.Viewport className="h-full">
          <ScrollArea.Content className="p-4">
            <div
              className="grid grid-cols-5 gap-4"
              style={{ minWidth: "800px" }}
            >
              {items.slice(0, Math.min(100, items.length)).map((item) => (
                <ScrollArea
                  key={item.id}
                  className="h-40 rounded-lg p-2 shadow-sm"
                >
                  <ScrollArea.Viewport className="h-full">
                    <ScrollArea.Content>
                      <div className="space-y-2">
                        {Array.from({ length: 10 }).map((_, index) => (
                          <div
                            key={index}
                            className="bg-secondary-background rounded-md p-2"
                          >
                            <div className="font-strong">{item.title}</div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea.Content>
                  </ScrollArea.Viewport>
                </ScrollArea>
              ))}
            </div>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    )
  },
}

/**
 * HoverBoundary: Tests the hoverBoundary prop for controlling scrollbar hover behavior.
 *
 * Features:
 * - "none": No hover effect, scrollbar visibility controlled only by type prop
 * - "hover": Scrollbar shows on hover over the entire scroll area (default)
 *
 * Use cases:
 * - "none": When you want scrollbar to only show during active scrolling
 * - "hover": When you want scrollbar visible on mouse hover (better discoverability)
 */
export const HoverBoundary: Story = {
  render: function HoverBoundaryStory() {
    const [selectedBoundary, setSelectedBoundary] = useState<"none" | "hover">("hover")

    const items = useMemo(() => {
      return Array.from({ length: 30 }, (_, i) => ({
        id: i,
        title: `Item ${i + 1}`,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      }))
    }, [])

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label>Hover Boundary:</Label>
          <div className="flex gap-2">
            <Button
              variant={selectedBoundary === "none" ? "primary" : "ghost"}
              onClick={() => setSelectedBoundary("none")}
            >
              none
            </Button>
            <Button
              variant={selectedBoundary === "hover" ? "primary" : "ghost"}
              onClick={() => setSelectedBoundary("hover")}
            >
              hover
            </Button>
          </div>
        </div>

        <ScrollArea
          className="relative h-80 w-80 overflow-hidden rounded-lg border"
          orientation="vertical"
          type="hover"
          hoverBoundary={selectedBoundary}
        >
          <ScrollArea.Viewport className="h-full">
            <ScrollArea.Content className="p-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-secondary-background rounded-lg p-3"
                  >
                    <h5 className="font-strong">{item.title}</h5>
                    <p className="text-body-small text-secondary-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea>
      </div>
    )
  },
}

/**
 * [TEST] PerformanceMonitoring: Demonstrates useScrollPerformanceMonitor hook.
 *
 * Features:
 * - Real-time FPS and dropped frames monitoring
 * - Configurable item count for stress testing
 * - Performance metrics displayed in UI
 *
 * Performance guidelines:
 * - Average frame time should be < 16.67ms (60fps)
 * - Dropped frames should be minimal
 * - Check browser console for detailed reports when enabled
 *
 * Use cases:
 * - Debugging scroll performance issues
 * - Testing with large datasets
 * - Identifying rendering bottlenecks
 */
export const PerformanceMonitoring: Story = {
  render: function PerformanceMonitoringStory() {
    const [monitoringEnabled, setMonitoringEnabled] = useState(false)
    const [itemCount, setItemCount] = useState(1000)
    const [viewport, setViewport] = useState<HTMLDivElement | null>(null)

    const performanceMetrics = useScrollPerformanceMonitor(viewport, {
      enabled: monitoringEnabled,
      logInterval: 3000,
      frameTimeThreshold: 16.67,
    })

    const items = useMemo(() => {
      return Array.from({ length: itemCount }, (_, i) => ({
        id: i,
        title: `Item ${i + 1}`,
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        value: Math.floor(Math.random() * 1000),
      }))
    }, [itemCount])

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="monitoring"
              checked={monitoringEnabled}
              onChange={(e) => setMonitoringEnabled(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="monitoring">Enable Monitoring</Label>
          </div>

          <div className="flex items-center gap-2">
            <Label>Items:</Label>
            <select
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
              className="rounded border px-2 py-1"
            >
              <option value={100}>100</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
              <option value={5000}>5000</option>
            </select>
          </div>

          {monitoringEnabled && performanceMetrics && (
            <Badge>
              FPS:{" "}
              {performanceMetrics.averageFrameTime > 0
                ? (1000 / performanceMetrics.averageFrameTime).toFixed(1)
                : "0"}{" "}
              | Dropped: {performanceMetrics.droppedFrames}
            </Badge>
          )}
        </div>

        <ScrollArea
          className="relative h-80 w-full overflow-hidden rounded-xl border"
          orientation="vertical"
          type="auto"
        >
          <ScrollArea.Viewport
            className="h-full"
            ref={setViewport}
          >
            <ScrollArea.Content className="p-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-secondary-background rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-strong">{item.title}</div>
                      <Badge>{item.value}</Badge>
                    </div>
                    <div className="text-body-small text-secondary-foreground mt-1">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea>
      </div>
    )
  },
}

/**
 * [TEST] WithPopoverAndTooltip: Tests ScrollArea with Popover and Tooltip components inside.
 *
 * Features:
 * - Floating UI components (Popover, Tooltip) within scrollable content
 * - Proper z-index handling with overlays and scrollbars
 * - Positioning remains correct during scrolling
 *
 * Testing points:
 * - Hover blue question marks to see tooltips (positioned near scrollbar)
 * - Click "More Info" buttons to open popovers
 * - Tooltips should appear above scrollbar (proper z-index)
 * - Scrolling doesn't break floating UI positioning
 */
export const WithPopoverAndTooltip: Story = {
  render: function WithPopoverAndTooltipStory() {
    const items = useMemo(() => {
      return Array.from({ length: 50 }, (_, i) => ({
        id: i,
        title: `Item ${i + 1}`,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
        hasPopover: i % 5 === 0,
        hasTooltip: i % 3 === 0,
      }))
    }, [])

    return (
      <ScrollArea
        className="relative h-96 w-96 overflow-hidden rounded-xl border"
        orientation="vertical"
        type="always"
      >
        <ScrollArea.Viewport className="h-full">
          <ScrollArea.Content className="p-4 pr-8">
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-strong">{item.title}</h4>
                      <p className="text-body-small text-secondary-foreground mt-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.hasPopover && (
                        <Popover>
                          <Popover.Trigger>
                            <Button variant="ghost">Info</Button>
                          </Popover.Trigger>
                          <Popover.Content className="w-64 p-4">
                            <div className="space-y-2">
                              <h4 className="font-strong">{item.title}</h4>
                              <p className="text-body-small text-secondary-foreground">
                                Popover content within ScrollArea.
                              </p>
                            </div>
                          </Popover.Content>
                        </Popover>
                      )}

                      {item.hasTooltip && (
                        <Tooltip content={`Tooltip for ${item.title}`}>
                          <span className="inline-flex h-8 w-8 cursor-help items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600 hover:bg-blue-200">
                            ?
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    )
  },
}
