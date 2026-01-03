import {
  Button,
  Dialog,
  RadioGroup,
  Range,
  Segmented,
  Switch,
  ToastType,
  ToastVariant,
  Toaster,
  toast,
} from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useEffect, useMemo, useState } from "react"

const meta: Meta = {
  title: "Feedback/Toast",
  component: Toaster,
  tags: ["new", "autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Toast notifications provide non-blocking feedback to users about actions, events, or system status.
 * They appear temporarily and can be dismissed automatically or manually.
 *
 * ## Key Features
 * - **No Provider Required**: Toast works without wrapping your app in a context provider
 * - **Multiple Instances**: Support multiple Toaster components with unique IDs
 * - **Rich Content**: Support for titles, descriptions, icons, and action buttons
 * - **Flexible Positioning**: Six position options (top/bottom × left/center/right)
 * - **Auto-dismiss**: Configurable duration with pause-on-hover support
 * - **Stacking**: Multiple toasts stack elegantly with expand-on-hover
 *
 * ## Basic Usage
 *
 * ```tsx
 * import { Toaster, toast } from '@choice-ui/react'
 *
 * // 1. Place a Toaster component with a unique ID
 * <Toaster id="my-app" />
 *
 * // 2. Trigger toasts from anywhere using toast.use(id)
 * toast.use('my-app').success('Changes saved!')
 * toast.use('my-app').error('Something went wrong')
 * ```
 */

/**
 * ## Toast Types
 *
 * Toast provides six semantic types, each with a distinct icon and purpose:
 *
 * - **default**: General notifications without a specific semantic meaning
 * - **info**: Informational messages that provide helpful context
 * - **success**: Confirmation that an action completed successfully
 * - **warning**: Alerts about potential issues that need attention
 * - **error**: Critical errors that require user awareness
 * - **loading**: Indicates an ongoing process (does not auto-dismiss)
 *
 * Each type automatically displays an appropriate icon. The `loading` type
 * shows an animated spinner and will not auto-dismiss until manually closed
 * or updated via the promise API.
 */
export const Basic: Story = {
  name: "Types",
  render: function BasicStory() {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          Click each button to see the corresponding toast type. Each type has a unique icon and
          semantic meaning.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("basic")("Default Toast", {
                description: "A general notification without specific semantic meaning.",
              })
            }}
          >
            Default
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("basic").info("Information", {
                description: "Here is some useful information for you.",
              })
            }}
          >
            Info
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("basic").success("Success!", {
                description: "Your changes have been saved successfully.",
              })
            }}
          >
            Success
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("basic").warning("Warning", {
                description: "Please review before proceeding.",
              })
            }}
          >
            Warning
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("basic").error("Error", {
                description: "Something went wrong. Please try again.",
              })
            }}
          >
            Error
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("basic").loading("Loading...", {
                description: "Please wait while we process your request.",
              })
            }}
          >
            Loading
          </Button>
        </div>
        <Toaster id="basic" />
      </div>
    )
  },
}

/**
 * Toasts can display just a title without a description for brief, simple messages.
 * This is ideal for quick confirmations like "Saved!", "Copied!", or "Deleted!".
 *
 * Use title-only toasts when:
 * - The message is self-explanatory
 * - You want minimal visual disruption
 * - The action result is obvious from context
 */
export const TitleOnly: Story = {
  render: function TitleOnlyStory() {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          Simple toasts with just a title are perfect for quick, self-explanatory notifications.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => toast.use("title-only").success("Saved!")}
          >
            Success
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.use("title-only").error("Failed to save")}
          >
            Error
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.use("title-only").info("3 new messages")}
          >
            Info
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.use("title-only").warning("Low battery")}
          >
            Warning
          </Button>
        </div>
        <Toaster id="title-only" />
      </div>
    )
  },
}

/**
 * Add a `description` to provide additional context or details about the notification.
 * Descriptions appear below the title in a smaller, muted style.
 *
 * Best practices:
 * - Keep descriptions concise (1-2 sentences)
 * - Provide actionable information when possible
 * - Use for context that isn't obvious from the title alone
 */
export const WithDescription: Story = {
  render: function WithDescriptionStory() {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          Descriptions provide additional context below the title. Use them for details that help
          users understand what happened or what to do next.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("with-desc").success("File uploaded", {
                description: "Your file has been uploaded and is now available in your library.",
              })
            }}
          >
            Success with Details
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("with-desc").error("Upload failed", {
                description: "The file exceeds the 10MB size limit. Please compress and try again.",
              })
            }}
          >
            Error with Guidance
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("with-desc").warning("Session expiring", {
                description:
                  "Your session will expire in 5 minutes. Save your work to avoid data loss.",
              })
            }}
          >
            Warning with Action
          </Button>
        </div>
        <Toaster id="with-desc" />
      </div>
    )
  },
}

