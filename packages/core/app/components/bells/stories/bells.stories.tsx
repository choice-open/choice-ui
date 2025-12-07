import { Button } from "@choiceform/button"
import { Chip } from "@choiceform/chip"
import { tcx } from "@choiceform/design-shared"
import { LayoutWallpaper } from "@choiceform/icons-react"
import type { StoryObj } from "@storybook/react-vite"
import React, { useEffect, useState } from "react"
import { toast as sonnerToast, Toaster } from "sonner"
import { bells } from "../src/bells"

const meta = {
  title: "Status/Bells",
  component: bells,
  tags: ["new"],
}

export default meta
type Story = StoryObj<
  typeof meta & {
    args: {
      actions: (id: string | number) => {
        action?: { label: string; onClick: () => void }
        dismiss?: { label: string; onClick: () => void }
      }
      icon: React.ReactNode
      text: string
    }
  }
>

/**
 * Bells (toasts/notifications) are used to provide timely feedback or status updates to users.
 *
 * Features:
 * - Supports rich content: text, icons, actions, and progress indicators.
 * - Multiple variants for semantic meaning: default, accent, danger, success, warning, assistive.
 * - Customizable with close buttons and multiple actions (e.g., dismiss, custom callbacks).
 * - Integrates with Sonner for toast management and positioning.
 *
 * Usage:
 * - Use bells to notify users of important events, confirmations, errors, or status changes.
 * - Combine with icons and actions for interactive notifications.
 * - Place the <Toaster /> component once in your app, typically near the root.
 *
 * Best Practices:
 * - Keep notification messages concise and actionable.
 * - Use semantic variants to match the type of feedback (e.g., success for completed actions, danger for errors).
 * - Avoid overwhelming users with too many notifications at once.
 * - Provide clear actions when user intervention is required.
 *
 * Accessibility:
 * - Ensure notifications are accessible to screen readers.
 * - Use sufficient color contrast for text and backgrounds.
 * - Provide accessible labels for interactive elements within notifications.
 */

/**
 * Basic: Demonstrates the Bells component with various configurations.
 * - Shows simple text notifications, notifications with icons, close buttons, actions, and progress indicators.
 * - Useful for understanding how to trigger different types of bells and combine features.
 * - Each button triggers a different bell configuration for demonstration purposes.
 */
export const Basic: Story = {
  render: function BasicStory() {
    return (
      <div className="flex gap-2 capitalize">
        <Toaster />

        <Button
          variant="secondary"
          onClick={() => {
            bells({
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            })
          }}
        >
          Render bell
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            bells({
              toastOptions: {
                toasterId: "bells-toaster",
              },
              html: "Successfully <b class='text-red-500'>duplicated</b> project to <em class='text-blue-500'>My New Project</em>! 🎉",
              icon: <LayoutWallpaper />,
            })
          }}
        >
          Bell with HTML
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            bells({
              icon: <LayoutWallpaper />,
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            })
          }}
        >
          With icon
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            bells({
              icon: <LayoutWallpaper />,
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              onClose: (id) => {
                sonnerToast.dismiss(id)
              },
            })
          }}
        >
          With close button
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            bells({
              icon: <LayoutWallpaper />,
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              onClose: (id) => {
                sonnerToast.dismiss(id)
              },
              action: (id) => (
                <Chip
                  size="medium"
                  className="border-menu-boundary flex-none bg-transparent hover:bg-white/5"
                  onClick={() => {
                    sonnerToast.dismiss(id)
                  }}
                >
                  Action
                </Chip>
              ),
            })
          }}
        >
          With close button and action
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            bells({
              icon: <LayoutWallpaper />,
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              onClose: (id) => {
                sonnerToast.dismiss(id)
              },
              action: (id) => (
                <>
                  <Chip
                    size="medium"
                    className="border-menu-boundary flex-none bg-transparent hover:bg-white/5"
                    onClick={() => {
                      sonnerToast.dismiss(id)
                    }}
                  >
                    Action
                  </Chip>
                  <Chip
                    size="medium"
                    className="border-menu-boundary flex-none bg-transparent hover:bg-white/5"
                    onClick={() => {
                      sonnerToast.dismiss(id)
                    }}
                  >
                    Dismiss
                  </Chip>
                </>
              ),
              progress: true,
            })
          }}
        >
          With progress
        </Button>
      </div>
    )
  },
}

/**
 * UseEffect: Demonstrates using bells within useEffect, similar to real-world scenarios.
 * - Simulates triggering bells based on component state or external conditions
 * - Tests action callbacks and state management within effects
 * - Shows proper cleanup and state synchronization
 * - Useful for testing the scenario where bells are triggered programmatically
 */
