import { Button } from "@choiceform/button"
import { Dialog } from "@choiceform/dialog"
import { LayoutWallpaper } from "@choiceform/icons-react"
import type { StoryObj } from "@storybook/react-vite"
import React, { useEffect, useState } from "react"
import { toast as sonnerToast, Toaster } from "sonner"
import { notifications } from "../src/notifications"

const meta = {
  title: "Status/Notifications",
  component: notifications,
  tags: ["new"],
}

export default meta
type Story = StoryObj<
  typeof meta & {
    args: {
      actions: {
        action: { label: string; onClick: () => void }
        dismiss: { label: string; onClick: () => void }
      }
      icon: React.ReactNode
      text: string
    }
  }
>

/**
 * `Notifications` is a versatile toast-style notification system for displaying temporary messages and alerts.
 *
 * Features:
 * - Non-intrusive toast-style notifications
 * - Customizable duration and placement
 * - Support for icons to enhance visual context
 * - Action buttons for user interaction
 * - Dismiss functionality for user control
 * - Automatic dismissal after timeout
 * - Built on Sonner toast library for reliability
 *
 * Usage Guidelines:
 * - Use for non-critical feedback and updates
 * - Keep messages concise and actionable
 * - Include icons to provide visual context
 * - Add action buttons for common responses
 * - Always provide a way to dismiss notifications
 * - Consider duration based on message importance
 *
 * Accessibility:
 * - Notifications are announced to screen readers
 * - Focus management for interactive notifications
 * - Timeout periods consider reading time
 * - Proper contrast for all notification variants
 * - Keyboard accessible actions and dismiss controls
 */

/**
 * Basic: Demonstrates the Notifications component with various configurations.
 *
 * Features:
 * - Simple notification with icon and text
 * - Notification with a single action button
 * - Notification with both action and dismiss buttons
 * - Integration with Dialog component for action follow-up
 *
 * This example showcases three common notification patterns:
 * 1. Basic informational notification
 * 2. Notification with a primary action
 * 3. Notification with both primary and dismiss actions
 *
 * The notifications appear in the bottom-right corner of the screen
 * and automatically dismiss after a timeout period, or when the user
 * takes an action.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [open, setOpen] = useState(false)
    return (
      <div className="flex gap-4">
        <Toaster />

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <Dialog.Header title="Lorem ipsum dolor sit amet" />
          <Dialog.Content className="w-96 p-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </Dialog.Content>
        </Dialog>

        <Button
          variant="secondary"
          onClick={() => {
            notifications({
              icon: <LayoutWallpaper />,
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            })
          }}
        >
          Basic Notification
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            notifications({
              html: "Lorem ipsum dolor sit amet, <strong class='text-red-500'>consectetur adipiscing elit</strong>. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            })
          }}
        >
          HTML Notification
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            notifications({
              icon: <LayoutWallpaper />,
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              actions: (id) => ({
                action: {
                  content: "Reply",
                  onClick: () => {
                    setOpen(true)
                    sonnerToast.dismiss(id)
                  },
                },
              }),
            })
          }}
        >
          Notification with actions
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            notifications({
              icon: <LayoutWallpaper />,
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              actions: (id) => ({
                action: {
                  content: "Reply",
                  onClick: () => {
                    setOpen(true)
                    sonnerToast.dismiss(id)
                  },
                },
                dismiss: {
                  content: "Dismiss",
                  onClick: () => {
                    sonnerToast.dismiss(id)
                  },
                },
              }),
            })
          }}
        >
          Notification with actions and dismiss
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            notifications({
              icon: "🎉",
              html: "Duplicated project <b>Original Project</b> to <b>New Project Copy</b>",
              actions: (id) => ({
                action: {
                  content: "View Project",
                  onClick: () => {
                    setOpen(true)
                    sonnerToast.dismiss(id)
                  },
                },
                dismiss: {
                  content: "Dismiss",
                  onClick: () => {
                    sonnerToast.dismiss(id)
                  },
                },
              }),
            })
          }}
        >
          Notification with HTML content
        </Button>
      </div>
    )
  },
}

/**
 * Multiple Toasters: Demonstrates using multiple Toaster instances with different IDs and positions.
 * - Shows how to configure multiple Toasters for different use cases
 * - Demonstrates targeting specific Toasters using toasterId
 * - Useful for scenarios where you need separate notification areas (e.g., page-level vs component-level)
 * - Each Toaster can have different positions, styles, and configurations
 */