// =============================================================================
// ACTIONS & INTERACTIONS
// =============================================================================

/**
 * Toasts can include action and cancel buttons for user interaction.
 *
 * - **action**: Primary action button (e.g., "Undo", "View", "Retry")
 * - **cancel**: Secondary dismiss button (e.g., "Dismiss", "Cancel")
 *
 * Action buttons are useful for:
 * - Undo operations (delete, archive, etc.)
 * - Navigation to related content
 * - Retry failed operations
 * - Confirming or dismissing notifications
 *
 * Both buttons automatically close the toast after being clicked.
 */
export const WithAction: Story = {
  render: function WithActionStory() {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          Add interactive buttons to toasts for undo actions, navigation, or explicit dismissal.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("action")("Item deleted", {
                description: "The item has been moved to trash.",
                action: {
                  label: "Undo",
                  onClick: () => {
                    toast.use("action").success("Restored", {
                      description: "Item has been restored.",
                    })
                  },
                },
              })
            }}
          >
            With Undo
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("action").success("Export complete", {
                description: "Your data has been exported successfully.",
                action: {
                  label: "Download",
                  onClick: () => {
                    toast.use("action").info("Download started")
                  },
                },
              })
            }}
          >
            With Download
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("action").error("Connection lost", {
                description: "Unable to reach the server.",
                action: {
                  label: "Retry",
                  onClick: () => {
                    toast.use("action").loading("Reconnecting...")
                  },
                },
                cancel: {
                  label: "Dismiss",
                },
              })
            }}
          >
            With Retry & Cancel
          </Button>
        </div>
        <Toaster id="action" />
      </div>
    )
  },
}

/**
 * The `toast.promise()` API automatically manages loading, success, and error states
 * for asynchronous operations. It shows a loading toast while the promise is pending,
 * then updates to success or error based on the result.
 *
 * ```tsx
 * toast.use('my-app').promise(
 *   fetchData(),
 *   {
 *     loading: 'Fetching data...',
 *     success: 'Data loaded!',
 *     error: (err) => `Failed: ${err.message}`,
 *   }
 * )
 * ```
 *
 * Features:
 * - Loading state with spinner (no auto-dismiss)
 * - Automatic transition to success/error
 * - Dynamic messages based on promise result
 */
export const PromiseToast: Story = {
  render: function PromiseToastStory() {
    const simulateSuccess = () => {
      return new Promise<string>((resolve) => {
        setTimeout(() => resolve("Data saved!"), 2000)
      })
    }

    const simulateError = () => {
      return new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error("Network error")), 2000)
      })
    }

    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          Promise toasts automatically handle loading, success, and error states. The toast updates
          when the promise resolves or rejects.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("promise").promise(simulateSuccess(), {
                loading: "Saving...",
                success: "Saved successfully!",
                error: "Failed to save",
              })
            }}
          >
            Promise (Success)
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast
                .use("promise")
                .promise(simulateError(), {
                  loading: "Uploading...",
                  success: "Uploaded!",
                  error: (err) =>
                    err instanceof Error ? `Upload failed: ${err.message}` : "Upload failed",
                })
                .catch(() => {
                  // Handle the rejection silently
                })
            }}
          >
            Promise (Error)
          </Button>
        </div>
        <Toaster id="promise" />
      </div>
    )
  },
}

/**
 * Toasts can be dismissed programmatically using:
 *
 * - `toast.use(id).dismiss(toastId)` - Dismiss a specific toast by its ID
 * - `toast.use(id).dismissAll()` - Dismiss all toasts in a Toaster
 *
 * Each `toast.use(id)()` call returns the toast's unique ID, which you can store
 * and use later to dismiss that specific toast.
 *
 * Use cases:
 * - Dismiss related toasts when navigating away
 * - Clear all notifications on logout
 * - Remove outdated notifications when new data arrives
 */
export const DismissToast: Story = {
  render: function DismissToastStory() {
    const [toastIds, setToastIds] = useState<string[]>([])

    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          Store toast IDs to dismiss them programmatically. Use{" "}
          <code className="bg-default-background rounded px-1">dismissAll()</code> to clear all
          toasts at once.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              const id = toast.use("dismiss").info(`Toast #${toastIds.length + 1}`, {
                description: "This toast will stay until dismissed.",
                duration: 0,
                onClose: () => {
                  setToastIds((prev) => prev.filter((i) => i !== id))
                },
              })
              setToastIds((prev) => [...prev, id])
            }}
          >
            Add Toast
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              if (toastIds.length > 0) {
                const lastId = toastIds[toastIds.length - 1]
                toast.use("dismiss").dismiss(lastId)
              }
            }}
            disabled={toastIds.length === 0}
          >
            Dismiss Last
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              toast.use("dismiss").dismissAll()
              setToastIds([])
            }}
            disabled={toastIds.length === 0}
          >
            Dismiss All ({toastIds.length})
          </Button>
        </div>

        <p className="text-secondary-foreground text-body-small">
          Active toasts: {toastIds.length}
        </p>
        <Toaster id="dismiss" />
      </div>
    )
  },
}

