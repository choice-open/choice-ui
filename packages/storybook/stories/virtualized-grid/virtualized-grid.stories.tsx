import { Avatar, Badge, Button, Input, ScrollArea, VirtualizedGrid } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useCallback, useMemo, useRef, useState } from "react"

const meta: Meta<typeof VirtualizedGrid> = {
  title: "Layouts/VirtualizedGrid",
  component: VirtualizedGrid,
  tags: ["autodocs", "upgrade"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof VirtualizedGrid>

/**
 * High-performance virtualized grid component for rendering large datasets efficiently.
 *
 * Features:
 * - O(log n) rendering performance using binary search optimization
 * - Memory-efficient with optional DOM node pooling
 * - Responsive grid with dynamic column count
 * - Smooth scrolling with configurable overscan
 * - Support for variable row heights
 * - Built-in error boundaries and edge case handling
 * - Support for both window and container scrolling
 * - List mode for single-column layouts
 *
 * Performance:
 * - Only renders visible items + overscan buffer
 * - Handles 100k+ items without performance degradation
 * - Minimal DOM manipulation with optional node reuse
 * - Constant-time scroll updates regardless of dataset size
 *
 * Usage:
 * - Virtual photo galleries and image grids
 * - Large data tables and lists
 * - Product catalogs and card layouts
 * - Any scenario with 500+ items requiring smooth scrolling
 */

// Generate sample data for stories
const generateItems = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index}`,
    index,
    title: `Item ${index + 1}`,
    description: `Description for Item ${index + 1}`,
    category: `${index + 1}`,
    price: `$${index + 1}`,
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  }))

/**
 * Basic grid layout with responsive columns.
 *
 * Note: This component uses window scroll by default.
 * For best testing experience, open in a standalone window.
 *
 * Demonstrates:
 * - Basic setup with responsive column calculation
 * - Default overscan behavior (5 rows)
 * - Dynamic item height based on column width
 */
export const Basic: Story = {
  render: function BasicStory() {
    const openInNewWindow = () => {
      const storyUrl = "/story/layouts/virtualized-grid/BasicDemo"
      window.open(storyUrl, "_blank", "width=1200,height=800")
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-secondary-foreground text-center">
          This component uses window scroll. Open in a standalone window for best experience.
        </p>
        <Button onClick={openInNewWindow}>Open in New Window</Button>
      </div>
    )
  },
}

/**
 * [TEST] BasicDemo - Actual demo for standalone window, not shown in docs.
 */
export const BasicDemo: Story = {
  render: function BasicDemoStory() {
    const items = useMemo(() => generateItems(1000), [])

    const card = useCallback(
      (item: (typeof items)[number]) => (
        <div
          className="bg-secondary-background flex min-h-0 flex-col overflow-hidden rounded-lg transition-shadow hover:shadow-md"
          style={{ height: "inherit" }}
        >
          <div className="min-h-0 p-4">
            <Avatar
              size={64}
              photo={item.image}
              name={item.title}
            />
          </div>
          <div className="flex flex-1 flex-col p-4">
            <h3 className="font-strong mb-2 line-clamp-2">{item.title}</h3>
            <p className="text-secondary-foreground mb-3 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between">
              <Badge>{item.category}</Badge>
              <span className="text-success-foreground font-strong">${item.price}</span>
            </div>
          </div>
        </div>
      ),
      [],
    )

    return (
      <VirtualizedGrid
        className="h-full w-full"
        items={items}
        overscan={5}
        columnCount={(width, gap) => Math.max(1, Math.floor((width + gap) / (250 + gap)))}
        gridGap={(width) => (width > 768 ? 24 : 16)}
        itemData={(item, columnWidth) => ({
          key: item.id,
          height: columnWidth * 0.75,
        })}
        renderItem={(item, index) => card(item)}
      />
    )
  },
}

/**
 * List mode for single-column vertical layouts.
 *
 * Demonstrates:
 * - List mode with single column (`listMode={true}`)
 * - Fixed row height for consistent layout
 * - Horizontal card layout with avatar
 */
export const ListMode: Story = {
  render: function ListModeStory() {
    const openInNewWindow = () => {
      const storyUrl = "/story/layouts/virtualized-grid/ListModeDemo"
      window.open(storyUrl, "_blank", "width=1200,height=800")
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-secondary-foreground text-center">
          This component uses window scroll. Open in a standalone window for best experience.
        </p>
        <Button onClick={openInNewWindow}>Open in New Window</Button>
      </div>
    )
  },
}

/**
 * [TEST] ListModeDemo - Actual demo for standalone window, not shown in docs.
 */
export const ListModeDemo: Story = {
  render: function ListModeDemoStory() {
    const items = useMemo(() => generateItems(500), [])

    const card = useCallback(
      (item: (typeof items)[number]) => (
        <div
          className="bg-secondary-background flex min-h-0 overflow-hidden rounded-lg transition-shadow hover:shadow-md"
          style={{ height: "inherit" }}
        >
          <div className="min-h-0 p-4">
            <Avatar
              size={64}
              photo={item.image}
              name={item.title}
            />
          </div>
          <div className="flex flex-1 flex-col p-4">
            <h3 className="font-strong mb-2 line-clamp-2">{item.title}</h3>
            <p className="text-secondary-foreground mb-3 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between">
              <Badge>{item.category}</Badge>
              <span className="text-success-foreground font-strong">${item.price}</span>
            </div>
          </div>
        </div>
      ),
      [],
    )

    return (
      <VirtualizedGrid
        className="h-full w-full"
        listMode={true}
        items={items}
        overscan={3}
        columnCount={() => 1}
        gridGap={() => 8}
        itemData={(item) => ({
          key: item.id,
          height: 64 + 32,
        })}
        renderItem={(item) => card(item)}
      />
    )
  },
}

/**
 * Performance optimized setup with DOM node pooling.
 *
 * Demonstrates:
 * - DOM node pooling for memory efficiency
 * - Minimal overscan for better performance
 * - Large dataset handling (10k items)
 */
export const PerformanceOptimized: Story = {
  render: function PerformanceOptimizedStory() {
    const openInNewWindow = () => {
      const storyUrl = "/story/layouts/virtualized-grid/PerformanceOptimizedDemo"
      window.open(storyUrl, "_blank", "width=1200,height=800")
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-secondary-foreground text-center">
          This component uses window scroll. Open in a standalone window for best experience.
        </p>
        <Button onClick={openInNewWindow}>Open in New Window</Button>
      </div>
    )
  },
}

/**
 * [TEST] PerformanceOptimizedDemo - Actual demo for standalone window, not shown in docs.
 */
export const PerformanceOptimizedDemo: Story = {
  render: function PerformanceOptimizedDemoStory() {
    const items = useMemo(() => generateItems(10000), [])

    return (
      <>
        <div className="flex items-center gap-4 p-4">
          <div>
            <strong>Dataset:</strong> {items.length.toLocaleString()} items
          </div>
          <div>
            <strong>Rendered:</strong> ~50-100 DOM nodes (pooled)
          </div>
          <div>
            <strong>Performance:</strong> O(log n) rendering
          </div>
        </div>

        <VirtualizedGrid
          className="h-full w-full"
          enablePooling={true}
          poolSize={50}
          maxPoolSize={200}
          overscan={2}
          items={items}
          columnCount={(width, gap) => Math.max(1, Math.floor((width + gap) / (200 + gap)))}
          gridGap={() => 12}
          itemData={(item, columnWidth) => ({
            key: item.id,
            height: columnWidth * 0.75,
          })}
          renderItem={(item, index) => (
            <div
              className="bg-default-background flex flex-col rounded-lg border p-3 transition-shadow hover:shadow-md"
              style={{ height: "inherit" }}
            >
              <div className="mb-3 w-full flex-1 rounded bg-gradient-to-br from-blue-400 to-purple-500" />
              <div className="space-y-2">
                <h3 className="font-strong line-clamp-1">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <Badge>#{(index ?? 0) + 1}</Badge>
                  <span className="text-success-foreground font-strong">${item.price}</span>
                </div>
              </div>
            </div>
          )}
        />
      </>
    )
  },
}

/**
 * Container scroll implementation within a ScrollArea.
 *
 * Demonstrates:
 * - Custom scroll container setup
 * - Integration with ScrollArea component
 * - Constrained height virtualization
 *
 * ```tsx
 * const scrollRef = useRef<HTMLDivElement>(null)
 * const containerRef = useRef<HTMLDivElement>(null)
 *
 * <ScrollArea>
 *   <ScrollArea.Viewport ref={scrollRef}>
 *     <ScrollArea.Content ref={containerRef}>
 *       <VirtualizedGrid
 *         scrollRef={scrollRef}
 *         containerRef={containerRef}
 *         // ... other props
 *       />
 *     </ScrollArea.Content>
 *   </ScrollArea.Viewport>
 * </ScrollArea>
 * ```
 */
export const ContainerScroll: Story = {
  render: function ContainerScrollStory() {
    const items = useMemo(() => generateItems(800), [])
    const scrollRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    return (
      <ScrollArea className="h-96 w-128 rounded-xl border">
        <ScrollArea.Viewport ref={scrollRef}>
          <ScrollArea.Content
            ref={containerRef}
            className="p-4"
          >
            <VirtualizedGrid
              scrollRef={scrollRef}
              containerRef={containerRef}
              items={items}
              overscan={3}
              columnCount={(width, gap) => Math.max(1, Math.floor((width + gap) / (128 + gap)))}
              gridGap={() => 16}
              itemData={(item, columnWidth) => ({
                key: item.id,
                height: columnWidth * 0.75,
              })}
              renderItem={(item, index) => (
                <div
                  className="bg-default-background flex flex-col rounded-lg border p-2"
                  style={{ height: "inherit" }}
                >
                  <div
                    className="mb-2 w-full flex-1 rounded-md"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex items-center justify-between">
                    <h3 className="font-strong line-clamp-2">{item.title}</h3>
                    <Badge>{item.category}</Badge>
                  </div>
                </div>
              )}
            />
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    )
  },
}

/**
 * Error handling and edge cases demonstration.
 *
 * Demonstrates:
 * - Custom error boundary fallback
 * - Error recovery mechanisms
 * - Empty state handling
 */
export const ErrorHandling: Story = {
  render: function ErrorHandlingStory() {
    const openInNewWindow = () => {
      const storyUrl = "/story/layouts/virtualized-grid/ErrorHandlingDemo"
      window.open(storyUrl, "_blank", "width=1200,height=800")
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-secondary-foreground text-center">
          This component uses window scroll. Open in a standalone window for best experience.
        </p>
        <Button onClick={openInNewWindow}>Open in New Window</Button>
      </div>
    )
  },
}

/**
 * [TEST] ErrorHandlingDemo - Actual demo for standalone window, not shown in docs.
 */
export const ErrorHandlingDemo: Story = {
  render: function ErrorHandlingDemoStory() {
    const [shouldError, setShouldError] = useState(false)
    const [items, setItems] = useState(() => generateItems(100))

    const errorProneItems = shouldError
      ? items.map((item, index) => {
          if (index === 50) {
            return { ...item, title: null as unknown as string }
          }
          return item
        })
      : items

    return (
      <>
        <div className="flex items-center gap-4 p-4">
          <div className="flex gap-2">
            <Button
              variant={shouldError ? "destructive" : "secondary"}
              onClick={() => setShouldError(!shouldError)}
            >
              {shouldError ? "Fix Error" : "Trigger Error"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setItems([])}
            >
              Clear Items
            </Button>
            <Button
              variant="secondary"
              onClick={() => setItems(generateItems(100))}
            >
              Reset Items
            </Button>
          </div>
        </div>

        <VirtualizedGrid
          className="h-full w-full"
          items={errorProneItems}
          overscan={5}
          columnCount={(width, gap) => Math.max(1, Math.floor((width + gap) / (250 + gap)))}
          gridGap={() => 16}
          itemData={(item, columnWidth) => ({
            key: item.id,
            height: columnWidth * 0.75,
          })}
          renderItem={(item, index) => (
            <div
              className="bg-default-background flex flex-col rounded-lg border p-4"
              style={{ height: "inherit" }}
            >
              <div
                className="mb-3 w-full flex-1 rounded-md"
                style={{ backgroundColor: item.color }}
              />
              <h3 className="font-strong mb-2">{item.title?.toUpperCase()}</h3>
              <div className="flex items-center justify-between">
                <p className="text-secondary-foreground line-clamp-2">{item.description}</p>
                <Badge>#{(index ?? 0) + 1}</Badge>
              </div>
            </div>
          )}
          errorFallback={({ error, retry }) => (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <span className="text-heading-display">⚠️</span>
              </div>
              <h3 className="text-body-large-strong mb-2">Something went wrong</h3>
              <p className="text-secondary-foreground mb-4 max-w-md">
                The virtualized grid encountered an error while rendering items.
              </p>
              <div className="flex gap-2">
                <Button onClick={retry}>Try Again</Button>
                <Button
                  variant="secondary"
                  onClick={() => setShouldError(false)}
                >
                  Fix Data
                </Button>
              </div>
            </div>
          )}
          onError={(error, errorInfo) => {
            console.error("VirtualizedGrid Error:", error, errorInfo)
          }}
        />
      </>
    )
  },
}

/**
 * Interactive configuration playground.
 *
 * Demonstrates:
 * - Dynamic configuration changes
 * - Real-time performance impact visualization
 * - Different overscan values
 * - Variable item sizes
 */
export const Playground: Story = {
  render: function PlaygroundStory() {
    const openInNewWindow = () => {
      const storyUrl = "/story/layouts/virtualized-grid/PlaygroundDemo"
      window.open(storyUrl, "_blank", "width=1200,height=800")
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-secondary-foreground text-center">
          This component uses window scroll. Open in a standalone window for best experience.
        </p>
        <Button onClick={openInNewWindow}>Open in New Window</Button>
      </div>
    )
  },
}

/**
 * [TEST] PlaygroundDemo - Actual demo for standalone window, not shown in docs.
 */
export const PlaygroundDemo: Story = {
  render: function PlaygroundDemoStory() {
    const [overscan, setOverscan] = useState(5)
    const [itemCount, setItemCount] = useState(1000)
    const [enablePooling, setEnablePooling] = useState(false)
    const [minHeight, setMinHeight] = useState(180)
    const [maxHeight, setMaxHeight] = useState(220)

    const items = useMemo(() => generateItems(itemCount), [itemCount])

    return (
      <>
        <div className="flex items-center gap-4 p-4">
          <div>
            <label className="font-strong mb-1 block">Item Count</label>
            <Input
              type="number"
              value={itemCount.toString()}
              onChange={(e) => setItemCount(Number(e))}
              min={10}
              max={50000}
              step={100}
            />
          </div>
          <div>
            <label className="font-strong mb-1 block">Overscan</label>
            <Input
              type="number"
              value={overscan.toString()}
              onChange={(e) => setOverscan(Number(e))}
              min={0}
              max={20}
            />
          </div>
          <div>
            <label className="font-strong mb-1 block">Min Height</label>
            <Input
              type="number"
              value={minHeight.toString()}
              onChange={(e) => setMinHeight(Number(e))}
              min={100}
              max={300}
              step={10}
            />
          </div>
          <div>
            <label className="font-strong mb-1 block">Max Height</label>
            <Input
              type="number"
              value={maxHeight.toString()}
              onChange={(e) => setMaxHeight(Number(e))}
              min={100}
              max={400}
              step={10}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 p-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enablePooling}
              onChange={(e) => setEnablePooling(e.target.checked)}
            />
            <span>Enable DOM Node Pooling</span>
          </label>
          <div className="text-secondary-foreground">
            Items: {itemCount.toLocaleString()} | Overscan: {overscan} | Pool:{" "}
            {enablePooling ? "ON" : "OFF"}
          </div>
        </div>

        <VirtualizedGrid
          className="h-full w-full"
          enablePooling={enablePooling}
          poolSize={50}
          maxPoolSize={200}
          overscan={overscan}
          items={items}
          columnCount={(width, gap) => Math.max(1, Math.floor((width + gap) / (240 + gap)))}
          gridGap={() => 16}
          itemData={(item) => {
            const height = minHeight + (item.index % (maxHeight - minHeight))
            return {
              key: item.id,
              height,
            }
          }}
          renderItem={(item, index) => {
            const height = minHeight + (item.index % (maxHeight - minHeight))

            return (
              <div
                className="bg-default-background flex flex-col rounded-lg border p-4"
                style={{ height }}
              >
                <div className="flex flex-1 flex-col">
                  <div
                    className="mb-3 w-full flex-1 rounded-md"
                    style={{ backgroundColor: item.color }}
                  />
                  <h3 className="font-strong mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-secondary-foreground line-clamp-3">{item.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <Badge>#{(index ?? 0) + 1}</Badge>
                  <span className="text-secondary-foreground">{height}px</span>
                </div>
              </div>
            )
          }}
        />
      </>
    )
  },
}
