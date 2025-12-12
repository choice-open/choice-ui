import { Badge, Button, Stackflow, useStackflowContext } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Fragment } from "react/jsx-runtime"

const meta: Meta<typeof Stackflow> = {
  title: "Navigation/Stackflow",
  component: Stackflow,
  tags: ["new"],
}

export default meta
type Story = StoryObj<typeof Stackflow>

/**
 * Stackflow is a **non-linear stack navigation** component for managing multi-page views.
 *
 * ### Core Concepts
 * - **Stackflow**: Container component, manages navigation state
 * - **Stackflow.Item**: Page component, each `id` corresponds to one page
 * - **Stackflow.Prefix**: Fixed header area, does not scroll with pages
 * - **Stackflow.Suffix**: Fixed footer area, does not scroll with pages
 * - **useStackflowContext**: Hook to access navigation methods and state
 *
 * ### Navigation Methods
 * - `push(id)`: Navigate to a specified page and record in history
 * - `back()`: Return to the previous page
 * - `canGoBack`: Whether there is a previous page to return to
 * - `current`: Current page information
 */
export const Basic: Story = {
  render: function BasicStory() {
    // Header component - placed in Stackflow.Prefix, does not scroll with pages
    const Header = () => {
      const { push, back, canGoBack, current } = useStackflowContext()

      return (
        <div className="flex items-center justify-between border-b p-3">
          <Button
            variant="secondary"
            disabled={!canGoBack}
            onClick={back}
          >
            ← Back
          </Button>
          <span className="font-strong">{current?.id}</span>
          <Button
            variant="primary"
            disabled={current?.id === "page3"}
            onClick={() => {
              const nextMap: Record<string, string> = { page1: "page2", page2: "page3" }
              const next = nextMap[current?.id || ""]
              if (next) push(next)
            }}
          >
            Next →
          </Button>
        </div>
      )
    }

    return (
      <Stackflow
        className="w-80 rounded-xl border"
        defaultId="page1"
      >
        {/* Fixed header - does not scroll with page content */}
        <Stackflow.Prefix>
          <Header />
        </Stackflow.Prefix>

        {/* Page 1 */}
        <Stackflow.Item id="page1">
          <div className="p-4">
            <h3 className="font-strong mb-2">Page 1</h3>
            <p className="text-secondary-foreground">Click "Next" to navigate to Page 2.</p>
          </div>
        </Stackflow.Item>

        {/* Page 2 */}
        <Stackflow.Item id="page2">
          <div className="p-4">
            <h3 className="font-strong mb-2">Page 2</h3>
            <p className="text-secondary-foreground">
              Click "Back" to return, or "Next" to continue.
            </p>
          </div>
        </Stackflow.Item>

        {/* Page 3 */}
        <Stackflow.Item id="page3">
          <div className="p-4">
            <h3 className="font-strong mb-2">Page 3</h3>
            <p className="text-secondary-foreground">
              This is the last page. Click "Back" to return.
            </p>
          </div>
        </Stackflow.Item>
      </Stackflow>
    )
  },
}

/**
 * Unlike traditional linear step navigation, Stackflow supports **jumping to any page** at any time.
 *
 * ### Additional Features
 * - `history`: Complete navigation history array
 * - `clearHistory()`: Clear all history records
 *
 * ### Usage Scenario
 * - Wizard flows that allow jumping between steps
 * - Settings pages with multiple sub-pages
 * - Any scenario requiring page stack management
 *
 * ### Key Difference from Linear Navigation
 * - Linear: Page 1 → Page 2 → Page 3 (can only go forward/backward in order)
 * - Non-linear: Can jump from any page to any other page, history still tracks all visited pages
 */