// =============================================================================
// TIMING & BEHAVIOR
// =============================================================================

/**
 * Control how long toasts remain visible with the `duration` option (in milliseconds).
 *
 * - **Default**: 5000ms (5 seconds)
 * - **Custom**: Any positive number
 * - **Persistent**: Set `duration: 0` or `duration: Infinity` to disable auto-dismiss
 *
 * Guidelines:
 * - Short messages: 2-3 seconds
 * - Standard notifications: 4-5 seconds
 * - Important information: 7-10 seconds
 * - Critical alerts: `duration: 0` or `Infinity` (manual dismiss only)
 *
 * Note: `loading` type toasts never auto-dismiss regardless of duration setting.
 */
export const Duration: Story = {
  render: function DurationStory() {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          Set custom durations for different notification types. Use{" "}
          <code className="bg-default-background rounded px-1">duration: 0</code> for persistent
          toasts that require manual dismissal.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("duration").info("Quick Toast", {
                description: "This will disappear in 2 seconds.",
                duration: 2000,
              })
            }}
          >
            2 Seconds
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("duration").info("Normal Toast", {
                description: "This will disappear in 5 seconds (default).",
                duration: 5000,
              })
            }}
          >
            5 Seconds (Default)
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("duration").info("Long Toast", {
                description: "This will disappear in 10 seconds.",
                duration: 10000,
              })
            }}
          >
            10 Seconds
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("duration").warning("Persistent Toast", {
                description: "This toast will stay until manually dismissed.",
                duration: 0,
                cancel: { label: "Dismiss" },
              })
            }}
          >
            No Auto-Dismiss
          </Button>
        </div>
        <Toaster id="duration" />
      </div>
    )
  },
}

/**
 * Set `duration: Infinity` for toasts that should never auto-dismiss.
 * This is useful for critical notifications that require explicit user acknowledgment.
 *
 * Use cases:
 * - Important security alerts (password changes, session expiry)
 * - Critical errors that need user action
 * - Confirmations that shouldn't disappear automatically
 *
 * Note: Always provide a way to dismiss (action button or cancel) for infinite duration toasts.
 */
export const InfiniteDuration: Story = {
  render: function InfiniteDurationStory() {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          Use <code className="bg-default-background rounded px-1">duration: Infinity</code> for
          toasts that require explicit user dismissal. Always provide a close action.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("infinite").warning("Password Changed", {
                description:
                  "Your password has been updated. Please log in again on other devices.",
                duration: Infinity,
                action: {
                  label: "Got it",
                  onClick: () => {},
                },
              })
            }}
          >
            Security Alert
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("infinite").error("Connection Lost", {
                description: "Unable to connect to server. Check your internet connection.",
                duration: Infinity,
                action: {
                  label: "Retry",
                  onClick: () => {
                    toast.use("infinite").loading("Reconnecting...")
                  },
                },
                cancel: {
                  label: "Dismiss",
                },
              })
            }}
          >
            Critical Error
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("infinite").success("Export Ready", {
                description: "Your data export is ready for download.",
                duration: Infinity,
                variant: "success",
                action: {
                  label: "Download",
                  onClick: () => {
                    toast.use("infinite").info("Download started")
                  },
                },
                cancel: {
                  label: "Later",
                },
              })
            }}
          >
            Persistent Success
          </Button>
        </div>
        <Toaster id="infinite" />
      </div>
    )
  },
}

/**
 * Enable `showProgress` on the Toaster to display a countdown indicator on each toast.
 * The progress bar shows the remaining time before auto-dismiss and pauses when hovering.
 *
 * Features:
 * - Visual countdown indicator
 * - Pauses on hover (timer also pauses)
 * - Not shown for `loading` type, `duration: 0`, or `duration: Infinity` toasts
 * - Styled differently for default and compact layouts
 * - Per-toast override via `progress` option
 *
 * The progress bar helps users understand how long a notification will remain visible
 * and gives them time to read or interact with it.
 */