export const UseEffect: Story = {
  render: function UseEffectStory() {
    const [isVisible, setIsVisible] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const [notificationId, setNotificationId] = useState<string | number | null>(null)
    const [actionCount, setActionCount] = useState(0)

    // 模拟检测某种条件的 effect
    useEffect(() => {
      if (!isVisible) return

      const interval = setInterval(() => {
        // 模拟检测到需要显示通知的条件
        if (!showNotification) {
          const bellId = bells({
            variant: "accent",
            icon: <LayoutWallpaper />,
            html: "Detect content out of viewport, click button back to content",
            action: (id) => (
              <Chip
                size="medium"
                className="border-menu-boundary flex-none bg-transparent hover:bg-white/5"
                onClick={() => {
                  // 测试闭包中的状态更新
                  setActionCount((prev) => prev + 1)
                  setIsVisible(false)
                  sonnerToast.dismiss(id)
                }}
              >
                Back to content ({actionCount})
              </Chip>
            ),
            duration: Infinity,
            onClose: (id) => {
              setShowNotification(false)
              setNotificationId(null)
            },
          })

          setNotificationId(bellId)
          setShowNotification(true)
        }
      }, 2000)

      return () => clearInterval(interval)
    }, [isVisible, showNotification, actionCount])

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
            variant={isVisible ? "primary" : "secondary"}
            onClick={() => {
              setIsVisible(!isVisible)
              if (isVisible && notificationId) {
                sonnerToast.dismiss(notificationId)
                setShowNotification(false)
              }
            }}
          >
            {isVisible ? "Stop detecting" : "Start detecting"}
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setActionCount(0)
              setShowNotification(false)
              if (notificationId) {
                sonnerToast.dismiss(notificationId)
              }
            }}
          >
            Reset
          </Button>
        </div>

        <div className="text-secondary-foreground text-body-small">
          <p>Status: {isVisible ? "Detecting" : "Not detecting"}</p>
          <p>Notification: {showNotification ? "Yes" : "No"}</p>
          <p>Action count: {actionCount}</p>
          <p className="mt-2">
            Click &quot;Start detecting&quot; to automatically display a notification within 2
            seconds.
            <br />
            Click the &quot;Back to content&quot; button in the notification to test state updates
            and closure issues.
          </p>
        </div>
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
        <Toaster id="bells-main" />
        <Toaster
          id="bells-secondary"
          offset={{ bottom: "128px" }}
        />

        <div className="flex flex-col gap-2">
          <h3 className="text-body-large-strong">Main Toaster</h3>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                bells({
                  toasterId: "bells-main",
                  text: "This bell appears in the main toaster at bottom-center.",
                })
              }}
            >
              Main Toaster
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                bells({
                  toasterId: "bells-main",
                  icon: <LayoutWallpaper />,
                  text: "Bell with icon and close button",
                  onClose: (id) => {
                    sonnerToast.dismiss(id)
                  },
                })
              }}
            >
              With Close
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                bells({
                  toasterId: "bells-main",
                  variant: "success",
                  icon: "✅",
                  text: "Success bell in main toaster",
                  progress: true,
                })
              }}
            >
              With Progress
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-body-large-strong">Secondary Toaster</h3>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                bells({
                  toasterId: "bells-secondary",
                  icon: <LayoutWallpaper />,
                  text: "This bell appears in the secondary toaster at top-center.",
                })
              }}
            >
              Secondary Toaster
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                bells({
                  toasterId: "bells-secondary",
                  variant: "danger",
                  icon: "⚠️",
                  html: "Danger bell with <strong>HTML</strong> content",
                  onClose: (id) => {
                    sonnerToast.dismiss(id)
                  },
                })
              }}
            >
              Danger Variant
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                bells({
                  toasterId: "bells-secondary",
                  variant: "accent",
                  icon: <LayoutWallpaper />,
                  text: "Bell with action button",
                  action: (id) => (
                    <Chip
                      size="medium"
                      className="border-menu-boundary flex-none bg-transparent hover:bg-white/5"
                      onClick={() => {
                        sonnerToast.dismiss(id)
                      }}
                    >
                      Action
                    </Chip>
                  ),
                })
              }}
            >
              With Action
            </Button>
          </div>
        </div>

        <div className="text-secondary-foreground text-body-small">
          <p className="font-strong">Usage:</p>
          <p>
            Multiple Toasters allow you to separate bells by context or priority. Each Toaster can
            have its own position, offset, and configuration. Use the <code>toasterId</code> prop to
            target a specific Toaster when calling <code>bells()</code>.
          </p>
        </div>
      </div>
    )
  },
}

/**
 * Color: Demonstrates the different color variants for the Bells component.
 * - Shows how to use semantic variants: accent, danger, success, warning, assistive.
 * - Each button triggers a bell with a different color and an associated action.
 * - Useful for providing feedback that matches the context of the notification (e.g., error, success).
 */
export const Color: Story = {
  render: function ColorStory() {
    const colors = [
      {
        color: "accent",
        className: "bg-accent-background",
      },
      {
        color: "danger",
        className: "bg-danger-background",
      },
      {
        color: "success",
        className: "bg-success-background",
      },
      {
        color: "warning",
        className: "bg-warning-background text-gray-900",
      },
      {
        color: "assistive",
        className: "bg-assistive-background",
      },
    ]

    return (
      <div className="flex gap-2 capitalize">
        <Toaster />
        {colors.map((color) => (
          <Button
            key={color.color}
            variant="secondary"
            onClick={() => {
              bells({
                variant: color.color as
                  | "default"
                  | "accent"
                  | "success"
                  | "warning"
                  | "danger"
                  | "assistive",
                icon: <LayoutWallpaper />,
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                onClose: (id) => {
                  sonnerToast.dismiss(id)
                },
                action: (id) => (
                  <Chip
                    size="medium"
                    className={tcx(
                      "flex-none",
                      color.color === "default"
                        ? "border-menu-boundary bg-transparent hover:bg-white/5"
                        : "border-black/10 bg-black/40 shadow-sm hover:bg-black/50",
                    )}
                    onClick={() => {
                      sonnerToast.dismiss(id)
                    }}
                  >
                    {color.color}
                  </Chip>
                ),
                progress: true,
              })
            }}
          >
            {color.color} color
          </Button>
        ))}
      </div>
    )
  },
}
