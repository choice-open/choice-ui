import type { Meta, StoryObj } from "@storybook/react-vite"
import { useMemo, useState } from "react"
import { ScrollArea } from "./scroll-area"
import React from "react"
import { Modal } from "../modal"
import { useVirtualizer } from "@tanstack/react-virtual"
import { faker } from "@faker-js/faker"
import { Button } from "../button"
import { useScrollPerformanceMonitor } from "./hooks"

const meta: Meta<typeof ScrollArea> = {
  title: "Layouts/ScrollArea",
  component: ScrollArea,
  tags: ["new"],
}

export default meta

type Story = StoryObj<typeof ScrollArea>

/**
 * `ScrollArea` is a new scroll area component built with native DOM APIs instead of Radix UI.
 * It provides the same API and styling as the original Scroll component but with improved
 * performance and reduced bundle size.
 *
 * Features:
 * - Built with native DOM APIs for better performance
 * - Custom-styled scrollbars with different appearance modes
 * - Responsive scrolling behavior with macOS-like visibility controls
 * - Supports both vertical and horizontal scrolling
 * - Integration with other components like Modal
 * - Customizable viewport and scrollbar styling
 * - Four scrollbar visibility modes: auto, always, scroll, hover
 *
 * Scrollbar Visibility Types:
 * - "auto": Scrollbars visible when content overflows (default web behavior)
 * - "always": Scrollbars always visible regardless of content overflow
 * - "scroll": Scrollbars visible only when user is actively scrolling
 * - "hover": Scrollbars visible when scrolling or hovering over scroll area (macOS default)
 *
 * 🎉 NEW: Auto-Scrollbars Feature!
 * ScrollArea now automatically renders scrollbars based on the orientation prop:
 * - orientation="vertical" → adds vertical scrollbar + thumb automatically
 * - orientation="horizontal" → adds horizontal scrollbar + thumb automatically
 * - orientation="both" → adds both scrollbars + corner component automatically
 * - No need to manually add ScrollArea.Scrollbar, ScrollArea.Thumb, or ScrollArea.Corner!
 *
 * Usage Guidelines:
 * - Use for content areas that need scrolling with custom scrollbar appearance
 * - Always specify explicit height for the container
 * - Define appropriate scrollbar mode for your use case
 * - Use ScrollArea.Viewport for the scrollable content
 * - Apply appropriate padding inside the viewport
 * - Simply set orientation prop - scrollbars are added automatically!
 */

/**
 * AutoScrollbars: Demonstrates the new simplified ScrollArea usage with automatic scrollbars.
 *
 * Features:
 * - 🎉 NO manual scrollbar components needed!
 * - Automatic scrollbar rendering based on orientation
 * - Cleaner, more concise API
 * - Reduced boilerplate code
 *
 * NEW USAGE: Just specify orientation and ScrollArea automatically adds:
 * - Scrollbar components
 * - Thumb components
 * - Corner component (for dual scrolling)
 */