export const WithProgressBar: Story = {
  render: function WithProgressBarStory() {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          Enable <code className="bg-default-background rounded px-1">showProgress</code> on
          Toaster, or use <code className="bg-default-background rounded px-1">progress</code>{" "}
          option per toast. Hover over the toast to pause the timer.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              toast.use("progress").success("File uploaded", {
                description: "Your file has been uploaded successfully.",
              })
            }
          >
            Success
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast
                .use("progress")
                .error("Upload failed", { description: "Please try again later." })
            }
          >
            Error
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast
                .use("progress")
                .warning("Low storage", { description: "You are running out of storage space." })
            }
          >
            Warning
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.use("progress").success("Quick toast", { duration: 3000 })}
          >
            3s Duration
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast
                .use("progress")
                .loading("Processing...", { description: "Loading toasts don't show progress." })
            }
          >
            Loading (No Progress)
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.use("progress").info("No progress bar", {
                description: "This toast has progress disabled via the progress option.",
                progress: false,
              })
            }
          >
            Disabled via Option
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.use("progress").warning("Persistent with progress", {
                description: "Infinite duration toasts don't show progress bar.",
                duration: Infinity,
                cancel: { label: "Dismiss" },
              })
            }
          >
            Infinity (No Progress)
          </Button>
        </div>
        <Toaster
          id="progress"
          showProgress
          duration={5000}
        />
      </div>
    )
  },
}

/**
 * Multiple toasts stack elegantly with a subtle offset and fade effect.
 * By default, only the most recent 3 toasts are visible.
 *
 * Interaction:
 * - **Collapsed**: Toasts stack with visual offset indicating depth
 * - **Expanded**: Hover over the stack to expand and view all toasts
 * - **Dismiss**: Swipe or click to dismiss individual toasts
 *
 * Configure with `visibleToasts` prop (default: 3) to control how many
 * toasts are visible at once.
 */
export const Stacking: Story = {
  render: function StackingStory() {
    const [counter, setCounter] = useState(0)

    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          Multiple toasts stack with a subtle offset. Hover over the stack to expand and view all
          notifications. The default limit is 3 visible toasts.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setCounter((c) => c + 1)
              toast.use("stacking").info(`Notification #${counter + 1}`, {
                description: "Hover over the stack to expand all toasts.",
              })
            }}
          >
            Add Toast
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                  setCounter((c) => c + 1)
                  toast.use("stacking").info(`Burst Toast #${counter + i + 1}`, {
                    description: "Multiple toasts added in quick succession.",
                  })
                }, i * 100)
              }
            }}
          >
            Add 5 Toasts
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("stacking").dismissAll()
              setCounter(0)
            }}
          >
            Clear All
          </Button>
        </div>
        <Toaster id="stacking" />
      </div>
    )
  },
}

// =============================================================================
// APPEARANCE
// =============================================================================

/**
 * The `variant` option controls the background color scheme of individual toasts.
 * This is separate from `type` which controls the icon.
 *
 * Available variants:
 * - **default**: Dark neutral background (gray)
 * - **accent**: Blue/brand color background
 * - **success**: Green background
 * - **warning**: Yellow/amber background (dark text)
 * - **error**: Red background
 * - **assistive**: Pink/magenta background
 *
 * Use variants to:
 * - Match your application's color scheme
 * - Emphasize certain notifications
 * - Create visual hierarchy among notifications
 */
export const Variant: Story = {
  render: function VariantStory() {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          Use the <code className="bg-default-background rounded px-1">variant</code> option to
          customize the background color scheme of each toast independently from its type.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              toast.use("variant")("Default Variant", {
                description: "Neutral dark background for general notifications.",
                variant: "default",
                action: { label: "Action", onClick: () => {} },
                cancel: { label: "Dismiss" },
              })
            }
          >
            Default
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.use("variant")("Accent Variant", {
                description: "Blue/brand color for emphasis.",
                variant: "accent",
                action: { label: "Action", onClick: () => {} },
                cancel: { label: "Dismiss" },
              })
            }
          >
            Accent
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.use("variant")("Success Variant", {
                description: "Green background for positive outcomes.",
                variant: "success",
                action: { label: "Action", onClick: () => {} },
                cancel: { label: "Dismiss" },
              })
            }
          >
            Success
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.use("variant")("Warning Variant", {
                description: "Yellow background with dark text for caution.",
                variant: "warning",
                action: { label: "Action", onClick: () => {} },
                cancel: { label: "Dismiss" },
              })
            }
          >
            Warning
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.use("variant")("Error Variant", {
                description: "Red background for critical issues.",
                variant: "error",
                action: { label: "Action", onClick: () => {} },
                cancel: { label: "Dismiss" },
              })
            }
          >
            Error
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.use("variant")("Assistive Variant", {
                description: "Pink/magenta for AI or assistive features.",
                variant: "assistive",
                action: { label: "Action", onClick: () => {} },
                cancel: { label: "Dismiss" },
              })
            }
          >
            Assistive
          </Button>
        </div>
        <Toaster id="variant" />
      </div>
    )
  },
}

