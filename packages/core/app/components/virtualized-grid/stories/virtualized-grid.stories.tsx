import { Badge } from "@choiceform/badge"
import { Button } from "@choiceform/button"
import { Input } from "@choiceform/input"
import { ScrollArea } from "@choiceform/scroll-area"
import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useMemo, useRef, useState } from "react"
import { VirtualizedGrid } from "../src/virtualized-grid"

const meta: Meta<typeof VirtualizedGrid> = {
  title: "Utilities/VirtualizedGrid",
  component: VirtualizedGrid,
  tags: ["new"],
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
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    price: faker.commerce.price(),
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
    color: faker.color.rgb(),
  }))

/**
 * Basic grid layout with responsive columns.
 *
 * Demonstrates:
 * - Basic setup with responsive column calculation
 * - Default overscan behavior (5 rows)
 * - Simple card rendering with images
 *
 * ```tsx
 * <VirtualizedGrid
 *   items={items}
 *   columnCount={(width) => Math.floor(width / 250)}
 *   itemData={(item) => ({ key: item.id, height: 280 })}
 *   renderItem={(item) => <ProductCard {...item} />}
 * />
 * ```
 */
export const Basic: Story = {
  render: function BasicStory() {
    const items = useMemo(() => generateItems(1000), [])

    return (
      <VirtualizedGrid
        items={items}
        overscan={5}
        columnCount={(width, gap) => Math.max(1, Math.floor((width + gap) / (250 + gap)))}
        gridGap={(width) => (width > 768 ? 24 : 16)}
        itemData={(item) => ({
          key: item.id,
          height: 280,
        })}
        renderItem={(item, index) => (
          <div className="bg-default-background overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md">
            <img
              src={item.image}
              alt={item.title}
              className="h-32 w-full object-contain"
            />
            <div className="p-4">
              <h3 className="font-strong mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-secondary-foreground mb-3 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <Badge>{item.category}</Badge>
                <span className="text-success-foreground font-strong">${item.price}</span>
              </div>
            </div>
          </div>
        )}
      />
    )
  },
}

/**
 * List mode for single-column vertical layouts.
 *
 * Demonstrates:
 * - List mode with single column
 * - Variable item heights
 * - Horizontal layout within items
 *
 * ```tsx
 * <VirtualizedGrid
 *   listMode={true}
 *   items={items}
 *   columnCount={() => 1}
 *   itemData={(item) => ({ key: item.id, height: 120 })}
 *   renderItem={(item) => <ListItem {...item} />}
 * />
 * ```
 */