export const AutoScrollbars: Story = {
  render: function AutoScrollbarsStory() {
    const contents = useMemo(() => {
      return faker.lorem.sentences(200)
    }, [])

    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-lg font-semibold">✨ New Simplified Usage</h3>
          <p className="mb-4 text-sm text-gray-600">
            No need to manually add ScrollArea.Scrollbar, ScrollArea.Thumb, or ScrollArea.Corner!
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-sm font-medium">Vertical Scrolling:</p>
              <ScrollArea
                className="relative h-40 w-48 overflow-hidden rounded border"
                orientation="vertical"
              >
                <ScrollArea.Viewport className="h-full">
                  <ScrollArea.Content className="p-3 text-sm">{contents}</ScrollArea.Content>
                </ScrollArea.Viewport>
              </ScrollArea>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Horizontal Scrolling:</p>
              <ScrollArea
                className="relative h-40 w-48 overflow-hidden rounded border"
                orientation="horizontal"
              >
                <ScrollArea.Viewport className="h-full">
                  <ScrollArea.Content className="flex gap-2 p-3">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div
                        key={i}
                        className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded bg-blue-100 text-sm"
                      >
                        {i + 1}
                      </div>
                    ))}
                  </ScrollArea.Content>
                </ScrollArea.Viewport>
              </ScrollArea>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Both Directions (with auto Corner):</p>
            <ScrollArea
              className="relative h-40 w-64 overflow-hidden rounded border"
              orientation="both"
            >
              <ScrollArea.Viewport className="h-full">
                <ScrollArea.Content className="grid w-max grid-cols-10 gap-1 p-3">
                  {Array.from({ length: 200 }, (_, i) => (
                    <div
                      key={i}
                      className="text-default-foreground flex h-16 w-16 items-center justify-center rounded bg-purple-100"
                    >
                      {i + 1}
                    </div>
                  ))}
                </ScrollArea.Content>
              </ScrollArea.Viewport>
            </ScrollArea>
          </div>
        </div>
      </div>
    )
  },
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
    const contents = useMemo(() => {
      return faker.lorem.sentences(200)
    }, [])

    return (
      <ScrollArea
        className="relative h-64 w-64 overflow-hidden border"
        orientation="vertical"
      >
        <ScrollArea.Viewport className="h-full">
          <ScrollArea.Content>{contents}</ScrollArea.Content>
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
 * - Enhanced scrollbar appearance with 'large-y' mode
 * - Properly contained scrolling area
 *
 * This pattern is useful for:
 * - Modal dialogs with large content
 * - Maintaining fixed modal size while allowing content scrolling
 * - Forms or data displays that exceed available modal space
 *
 * The 'large-y' scrollbar mode provides a more prominent vertical scrollbar
 * that's easier to interact with in modal contexts.
 */
export const InModal: Story = {
  render: function InModalStory() {
    const contents = useMemo(() => {
      return faker.lorem.sentences(200)
    }, [])

    return (
      <Modal>
        <Modal.Content className="h-64 w-64 overflow-hidden">
          <ScrollArea
            className="relative h-64 overflow-hidden"
            scrollbarMode="large-y"
          >
            <ScrollArea.Viewport className="h-full p-4">
              <ScrollArea.Content>{contents}</ScrollArea.Content>
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
 * - 'large-b' scrollbar mode for combined scrollbar experience
 * - Proper spacing with internal padding
 *
 * This pattern is useful for:
 * - Content panels with clear section headers
 * - Document viewers or content browsers
 * - Settings or configuration panels with many options
 *
 * The 'large-b' scrollbar mode provides enhanced scrollbars for both
 * horizontal and vertical directions when needed.
 */
export const InModalWithHeader: Story = {
  render: function InModalWithHeaderStory() {
    const contents = useMemo(() => {
      return Array.from({ length: 100 }, (_, i) => <div key={i}>{i}</div>)
    }, [])

    return (
      <Modal>
        <Modal.Header title="ScrollArea" />
        <Modal.Content className="h-64 w-64 overflow-hidden">
          <ScrollArea
            className="relative h-64 overflow-hidden"
            scrollbarMode="large-b"
          >
            <ScrollArea.Viewport className="h-full p-4">
              <ScrollArea.Content>{contents}</ScrollArea.Content>
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
 * HorizontalScrolling: Demonstrates horizontal scrolling with ScrollArea.
 *
 * Features:
 * - Horizontal scrolling orientation
 * - Wide content that exceeds container width
 * - Horizontal scrollbar appearance
 *
 * This pattern is useful for:
 * - Image galleries or carousels
 * - Data tables with many columns
 * - Timeline components
 * - Horizontal navigation elements
 */
export const HorizontalScrolling: Story = {
  render: function HorizontalScrollingStory() {
    const contents = useMemo(() => {
      return Array.from({ length: 50 }, (_, i) => (
        <div
          key={i}
          className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded bg-gray-200"
        >
          {i}
        </div>
      ))
    }, [])

    return (
      <ScrollArea
        className="relative h-32 w-64 overflow-hidden border"
        orientation="horizontal"
      >
        <ScrollArea.Viewport className="h-full">
          <ScrollArea.Content className="flex gap-2 p-4">{contents}</ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    )
  },
}

/**
 * DualScrolling: Demonstrates both vertical and horizontal scrolling.
 *
 * Features:
 * - Both vertical and horizontal scrollbars
 * - Content that exceeds container in both dimensions
 * - Corner element for scrollbar intersection
 *
 * This pattern is useful for:
 * - Large data tables
 * - Code editors
 * - Image viewers
 * - Large forms or configuration panels
 */
export const DualScrolling: Story = {
  render: function DualScrollingStory() {
    const grid = useMemo(() => {
      return Array.from({ length: 20 }, (_, row) => (
        <div
          key={row}
          className="flex gap-1"
        >
          {Array.from({ length: 20 }, (_, col) => (
            <div
              key={col}
              className="flex h-20 w-20 flex-shrink-0 items-center justify-center border border-gray-300 bg-gray-200 text-xs"
            >
              {row},{col}
            </div>
          ))}
        </div>
      ))
    }, [])

    return (
      <ScrollArea
        className="relative h-64 w-64 overflow-hidden border"
        orientation="both"
      >
        <ScrollArea.Viewport className="h-full">
          <ScrollArea.Content className="flex flex-col gap-1 p-4">{grid}</ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    )
  },
}

/**
 * DarkTheme: Demonstrates ScrollArea with dark theme variant.
 *
 * Features:
 * - Dark theme scrollbar appearance
 * - Suitable for dark mode interfaces
 * - Enhanced visibility in dark backgrounds
 */
export const DarkTheme: Story = {
  render: function DarkThemeStory() {
    const contents = useMemo(() => {
      return Array.from({ length: 100 }, (_, i) => (
        <div
          key={i}
          className="p-2 text-white"
        >
          Dark theme item {i}
        </div>
      ))
    }, [])

    return (
      <ScrollArea
        className="relative h-64 w-64 overflow-hidden bg-gray-900"
        variant="dark"
      >
        <ScrollArea.Viewport className="h-full">
          <ScrollArea.Content>{contents}</ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb orientation="vertical" />
        </ScrollArea.Scrollbar>
      </ScrollArea>
    )
  },
}

/**
 * LightTheme: Demonstrates ScrollArea with light theme variant.
 *
 * Features:
 * - Light theme scrollbar appearance
 * - Suitable for light mode interfaces
 * - Clean, minimal appearance
 */
export const LightTheme: Story = {
  render: function LightThemeStory() {
    const contents = useMemo(() => {
      return Array.from({ length: 100 }, (_, i) => (
        <div
          key={i}
          className="p-2 text-gray-900"
        >
          Light theme item {i}
        </div>
      ))
    }, [])

    return (
      <ScrollArea
        className="relative h-64 w-64 overflow-hidden border"
        variant="light"
      >
        <ScrollArea.Viewport className="h-full">
          <ScrollArea.Content>{contents}</ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb orientation="vertical" />
        </ScrollArea.Scrollbar>
      </ScrollArea>
    )
  },
}

/**
 * ScrollbarTypeAuto: Demonstrates the "auto" scrollbar visibility type.
 *
 * Features:
 * - Scrollbars are visible when content overflows
 * - Default web browser behavior
 * - Immediate visibility on overflow
 */
export const ScrollbarTypeAuto: Story = {
  render: function ScrollbarTypeAutoStory() {
    const contents = useMemo(() => {
      return Array.from({ length: 100 }, (_, i) => (
        <div
          key={i}
          className="border-b p-2"
        >
          Auto visibility item {i}
        </div>
      ))
    }, [])

    return (
      <ScrollArea
        className="relative h-64 w-64 overflow-hidden border"
        type="auto"
      >
        <ScrollArea.Viewport className="h-full">
          <ScrollArea.Content>{contents}</ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb orientation="vertical" />
        </ScrollArea.Scrollbar>
      </ScrollArea>
    )
  },
}

/**
 * ScrollbarTypeAlways: Demonstrates the "always" scrollbar visibility type.
 *
 * Features:
 * - Scrollbars are always visible regardless of content overflow
 * - Useful for consistent layout
 * - Scrollbar remains visible even with minimal content
 */
export const ScrollbarTypeAlways: Story = {
  render: function ScrollbarTypeAlwaysStory() {
    const contents = useMemo(() => {
      return Array.from({ length: 100 }, (_, i) => (
        <div
          key={i}
          className="border-b p-2"
        >
          Always visible item {i}
        </div>
      ))
    }, [])

    return (
      <ScrollArea
        className="relative h-64 w-64 overflow-hidden border"
        type="always"
      >
        <ScrollArea.Viewport className="h-full">
          <ScrollArea.Content>{contents}</ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb orientation="vertical" />
        </ScrollArea.Scrollbar>
      </ScrollArea>
    )
  },
}

/**
 * ScrollbarTypeScroll: Demonstrates the "scroll" scrollbar visibility type.
 *
 * Features:
 * - Scrollbars are visible only when user is actively scrolling
 * - Clean interface when not scrolling
 * - Automatically hides after scrolling stops
 */
export const ScrollbarTypeScroll: Story = {
  render: function ScrollbarTypeScrollStory() {
    const contents = useMemo(() => {
      return Array.from({ length: 100 }, (_, i) => (
        <div
          key={i}
          className="border-b p-2"
        >
          Scroll to see scrollbar - item {i}
        </div>
      ))
    }, [])

    return (
      <ScrollArea
        className="relative h-64 w-64 overflow-hidden border"
        type="scroll"
      >
        <ScrollArea.Viewport className="h-full">
          <ScrollArea.Content>{contents}</ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb orientation="vertical" />
        </ScrollArea.Scrollbar>
      </ScrollArea>
    )
  },
}

/**
 * ScrollbarTypeHover: Demonstrates the "hover" scrollbar visibility type (default).
 *
 * Features:
 * - Scrollbars visible when scrolling or hovering over scroll area
 * - macOS-like behavior
 * - Perfect balance between cleanliness and usability
 */
export const ScrollbarTypeHover: Story = {
  render: function ScrollbarTypeHoverStory() {
    const contents = useMemo(() => {
      return Array.from({ length: 100 }, (_, i) => (
        <div
          key={i}
          className="border-b p-2"
        >
          Hover or scroll to see scrollbar - item {i}
        </div>
      ))
    }, [])

    return (
      <ScrollArea
        className="relative h-64 w-64 overflow-hidden border"
        type="hover"
      >
        <ScrollArea.Viewport className="h-full">
          <ScrollArea.Content>{contents}</ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb orientation="vertical" />
        </ScrollArea.Scrollbar>
      </ScrollArea>
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
        className="relative h-64 w-64 overflow-hidden border"
        type="hover"
      >
        {({ top, left }) => (
          <>
            <ScrollArea.Viewport className="h-full">
              <ScrollArea.Content>
                <div className="sticky top-0 z-10 bg-white/90 p-2 text-sm backdrop-blur">
                  Scroll Progress: {Math.round(top * 100)}%
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

    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          Virtual list with 10,000 items - only visible items are rendered
        </div>
        <VirtualScrollArea items={items} />
      </div>
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
        content: `This is the content of the ${i + 1}th item, with a height of ${itemHeight}px`,
      }))
    }, [itemCount, itemHeight])

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-blue-900">
            🔧 Test Dynamic Content Changes
          </h3>
          <p className="text-sm text-blue-800">
            This test case validates the correct behavior of scrollbars when content changes
            dynamically, including length updates and display/hide logic.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Item Count: {itemCount}
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={itemCount}
                onChange={(e) => setItemCount(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Item Height: {itemHeight}px
              </label>
              <input
                type="range"
                min="30"
                max="120"
                value={itemHeight}
                onChange={(e) => setItemHeight(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="default"
                onClick={() => setItemCount((prev) => Math.max(1, prev - 5))}
              >
                Remove Item
              </Button>
              <Button
                size="default"
                onClick={() => setItemCount((prev) => prev + 5)}
              >
                Add Item
              </Button>
            </div>
          </div>

          <ScrollArea
            className="relative h-80 w-80 overflow-hidden rounded-xl border border-gray-200"
            orientation="vertical"
            type="auto"
          >
            <ScrollArea.Viewport className="h-full">
              <ScrollArea.Content className="p-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-md border p-2"
                      style={{ height: itemHeight }}
                    >
                      <div className="font-medium">{item.title}</div>
                      <div className="text-secondary-foreground text-sm">{item.content}</div>
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
 * PerformanceMonitoring: Demonstrates performance monitoring capabilities.
 *
 * Features:
 * - 🔍 Real-time performance metrics monitoring
 * - Frame rate and update frequency tracking
 * - Performance bottleneck detection
 * - Console-based performance reporting
 *
 * This story demonstrates the built-in performance monitoring tools that help:
 * - Identify scroll performance issues
 * - Monitor frame rates and dropped frames
 * - Track event frequencies
 * - Optimize scroll area performance
 *
 * Check the browser console for detailed performance reports when enabled.
 */
export const PerformanceMonitoring: Story = {
  render: function PerformanceMonitoringStory() {
    const [monitoringEnabled, setMonitoringEnabled] = useState(false)
    const [itemCount, setItemCount] = useState(1000)
    const [viewport, setViewport] = useState<HTMLDivElement | null>(null)

    // 🔍 启用性能监控
    const performanceMetrics = useScrollPerformanceMonitor(viewport, {
      enabled: monitoringEnabled,
      logInterval: 3000, // 3秒报告一次
      frameTimeThreshold: 16.67, // 60fps阈值
    })

    const items = useMemo(() => {
      return Array.from({ length: itemCount }, (_, i) => ({
        id: i,
        title: `Performance Item ${i + 1}`,
        content: faker.lorem.sentence(),
        value: Math.floor(Math.random() * 1000),
      }))
    }, [itemCount])

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-purple-900">
            🔍 Performance Monitoring Test
          </h3>
          <p className="text-sm text-purple-800">
            Enable performance monitoring to track scroll performance metrics. Check the browser
            console for detailed performance reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="monitoring"
              checked={monitoringEnabled}
              onChange={(e) => setMonitoringEnabled(e.target.checked)}
              className="rounded"
            />
            <label
              htmlFor="monitoring"
              className="text-sm font-medium"
            >
              Enable Performance Monitoring 📊
            </label>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Item Count:</label>
            <select
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            >
              <option value={100}>100 items (light)</option>
              <option value={500}>500 items (medium)</option>
              <option value={1000}>1000 items (heavy)</option>
              <option value={5000}>5000 items (very heavy)</option>
            </select>
          </div>

          {monitoringEnabled && performanceMetrics && (
            <div className="rounded bg-gray-100 px-3 py-2 text-xs">
              <span className="font-medium">Real-time Metrics:</span>
              <span className="ml-2">
                FPS:{" "}
                {performanceMetrics.averageFrameTime > 0
                  ? (1000 / performanceMetrics.averageFrameTime).toFixed(1)
                  : "0"}
              </span>
              <span className="ml-2">Dropped Frames: {performanceMetrics.droppedFrames}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="mb-2 text-sm font-medium">Basic Scroll Test</h4>
            <ScrollArea
              className="relative h-80 w-full overflow-hidden rounded-xl border border-gray-200"
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
                        className="rounded border border-gray-200 bg-white p-3 shadow-sm"
                      >
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.content}</div>
                        <div className="mt-1 text-xs text-blue-600">Value: {item.value}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea.Content>
              </ScrollArea.Viewport>
            </ScrollArea>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Complex Layout Test</h4>
            <ScrollArea
              className="relative h-80 w-full overflow-hidden rounded-xl border border-gray-200"
              orientation="both"
              type="hover"
            >
              <ScrollArea.Viewport className="h-full">
                <ScrollArea.Content className="p-4">
                  <div
                    className="grid grid-cols-5 gap-2"
                    style={{ minWidth: "800px" }}
                  >
                    {items.slice(0, Math.min(500, items.length)).map((item) => (
                      <div
                        key={item.id}
                        className="rounded border border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 p-2 shadow-sm"
                        style={{ minHeight: "120px" }}
                      >
                        <div className="text-xs font-medium text-gray-900">{item.title}</div>
                        <div className="mt-1 text-xs text-gray-600">
                          {item.content.slice(0, 50)}...
                        </div>
                        <div className="mt-2 rounded bg-white px-2 py-1 text-center text-xs">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea.Content>
              </ScrollArea.Viewport>
            </ScrollArea>
          </div>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-green-900">
            📈 Performance Monitoring Instructions
          </h3>
          <div className="space-y-2 text-sm text-green-800">
            <div>
              <strong>Average Frame Time</strong>: Should be &lt; 16.67ms (60fps)
            </div>
            <div>
              <strong>Dropped Frames</strong>: Should be as few as possible, too many indicates
              performance issues
            </div>
            <div>
              <strong>Scroll Event Frequency</strong>: Too high may need throttling optimization
            </div>
            <div>
              <strong>Update Frequency</strong>: Should match actual needs
            </div>
            <div className="mt-3 text-xs">💡 Tip: Open the browser developer tools</div>
          </div>
        </div>
      </div>
    )
  },
}

// Helper component that integrates ScrollArea with react-virtual
function VirtualScrollArea({
  items,
}: {
  items: Array<{ description: string; id: number; name: string; value: number }>
}) {
  const [scrollElement, setScrollElement] = React.useState<HTMLDivElement | null>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => 60,
    overscan: 5,
  })

  return (
    <ScrollArea
      className="relative h-96 w-80 overflow-hidden rounded-xl border border-gray-200"
      type="hover"
      scrollbarMode="large-y"
    >
      <ScrollArea.Viewport
        className="h-full"
        ref={setScrollElement}
      >
        <ScrollArea.Content>
          <div
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
                  className="absolute top-0 left-0 w-full border-b border-gray-100 p-3 transition-colors hover:bg-gray-50"
                  style={{
                    height: virtualItem.size,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                    <div className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-600">
                      {item.value}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb orientation="vertical" />
      </ScrollArea.Scrollbar>
    </ScrollArea>
  )
}