/**
 * Set `layout="compact"` on the Toaster for a minimal, single-line toast style.
 * Compact toasts are smaller (40px height) and don't show descriptions.
 *
 * Best for:
 * - Brief confirmations ("Saved", "Copied", "Sent")
 * - High-frequency notifications
 * - Mobile or space-constrained UIs
 * - Non-critical status updates
 *
 * Features:
 * - Smaller, pill-shaped appearance
 * - Dynamic width based on content
 * - Title only (descriptions are hidden)
 * - Progress bar fills the background
 */
export const CompactLayout: Story = {
  render: function CompactLayoutStory() {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          Use <code className="bg-default-background rounded px-1">layout="compact"</code> for
          minimal, single-line toasts. Ideal for brief confirmations and high-frequency
          notifications.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              toast
                .use("compact")
                .success("Changes saved, this is a long message to see how it wraps")
            }
          >
            Success
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast
                .use("compact")
                .error("Failed to save, this is a long message to see how it wraps")
            }
          >
            Error
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast
                .use("compact")
                .warning("Low battery, this is a long message to see how it wraps")
            }
          >
            Warning
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.use("compact").info("New message, this is a long message to see how it wraps")
            }
          >
            Info
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast
                .use("compact")
                .success("With action, this is a long message to see how it wraps", {
                  action: { label: "Undo", onClick: () => {} },
                  cancel: { label: "Dismiss" },
                })
            }
          >
            With Action
          </Button>
        </div>
        <Toaster
          id="compact"
          layout="compact"
          position="bottom-center"
          showProgress={true}
        />
      </div>
    )
  },
}

/**
 * Control where toasts appear on screen with the `position` prop on Toaster.
 *
 * Available positions:
 * - `top-left`, `top-center`, `top-right`
 * - `bottom-left`, `bottom-center`, `bottom-right` (default)
 *
 * The `offset` prop controls the distance from viewport edges (default: 16px).
 *
 * Swipe direction adapts to position:
 * - Corner positions: Swipe left/right to dismiss
 * - Center positions: Swipe up/down to dismiss
 */
export const Position: Story = {
  render: function PositionStory() {
    const positions = [
      "top-left",
      "top-center",
      "top-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ] as const

    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          Click each button to see a toast in that position. The swipe direction to dismiss adapts
          based on position (horizontal for corners, vertical for center).
        </p>
        <div className="grid grid-cols-3 gap-2">
          {positions.map((pos) => (
            <Button
              key={pos}
              variant="secondary"
              onClick={() => {
                toast.use(`pos-${pos}`).info(`Position: ${pos}`, {
                  description: "Swipe to dismiss or wait for auto-dismiss.",
                })
              }}
            >
              {pos}
            </Button>
          ))}
        </div>
        {positions.map((pos) => (
          <Toaster
            key={pos}
            id={`pos-${pos}`}
            position={pos}
          />
        ))}
      </div>
    )
  },
}

// =============================================================================
// ADVANCED FEATURES
// =============================================================================

/**
 * You can have multiple Toaster components with different IDs and configurations.
 * Use `toast.use(id)` to target a specific Toaster.
 *
 * Use cases:
 * - Different positions for different notification types
 * - Separate system notifications from user actions
 * - Different styling or behavior per area
 *
 * Each Toaster maintains its own toast queue and state independently.
 */
export const MultipleToasters: Story = {
  render: function MultipleToastersStory() {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          Multiple Toaster instances with different IDs operate independently. Use{" "}
          <code className="bg-default-background rounded px-1">toast.use("id")</code> to target
          specific instances.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 rounded-lg border p-4">
            <h3 className="text-body-medium font-semibold">System Notifications (Top-Left)</h3>
            <p className="text-secondary-foreground text-body-small">
              For system-level alerts and background processes
            </p>
            <Button
              className="self-start"
              variant="secondary"
              onClick={() => {
                toast.use("system").warning("System Update", {
                  description: "A new update is available.",
                })
              }}
            >
              System Toast
            </Button>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border p-4">
            <h3 className="text-body-medium font-semibold">User Actions (Bottom-Right)</h3>
            <p className="text-secondary-foreground text-body-small">
              For user-triggered action confirmations
            </p>
            <Button
              className="self-start"
              variant="secondary"
              onClick={() => {
                toast.use("user").success("Changes saved", {
                  description: "Your preferences have been updated.",
                })
              }}
            >
              User Toast
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={() => {
              toast.use("system").info("Sync started")
              toast.use("user").info("Preparing data...")
            }}
          >
            Toast to Both
          </Button>
        </div>

        <Toaster
          id="system"
          position="top-left"
        />
        <Toaster
          id="user"
          position="bottom-right"
        />
      </div>
    )
  },
}