export const NonLinearNavigation: Story = {
  render: function NonLinearNavigationStory() {
    // Header - displays navigation buttons, current page, and history
    const Header = () => {
      const { push, back, clearHistory, canGoBack, history, current } = useStackflowContext()

      return (
        <div className="flex flex-col gap-3 border-b p-4">
          {/* Navigation buttons - can jump to any page */}
          <div className="flex flex-wrap gap-2">
            {["home", "profile", "settings", "help"].map((page) => (
              <Button
                key={page}
                variant={current?.id === page ? "primary" : "secondary"}
                onClick={() => push(page)}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </Button>
            ))}
          </div>

          {/* Control buttons and status display */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={!canGoBack}
                onClick={back}
              >
                ← Back
              </Button>
              <Button
                variant="link-danger"
                onClick={clearHistory}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span>History:</span>
            {history.length > 0
              ? history.map((page, index) => (
                  <Fragment key={index}>
                    <Badge>{page}</Badge>
                    {index < history.length - 1 && " → "}
                  </Fragment>
                ))
              : "(empty)"}
          </div>
        </div>
      )
    }

    // Page content component
    const Page = ({ title, desc }: { desc: string; title: string }) => (
      <div className="p-6">
        <h2 className="text-heading-display mb-2">{title}</h2>
        <p className="text-secondary-foreground">{desc}</p>
      </div>
    )

    return (
      <Stackflow
        className="w-[420px] rounded-xl border"
        defaultId="home"
      >
        <Stackflow.Prefix>
          <Header />
        </Stackflow.Prefix>

        <Stackflow.Item id="home">
          <Page
            title="🏠 Home"
            desc="Try clicking different buttons above to jump between pages. Observe how the history changes."
          />
        </Stackflow.Item>

        <Stackflow.Item id="profile">
          <Page
            title="👤 Profile"
            desc="You can jump to any page from here, not limited to sequential navigation."
          />
        </Stackflow.Item>

        <Stackflow.Item id="settings">
          <Page
            title="⚙️ Settings"
            desc="Click 'Back' to return step by step through your visit history."
          />
        </Stackflow.Item>

        <Stackflow.Item id="help">
          <Page
            title="❓ Help"
            desc="Click 'Clear' to reset all history and return to the initial page."
          />
        </Stackflow.Item>

        {/* Fixed footer - does not scroll with page content */}
        <Stackflow.Suffix>
          <div className="text-secondary-foreground bg-secondary-background border-t p-4">
            💡 Stackflow.Prefix and Stackflow.Suffix are always fixed and do not scroll with page
            content
          </div>
        </Stackflow.Suffix>
      </Stackflow>
    )
  },
}

/**
 * `useStackflowContext` is a hook that provides access to the navigation state and methods.
 *
 * ### Return Values
 *
 * | Property | Type | Description |
 * |----------|------|-------------|
 * | `push` | `(id: string) => void` | Navigate to a page by id |
 * | `back` | `() => void` | Go back to the previous page |
 * | `clearHistory` | `() => void` | Clear history and return to the first page |
 * | `canGoBack` | `boolean` | Whether there's a previous page |
 * | `current` | `{ id, content } \| undefined` | Current page info |
 * | `history` | `string[]` | Array of visited page ids |
 * | `direction` | `"forward" \| "backward"` | Current navigation direction |
 * | `isInitial` | `boolean` | Whether it's the initial render |
 *
 * ### Usage
 * ```tsx
 * const { push, back, canGoBack, current, history, direction, isInitial, clearHistory } = useStackflowContext()
 * ```
 */
export const UseStackflowContext: Story = {
  render: function UseStackflowContextStory() {
    // Status panel - displays all values from useStackflowContext
    const StatusPanel = () => {
      const { push, back, clearHistory, canGoBack, current, history, direction, isInitial } =
        useStackflowContext()

      return (
        <div className="flex flex-col gap-4 border-b p-4">
          {/* Navigation buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              disabled={!canGoBack}
              onClick={back}
            >
              back()
            </Button>
            <Button
              variant="secondary"
              onClick={() => push("step1")}
            >
              push("step1")
            </Button>
            <Button
              variant="secondary"
              onClick={() => push("step2")}
            >
              push("step2")
            </Button>
            <Button
              variant="secondary"
              onClick={() => push("step3")}
            >
              push("step3")
            </Button>
            <Button
              variant="link-danger"
              onClick={clearHistory}
            >
              clearHistory()
            </Button>
          </div>

          {/* Status display */}
          <div className="bg-secondary-background grid grid-cols-2 gap-2 rounded-lg p-3 text-sm">
            <div>
              <span className="text-secondary-foreground">current?.id:</span>{" "}
              <Badge variant="brand">{current?.id || "undefined"}</Badge>
            </div>
            <div>
              <span className="text-secondary-foreground">canGoBack:</span>{" "}
              <Badge variant={canGoBack ? "success" : "default"}>
                {canGoBack ? "true" : "false"}
              </Badge>
            </div>
            <div>
              <span className="text-secondary-foreground">direction:</span>{" "}
              <Badge variant={direction === "forward" ? "brand" : "warning"}>{direction}</Badge>
            </div>
            <div>
              <span className="text-secondary-foreground">isInitial:</span>{" "}
              <Badge variant={isInitial ? "success" : "default"}>
                {isInitial ? "true" : "false"}
              </Badge>
            </div>
            <div className="col-span-2">
              <span className="text-secondary-foreground">history:</span>{" "}
              <span className="font-mono">[{history.map((h) => `"${h}"`).join(", ")}]</span>
            </div>
          </div>
        </div>
      )
    }

    return (
      <Stackflow
        className="w-[480px] rounded-xl border"
        defaultId="step1"
      >
        <Stackflow.Prefix>
          <StatusPanel />
        </Stackflow.Prefix>

        <Stackflow.Item id="step1">
          <div className="p-4">
            <h3 className="font-strong mb-2">Step 1</h3>
            <p className="text-secondary-foreground">
              Click the buttons above to navigate and observe how each value changes.
            </p>
          </div>
        </Stackflow.Item>

        <Stackflow.Item id="step2">
          <div className="p-4">
            <h3 className="font-strong mb-2">Step 2</h3>
            <p className="text-secondary-foreground">
              Notice how `direction` changes to "forward" when using push() and "backward" when
              using back().
            </p>
          </div>
        </Stackflow.Item>

        <Stackflow.Item id="step3">
          <div className="p-4">
            <h3 className="font-strong mb-2">Step 3</h3>
            <p className="text-secondary-foreground">
              The `isInitial` becomes false after the first navigation. Use clearHistory() to reset.
            </p>
          </div>
        </Stackflow.Item>
      </Stackflow>
    )
  },
}