export const MultipleToasters: Story = {
  render: function MultipleToastersStory() {
    return (
      <div className="flex flex-col gap-4">
        <Toaster id="notifications-main" />
        <Toaster
          id="notifications-secondary"
          offset={{ bottom: "128px" }}
        />
        <Toaster
          id="notifications-sidebar"
          offset={{ right: "128px" }}
        />

        <div className="flex flex-col gap-2">
          <h3 className="text-body-large-strong">Main Toaster</h3>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                notifications({
                  toasterId: "notifications-main",
                  icon: <LayoutWallpaper />,
                  text: "This notification appears in the main toaster at bottom-right.",
                })
              }}
            >
              Main Toaster
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                notifications({
                  toasterId: "notifications-main",
                  icon: "✅",
                  text: "Success notification in main toaster",
                  actions: (id) => ({
                    action: {
                      content: "View",
                      onClick: () => {
                        sonnerToast.dismiss(id)
                      },
                    },
                  }),
                })
              }}
            >
              With Action
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-body-large-strong">Secondary Toaster</h3>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                notifications({
                  toasterId: "notifications-secondary",
                  icon: <LayoutWallpaper />,
                  text: "This notification appears in the secondary toaster at top-right.",
                })
              }}
            >
              Secondary Toaster
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                notifications({
                  toasterId: "notifications-secondary",
                  html: "HTML content in <strong>secondary</strong> toaster",
                  actions: (id) => ({
                    dismiss: {
                      content: "Dismiss",
                      onClick: () => {
                        sonnerToast.dismiss(id)
                      },
                    },
                  }),
                })
              }}
            >
              With Dismiss
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-body-large-strong">Sidebar Toaster</h3>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                notifications({
                  toasterId: "notifications-sidebar",
                  icon: "📢",
                  text: "Sidebar notification for component-specific messages.",
                })
              }}
            >
              Sidebar Toaster
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                notifications({
                  toasterId: "notifications-sidebar",
                  icon: <LayoutWallpaper />,
                  text: "Notification with both action and dismiss buttons",
                  actions: (id) => ({
                    action: {
                      content: "Action",
                      onClick: () => {
                        sonnerToast.dismiss(id)
                      },
                    },
                    dismiss: {
                      content: "Dismiss",
                      onClick: () => {
                        sonnerToast.dismiss(id)
                      },
                    },
                  }),
                })
              }}
            >
              Full Actions
            </Button>
          </div>
        </div>

        <div className="text-secondary-foreground text-body-small">
          <p className="font-strong">Usage:</p>
          <p>
            Multiple Toasters allow you to separate notifications by context or priority. Each
            Toaster can have its own position, offset, and configuration. Use the{" "}
            <code>toasterId</code> prop to target a specific Toaster when calling{" "}
            <code>notifications()</code>.
          </p>
        </div>
      </div>
    )
  },
}

/**
 * UseEffect: Demonstrates using notifications within useEffect for programmatic triggers.
 * - Tests notifications triggered by component state changes
 * - Shows proper action handling and state management in effects
 * - Validates cleanup and state synchronization
 * - Useful for testing real-world scenarios where notifications are triggered programmatically
 */
export const UseEffect: Story = {
  render: function UseEffectStory() {
    const [isMonitoring, setIsMonitoring] = useState(false)
    const [hasNotification, setHasNotification] = useState(false)
    const [notificationId, setNotificationId] = useState<string | number | null>(null)
    const [actionCount, setActionCount] = useState(0)

    // 模拟监控条件的 effect
    useEffect(() => {
      if (!isMonitoring) return

      const timer = setTimeout(() => {
        if (!hasNotification) {
          const id = notifications({
            icon: <LayoutWallpaper />,
            text: "System detected an issue. Please take action or dismiss this notification.",
            actions: (toastId) => ({
              action: {
                content: `Fix Issue (${actionCount})`,
                onClick: () => {
                  setActionCount((prev) => prev + 1)
                  setIsMonitoring(false)
                  setHasNotification(false)
                  sonnerToast.dismiss(toastId)
                },
              },
              dismiss: {
                content: "Ignore",
                onClick: () => {
                  setHasNotification(false)
                  sonnerToast.dismiss(toastId)
                },
              },
            }),
          })

          setNotificationId(id)
          setHasNotification(true)
        }
      }, 1500)

      return () => clearTimeout(timer)
    }, [isMonitoring, hasNotification, actionCount])

    // 清理 effect
    useEffect(() => {
      return () => {
        if (notificationId) {
          sonnerToast.dismiss(notificationId)
        }
      }
    }, [notificationId])

    return (
      <div className="flex flex-col gap-4">
        <Toaster />

        <div className="flex gap-2">
          <Button
            variant={isMonitoring ? "primary" : "secondary"}
            onClick={() => {
              setIsMonitoring(!isMonitoring)
              if (isMonitoring && notificationId) {
                sonnerToast.dismiss(notificationId)
                setHasNotification(false)
              }
            }}
          >
            {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setActionCount(0)
              setHasNotification(false)
              if (notificationId) {
                sonnerToast.dismiss(notificationId)
              }
            }}
          >
            Reset State
          </Button>
        </div>

        <div className="text-secondary-foreground text-body-small">
          <p>Monitoring: {isMonitoring ? "Active" : "Inactive"}</p>
          <p>Notification: {hasNotification ? "Visible" : "Hidden"}</p>
          <p>Action count: {actionCount}</p>
          <p className="mt-2">
            Click &quot;Start Monitoring&quot; to automatically trigger a notification after 1.5
            seconds.
            <br />
            Click the &quot;Fix Issue&quot; button in the notification to test state updates and
            closure handling.
          </p>
        </div>
      </div>
    )
  },
}