/**
 * Both `title` and `description` automatically detect and render HTML content.
 * When a string contains HTML tags (like `<b>`, `<strong>`, `<span>`), it will be
 * rendered as HTML. Plain strings and React nodes are rendered normally.
 *
 * Supported HTML:
 * - `<strong>`, `<b>` for bold text
 * - `<code>` for inline code
 * - `<span>` with classes for colored text
 * - Any inline HTML elements with Tailwind classes
 *
 * **Security Note**: Only use HTML strings with trusted content.
 * User-generated content should be sanitized before rendering.
 */
export const HtmlContent: Story = {
  render: function HtmlContentStory() {
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
      <div className="flex flex-col gap-4">
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        >
          <Dialog.Header title="Project Details" />
          <Dialog.Content className="w-96 p-4">
            This is the duplicated project. You can now edit and customize it as needed.
          </Dialog.Content>
        </Dialog>

        <p className="text-secondary-foreground">
          Both title and description automatically detect HTML tags and render them appropriately.
          Plain strings are rendered as text, while strings with HTML tags are rendered as HTML.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              toast.use("html-content").success("Project duplicated", {
                description:
                  'Duplicated <strong class="text-white">Original Project</strong> to <strong class="text-white">New Project Copy</strong>',
              })
            }
          >
            HTML Description
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast
                .use("html-content")
                .info('<span class="text-accent-foreground">New message</span> received', {
                  description:
                    'From <span class="text-accent-foreground">john@example.com</span>: Meeting at 3pm',
                })
            }
          >
            HTML Title + Description
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.use("html-content").error("Error occurred", {
                description:
                  'Failed to save <code class="bg-white/10 px-1 rounded">config.json</code>. Please try again.',
              })
            }
          >
            Code Element
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.use("html-content").success("<b>Project</b> duplicated", {
                description: "Duplicated <b>Original Project</b> to <b>New Project Copy</b>",
                action: {
                  label: "View Project",
                  onClick: () => setDialogOpen(true),
                },
              })
            }
          >
            HTML + Action
          </Button>
        </div>
        <Toaster id="html-content" />
      </div>
    )
  },
}

/**
 * Use compound components to fully customize toast appearance:
 *
 * - `Toaster.Item` - Wrapper with custom className/style
 * - `Toaster.Icon` - Custom icon renderer `(type, defaultIcon) => ReactNode`
 * - `Toaster.Title` - Custom title styling
 * - `Toaster.Description` - Custom description styling
 * - `Toaster.Actions` - Custom action buttons `(action, cancel, close) => ReactNode`
 *
 * This enables complete control over toast appearance while maintaining
 * the toast's behavior and state management.
 */
export const CustomSlots: Story = {
  render: function CustomSlotsStory() {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          Use compound components to customize each part of the toast. This example uses emoji icons
          and custom button styling.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("custom-slots").success("Custom Icon", {
                description: "This toast uses emoji instead of the default icon.",
              })
            }}
          >
            Custom Icon
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.use("custom-slots").warning("With Action", {
                description: "Custom styled action button.",
                action: {
                  label: "Confirm",
                  onClick: () => {
                    toast.use("custom-slots").success("Confirmed!")
                  },
                },
              })
            }}
          >
            Custom Actions
          </Button>
        </div>
        <Toaster id="custom-slots">
          <Toaster.Item className="bg-default-background text-default-foreground">
            <Toaster.Icon>
              {(type, defaultIcon) => (
                <span className="text-xl">
                  {type === "success" && "✨"}
                  {type === "info" && "💡"}
                  {type === "warning" && "⚡"}
                  {type === "error" && "💥"}
                  {type === "loading" && defaultIcon}
                  {type === "default" && "📢"}
                </span>
              )}
            </Toaster.Icon>
            <Toaster.Title className="text-default-foreground font-bold uppercase tracking-wide" />
            <Toaster.Description className="text-body-medium text-secondary-foreground" />
            <Toaster.Actions>
              {(action, cancel, close) => (
                <div className="flex gap-1 px-2">
                  {action && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        action.onClick()
                        close()
                      }}
                    >
                      {action.label}
                    </Button>
                  )}
                  {cancel && <Button onClick={close}>{cancel.label}</Button>}
                </div>
              )}
            </Toaster.Actions>
          </Toaster.Item>
        </Toaster>
      </div>
    )
  },
}