export const ListMode: Story = {
  render: function ListModeStory() {
    const items = useMemo(() => generateItems(500), [])

    return (
      <VirtualizedGrid
        listMode={true}
        items={items}
        overscan={3}
        columnCount={() => 1}
        gridGap={() => 8}
        itemData={(item) => ({
          key: item.id,
          height: 120,
        })}
        renderItem={(item, index) => (
          <div className="bg-default-background rounded-lg border p-4 transition-colors hover:bg-gray-50">
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-grow">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="font-strong truncate">{item.title}</h3>
                  <span className="text-success-foreground font-strong">${item.price}</span>
                </div>
                <p className="text-secondary-foreground mb-2 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2">
                  <Badge>{item.category}</Badge>
                  <span className="text-secondary-foreground">#{(index ?? 0) + 1}</span>
                </div>
              </div>
            </div>
          </div>
        )}
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
 * - Performance monitoring indicators
 *
 * ```tsx
 * <VirtualizedGrid
 *   enablePooling={true}
 *   poolSize={50}
 *   maxPoolSize={200}
 *   overscan={2}
 *   items={largeDataset}
 *   // ... other props
 * />
 * ```
 */
export const PerformanceOptimized: Story = {
  render: function PerformanceStory() {
    const items = useMemo(() => generateItems(10000), [])

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded-lg bg-blue-50 p-4">
          <div className="">
            <strong>Dataset:</strong> {items.length.toLocaleString()} items
          </div>
          <div className="">
            <strong>Rendered:</strong> ~50-100 DOM nodes (pooled)
          </div>
          <div className="">
            <strong>Performance:</strong> O(log n) rendering
          </div>
        </div>

        <VirtualizedGrid
          enablePooling={true}
          poolSize={50}
          maxPoolSize={200}
          overscan={2}
          items={items}
          columnCount={(width, gap) => Math.max(1, Math.floor((width + gap) / (200 + gap)))}
          gridGap={() => 12}
          itemData={(item) => ({
            key: item.id,
            height: 200,
          })}
          renderItem={(item, index) => (
            <div className="bg-default-background rounded-lg border p-3 transition-shadow hover:shadow-md">
              <div className="mb-3 h-20 w-full rounded bg-gradient-to-br from-blue-400 to-purple-500" />
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
      </div>
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
      <div className="space-y-4">
        <div className="rounded-lg bg-green-50 p-4">
          <p className="">
            <strong>Container Scroll:</strong> Virtualization within a custom scroll container
            instead of the window. Useful for modals, sidebars, or embedded layouts.
          </p>
        </div>

        <ScrollArea>
          <ScrollArea.Viewport
            ref={scrollRef}
            className="max-h-96 rounded-xl border"
          >
            <ScrollArea.Content
              ref={containerRef}
              className="p-4"
            >
              <VirtualizedGrid
                scrollRef={scrollRef}
                containerRef={containerRef}
                items={items}
                overscan={3}
                columnCount={(width, gap) => Math.max(1, Math.floor((width + gap) / (220 + gap)))}
                gridGap={() => 16}
                itemData={(item) => ({
                  key: item.id,
                  height: 180,
                })}
                renderItem={(item, index) => (
                  <div className="bg-default-background rounded-lg border p-3">
                    <div
                      className="mb-3 h-16 w-full rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <h3 className="font-strong mb-2 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-foreground">Item {(index ?? 0) + 1}</span>
                      <Badge>{item.category}</Badge>
                    </div>
                  </div>
                )}
              />
            </ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea>
      </div>
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
 * - Loading states
 *
 * ```tsx
 * <VirtualizedGrid
 *   items={items}
 *   errorFallback={({ error, retry }) => (
 *     <CustomErrorState error={error} onRetry={retry} />
 *   )}
 *   onError={(error, errorInfo) => {
 *     console.error('Grid error:', error)
 *   }}
 *   // ... other props
 * />
 * ```
 */
export const ErrorHandling: Story = {
  render: function ErrorHandlingStory() {
    const [shouldError, setShouldError] = useState(false)
    const [items, setItems] = useState(() => generateItems(100))

    const errorProneItems = shouldError
      ? items.map((item, index) => {
          if (index === 50) {
            // Simulate an error condition
            return { ...item, title: null as unknown as string }
          }
          return item
        })
      : items

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded-lg bg-yellow-50 p-4">
          <div className="flex-grow">
            <p className="">
              <strong>Error Handling:</strong> Demonstrates error boundaries, recovery, and edge
              cases.
            </p>
          </div>
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
          items={errorProneItems}
          overscan={5}
          columnCount={(width, gap) => Math.max(1, Math.floor((width + gap) / (250 + gap)))}
          gridGap={() => 16}
          itemData={(item) => ({
            key: item.id,
            height: 200,
          })}
          renderItem={(item, index) => (
            <div className="bg-default-background rounded-lg border p-4">
              <div className="mb-3 h-24 w-full rounded bg-gray-200" />
              <h3 className="font-strong mb-2">{item.title?.toUpperCase()}</h3>
              <p className="text-secondary-foreground mb-3 line-clamp-2">{item.description}</p>
              <Badge>#{(index ?? 0) + 1}</Badge>
            </div>
          )}
          errorFallback={({ error, retry }) => (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <span className="text-heading-display">⚠️</span>
              </div>
              <h3 className="text-body-large-strong mb-2">Something went wrong</h3>
              <p className="text-secondary-foreground mb-4 max-w-md">
                The virtualized grid encountered an error while rendering items. This could be due
                to invalid data or rendering issues.
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
              {process.env.NODE_ENV === "development" && (
                <details className="mt-4 text-left">
                  <summary className="text-secondary-foreground cursor-pointer">
                    Error Details (Dev Mode)
                  </summary>
                  <pre className="mt-2 max-w-md overflow-auto rounded bg-gray-100 p-2">
                    {error?.stack}
                  </pre>
                </details>
              )}
            </div>
          )}
          onError={(error, errorInfo) => {
            console.error("VirtualizedGrid Error:", error, errorInfo)
          }}
        />
      </div>
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
 *
 * ```tsx
 * const [overscan, setOverscan] = useState(5)
 * const [itemCount, setItemCount] = useState(1000)
 *
 * <VirtualizedGrid
 *   overscan={overscan}
 *   items={items.slice(0, itemCount)}
 *   // ... other props
 * />
 * ```
 */
export const Playground: Story = {
  render: function PlaygroundStory() {
    const [overscan, setOverscan] = useState(5)
    const [itemCount, setItemCount] = useState(1000)
    const [enablePooling, setEnablePooling] = useState(false)
    const [minHeight, setMinHeight] = useState(180)
    const [maxHeight, setMaxHeight] = useState(220)

    const items = useMemo(() => generateItems(itemCount), [itemCount])

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-4">
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

        <div className="flex items-center gap-4 rounded-lg bg-blue-50 p-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enablePooling}
              onChange={(e) => setEnablePooling(e.target.checked)}
            />
            <span className="">Enable DOM Node Pooling</span>
          </label>
          <div className="text-secondary-foreground">
            Items: {itemCount.toLocaleString()} | Overscan: {overscan} | Pool:{" "}
            {enablePooling ? "ON" : "OFF"}
          </div>
        </div>

        <VirtualizedGrid
          enablePooling={enablePooling}
          poolSize={50}
          maxPoolSize={200}
          overscan={overscan}
          items={items}
          columnCount={(width, gap) => Math.max(1, Math.floor((width + gap) / (240 + gap)))}
          gridGap={() => 16}
          itemData={(item) => {
            // Variable height based on settings
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
                <div className="flex-grow">
                  <div
                    className="mb-3 h-16 w-full rounded"
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
      </div>
    )
  },
}