/**
 * This example demonstrates using toast within React effects for:
 * - Triggering toasts based on state changes
 * - Proper cleanup when components unmount
 * - Managing toast state alongside component state
 *
 * Key patterns:
 * - Store toast IDs for later dismissal
 * - Clean up toasts on unmount
 * - Handle action callbacks that update component state
 */
export const UseEffect: Story = {
  render: function UseEffectStory() {
    const [isMonitoring, setIsMonitoring] = useState(false)
    const [hasToast, setHasToast] = useState(false)
    const [toastId, setToastId] = useState<string | null>(null)
    const [actionCount, setActionCount] = useState(0)

    // Simulated monitoring effect that triggers toast
    useEffect(() => {
      if (!isMonitoring) return

      const timer = setTimeout(() => {
        if (!hasToast) {
          const id = toast.use("useeffect").warning("System Alert", {
            description: "An issue was detected. Take action or dismiss.",
            duration: 0,
            action: {
              label: `Fix Issue (${actionCount})`,
              onClick: () => {
                setActionCount((prev) => prev + 1)
                setIsMonitoring(false)
                setHasToast(false)
              },
            },
            cancel: {
              label: "Ignore",
              onClick: () => {
                setHasToast(false)
              },
            },
          })

          setToastId(id)
          setHasToast(true)
        }
      }, 1500)

      return () => clearTimeout(timer)
    }, [isMonitoring, hasToast, actionCount])

    // Cleanup effect
    useEffect(() => {
      return () => {
        if (toastId) {
          toast.use("useeffect").dismiss(toastId)
        }
      }
    }, [toastId])

    return (
      <div className="flex flex-col gap-4">
        <p className="text-secondary-foreground">
          This example shows proper toast integration with React effects, including state management
          and cleanup.
        </p>

        <div className="flex gap-2">
          <Button
            variant={isMonitoring ? "primary" : "secondary"}
            onClick={() => {
              setIsMonitoring(!isMonitoring)
              if (isMonitoring && toastId) {
                toast.use("useeffect").dismiss(toastId)
                setHasToast(false)
              }
            }}
          >
            {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setActionCount(0)
              setHasToast(false)
              if (toastId) {
                toast.use("useeffect").dismiss(toastId)
              }
            }}
          >
            Reset State
          </Button>
        </div>

        <div className="text-secondary-foreground space-y-1 rounded-lg border p-3">
          <p>
            <strong>Status:</strong> {isMonitoring ? "Monitoring active" : "Monitoring inactive"}
          </p>
          <p>
            <strong>Toast:</strong> {hasToast ? "Visible" : "Hidden"}
          </p>
          <p>
            <strong>Action count:</strong> {actionCount}
          </p>
        </div>

        <Toaster id="useeffect" />
      </div>
    )
  },
}

// =============================================================================
// PLAYGROUND
// =============================================================================

/**
 * Interactive playground to test all Toast features and configurations.
 * Experiment with different combinations of:
 *
 * - **Position**: Where toasts appear on screen
 * - **Variant**: Background color scheme
 * - **Type**: Semantic type with corresponding icon
 * - **Layout**: Default (full) or compact style
 * - **Progress**: Show/hide countdown indicator
 * - **Actions**: Add action and cancel buttons
 * - **Content**: Adjust title and description length
 * - **Offset**: Distance from viewport edges
 */
export const Playground: Story = {
  render: function PlaygroundStory() {
    const [position, setPosition] = useState<
      "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
    >("bottom-right")

    const [offset, setOffset] = useState<number>(16)
    const [variant, setVariant] = useState<ToastVariant>("default")
    const [type, setType] = useState<ToastType>("default")
    const [showProgress, setShowProgress] = useState<boolean>(false)
    const [layout, setLayout] = useState<"default" | "compact">("default")
    const [showAction, setShowAction] = useState<boolean>(false)
    const [showClose, setShowClose] = useState<boolean>(false)

    const [titleLength, setTitleLength] = useState<"short" | "medium" | "long">("short")
    const [descriptionLength, setDescriptionLength] = useState<
      "none" | "short" | "medium" | "long"
    >("short")

    const title = useMemo(() => {
      if (titleLength === "short") {
        return "Short title"
      } else if (titleLength === "medium") {
        return "Medium title that takes up more space in the toast notification."
      } else {
        return "Long title that is very long and will likely wrap to multiple lines in the toast notification area."
      }
    }, [titleLength])

    const description = useMemo(() => {
      if (descriptionLength === "none") {
        return undefined
      } else if (descriptionLength === "short") {
        return "Short description text."
      } else if (descriptionLength === "medium") {
        return "Medium description that provides more context about the notification."
      } else {
        return "Long description that is very detailed and provides comprehensive information about what happened and what the user should do next."
      }
    }, [descriptionLength])

    const toastOptions = useMemo(
      () => ({
        description,
        variant,
        action: showAction
          ? {
              label: "Action",
              onClick: () => {
                console.log("Action clicked")
              },
            }
          : undefined,
        cancel: showClose
          ? {
              label: "Cancel",
              onClick: () => {
                console.log("Cancel clicked")
              },
            }
          : undefined,
      }),
      [description, showAction, showClose, variant],
    )

    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="mb-2 font-medium">Position</p>
            <RadioGroup
              variant="accent"
              value={position}
              onChange={(value) =>
                setPosition(
                  value as
                    | "top-left"
                    | "top-center"
                    | "top-right"
                    | "bottom-left"
                    | "bottom-center"
                    | "bottom-right",
                )
              }
            >
              {[
                "top-left",
                "top-center",
                "top-right",
                "bottom-left",
                "bottom-center",
                "bottom-right",
              ].map((pos) => (
                <RadioGroup.Item
                  key={pos}
                  value={pos}
                >
                  {pos}
                </RadioGroup.Item>
              ))}
            </RadioGroup>
          </div>

          <div>
            <p className="mb-2 font-medium">Variant</p>
            <RadioGroup
              variant="accent"
              value={variant}
              onChange={(value) => setVariant(value as ToastVariant)}
            >
              {["default", "accent", "success", "warning", "error", "assistive"].map((v) => (
                <RadioGroup.Item
                  key={v}
                  value={v}
                >
                  {v}
                </RadioGroup.Item>
              ))}
            </RadioGroup>
          </div>

          <div>
            <p className="mb-2 font-medium">Type</p>
            <RadioGroup
              variant="accent"
              value={type}
              onChange={(value) => setType(value as ToastType)}
            >
              {["default", "info", "success", "warning", "error", "loading"].map((t) => (
                <RadioGroup.Item
                  key={t}
                  value={t}
                >
                  {t}
                </RadioGroup.Item>
              ))}
            </RadioGroup>
          </div>

          <div>
            <p className="mb-2 font-medium">Layout</p>
            <RadioGroup
              variant="accent"
              value={layout}
              onChange={(value) => setLayout(value as "default" | "compact")}
            >
              {["default", "compact"].map((l) => (
                <RadioGroup.Item
                  key={l}
                  value={l}
                >
                  {l}
                </RadioGroup.Item>
              ))}
            </RadioGroup>

            <div className="mt-4 flex flex-col gap-2">
              <Switch
                variant="accent"
                size="small"
                value={showProgress}
                onChange={(value) => setShowProgress(value)}
              >
                Progress Bar
              </Switch>
              <Switch
                variant="accent"
                size="small"
                value={showAction}
                onChange={(value) => setShowAction(value)}
              >
                Action Button
              </Switch>
              <Switch
                variant="accent"
                size="small"
                value={showClose}
                onChange={(value) => setShowClose(value)}
              >
                Cancel Button
              </Switch>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2 font-medium">Title Length</p>

            <Segmented
              value={titleLength}
              onChange={(value) => setTitleLength(value as "short" | "medium" | "long")}
            >
              {["short", "medium", "long"].map((length) => (
                <Segmented.Item
                  key={length}
                  value={length}
                >
                  {length}
                </Segmented.Item>
              ))}
            </Segmented>
          </div>
          <div>
            <p className="mb-2 font-medium">Description Length</p>
            <Segmented
              value={descriptionLength}
              onChange={(value) =>
                setDescriptionLength(value as "none" | "short" | "medium" | "long")
              }
            >
              {["none", "short", "medium", "long"].map((length) => (
                <Segmented.Item
                  key={length}
                  value={length}
                >
                  {length}
                </Segmented.Item>
              ))}
            </Segmented>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-1 items-center gap-4">
            <span className="w-20 flex-none">Offset: {offset}px</span>
            <Range
              min={0}
              max={64}
              step={4}
              value={offset}
              onChange={(value) => setOffset(value)}
              className="flex-1"
              trackSize={{
                width: "auto",
              }}
            />
          </div>
          <Button
            onClick={() => {
              const api = toast.use("playground")
              switch (type) {
                case "default":
                  api(title, toastOptions)
                  break
                case "info":
                  api.info(title, toastOptions)
                  break
                case "success":
                  api.success(title, toastOptions)
                  break
                case "warning":
                  api.warning(title, toastOptions)
                  break
                case "error":
                  api.error(title, toastOptions)
                  break
                case "loading":
                  api.loading(title, toastOptions)
                  break
              }
            }}
          >
            Show Toast
          </Button>
        </div>

        <Toaster
          id="playground"
          key={`${position}-${layout}`}
          position={position}
          showProgress={showProgress}
          offset={offset}
          layout={layout}
        />
      </div>
    )
  },
}
