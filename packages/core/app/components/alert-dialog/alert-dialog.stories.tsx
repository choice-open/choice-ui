import { Story } from "@storybook/addon-docs/blocks"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { Button } from "../button"
import { AlertDialogProvider, useAlertDialog } from "./index"

const meta: Meta = {
  title: "Overlays/Alert Dialog",
  component: AlertDialogProvider,
  tags: ["new", "autodocs"],
}

export default meta

type Story = StoryObj

/**
 * `AlertDialog` is a global dialog system for displaying alerts, confirmations, and custom dialogs.
 *
 * Features:
 * - Global access via hooks - no need to manage dialog state
 * - Promise-based API with async/await support
 * - Queue system for multiple dialogs
 * - Built-in confirm, alert, and custom dialog types
 * - Keyboard navigation (ESC to close, Enter to confirm)
 * - Accessible with proper ARIA attributes
 * - Customizable styling and buttons
 * - TypeScript support with strict typing
 *
 * Usage Guidelines:
 * - Use for critical actions that require user confirmation
 * - Keep dialog content concise and actionable
 * - Use appropriate button variants for different actions
 * - Consider using keyboard shortcuts for common actions
 *
 * Accessibility:
 * - Manages focus properly when opened and closed
 * - Traps focus within the dialog when open
 * - Supports keyboard navigation and dismissal
 * - Provides appropriate ARIA roles and attributes
 * - Ensures adequate contrast for all elements
 */

/**
 * Basic Confirm: Demonstrates the basic confirm dialog functionality.
 * This shows the most common use case - a simple confirmation dialog
 * that returns a boolean result based on user choice.
 */
export const BasicConfirm: Story = {
  render: function BasicConfirmStory() {
    const ConfirmExample = () => {
      const { confirm } = useAlertDialog()
      const [result, setResult] = useState<boolean | null>(null)

      const handleClick = async () => {
        const confirmed = await confirm("Are you sure you want to delete this item?")
        setResult(confirmed)
      }

      return (
        <div className="flex flex-col gap-4">
          <Button
            variant="secondary"
            onClick={handleClick}
          >
            Show Confirm Dialog
          </Button>
          {result !== null && (
            <p className="text-secondary-foreground text-body-small">
              Result: {result ? "Confirmed" : "Cancelled"}
            </p>
          )}
        </div>
      )
    }

    return (
      <AlertDialogProvider>
        <ConfirmExample />
      </AlertDialogProvider>
    )
  },
}

/**
 * Size: Demonstrates the different sizes of the alert dialog.
 */
export const Size: Story = {
  render: function SizeStory() {
    const ConfirmExample = () => {
      const { confirm } = useAlertDialog()
      const [result, setResult] = useState<boolean | null>(null)

      const handleSmall = async () => {
        const confirmed = await confirm({
          title: "Small Alert",
          description:
            "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
          size: "small",
        })
        setResult(confirmed)
      }

      const handleDefault = async () => {
        const confirmed = await confirm({
          title: "Default Alert",
          description:
            "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
        })
        setResult(confirmed)
      }

      const handleLarge = async () => {
        const confirmed = await confirm({
          title: "Large Alert",
          description:
            "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
          size: "large",
        })
        setResult(confirmed)
      }

      return (
        <div className="flex flex-col gap-4">
          {result !== null && (
            <p className="text-secondary-foreground">
              Result: {result ? "Confirmed" : "Cancelled"}
            </p>
          )}
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={handleSmall}
            >
              Small
            </Button>
            <Button
              variant="secondary"
              onClick={handleDefault}
            >
              Default
            </Button>
            <Button
              variant="secondary"
              onClick={handleLarge}
            >
              Large
            </Button>
          </div>
        </div>
      )
    }

    return (
      <AlertDialogProvider>
        <ConfirmExample />
      </AlertDialogProvider>
    )
  },
}

/**
 * Custom Confirm: Demonstrates a customized confirm dialog with custom text and button variants.
 * Shows how to configure the dialog with specific titles, descriptions, and button styling.
 */
export const CustomConfirm: Story = {
  render: function CustomConfirmStory() {
    const ConfirmExample = () => {
      const { confirm } = useAlertDialog()
      const [result, setResult] = useState<boolean | null>(null)

      const handleClick = async () => {
        const confirmed = await confirm({
          title: "Delete Account",
          description:
            "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
          confirmText: "Delete Account",
          cancelText: "Cancel",
          confirmVariant: "destructive",
          cancelVariant: "secondary",
          variant: "danger",
        })
        setResult(confirmed)
      }

      return (
        <div className="flex flex-col gap-4">
          <Button
            variant="secondary-destruct"
            onClick={handleClick}
          >
            Delete Account
          </Button>

          {result !== null && (
            <p className="text-secondary-foreground text-body-small">
              Result: {result ? "Account deleted" : "Cancelled"}
            </p>
          )}
        </div>
      )
    }

    return (
      <AlertDialogProvider>
        <ConfirmExample />
      </AlertDialogProvider>
    )
  },
}

/**
 * Basic Alert: Demonstrates the basic alert dialog functionality.
 * Used for informational messages that only require acknowledgment.
 */
export const BasicAlert: Story = {
  render: function BasicAlertStory() {
    const AlertExample = () => {
      const { alert } = useAlertDialog()
      const [shown, setShown] = useState(false)

      const handleClick = async () => {
        await alert("Your changes have been saved successfully!")
        setShown(true)
      }

      return (
        <div className="flex flex-col gap-4">
          <Button onClick={handleClick}>Save Changes</Button>
          {shown && (
            <p className="text-secondary-foreground text-body-small">Alert was acknowledged</p>
          )}
        </div>
      )
    }

    return (
      <AlertDialogProvider>
        <AlertExample />
      </AlertDialogProvider>
    )
  },
}

/**
 * Custom Alert: Demonstrates a customized alert dialog with title and custom styling.
 * Shows how to enhance the alert with additional information and branding.
 */
export const CustomAlert: Story = {
  render: function CustomAlertStory() {
    const AlertExample = () => {
      const { alert } = useAlertDialog()
      const [shown, setShown] = useState(false)

      const handleClick = async () => {
        await alert({
          title: "Success",
          description:
            "Your profile has been updated successfully. Changes may take a few minutes to appear across all platforms.",
          confirmText: "Got it",
          confirmVariant: "primary",
        })
        setShown(true)
      }

      return (
        <div className="flex flex-col gap-4">
          <Button onClick={handleClick}>Update Profile</Button>
          {shown && (
            <p className="text-secondary-foreground text-body-small">Alert was acknowledged</p>
          )}
        </div>
      )
    }

    return (
      <AlertDialogProvider>
        <AlertExample />
      </AlertDialogProvider>
    )
  },
}

/**
 * Custom Dialog: Demonstrates the custom dialog functionality with multiple buttons.
 * Shows how to create dialogs with custom actions and handle different user choices.
 */
export const CustomDialog: Story = {
  render: function CustomDialogStory() {
    const CustomExample = () => {
      const { show, confirm } = useAlertDialog()
      const [result, setResult] = useState<string | null>(null)

      const handleClick = async () => {
        const choice = await show({
          title: "Save Document",
          description: "You have unsaved changes. What would you like to do?",
          buttons: [
            { text: "Don't Save", value: "discard", variant: "ghost" },
            { text: "Cancel", value: "cancel", variant: "secondary" },
            { text: "Save", value: "save", variant: "primary", autoFocus: true },
          ],
        })
        setResult(choice)
        if (choice === "discard") {
          await confirm({
            title: "Discard Document",
            description: "Are you sure you want to discard these changes?",
          })
        }
      }

      return (
        <div className="flex flex-col gap-4">
          <Button onClick={handleClick}>Close Document</Button>
          {result && (
            <p className="text-secondary-foreground text-body-small">User choice: {result}</p>
          )}
        </div>
      )
    }

    return (
      <AlertDialogProvider>
        <CustomExample />
      </AlertDialogProvider>
    )
  },
}

/**
 * Queue System: Demonstrates the dialog queue system with multiple dialogs.
 * Shows how dialogs are automatically queued and displayed in sequence.
 */
export const QueueSystem: Story = {
  render: function QueueSystemStory() {
    const QueueExample = () => {
      const { confirm, alert } = useAlertDialog()
      const [results, setResults] = useState<string[]>([])

      const handleMultipleDialogs = async () => {
        setResults([])

        // These will be queued automatically
        const promises = [
          confirm("Delete first item?"),
          alert("Processing..."),
          confirm("Delete second item?"),
          alert("All done!"),
        ]

        const results = await Promise.all(promises)
        setResults(results.map((r, i) => `Dialog ${i + 1}: ${r}`))
      }

      return (
        <div className="flex flex-col gap-4">
          <Button onClick={handleMultipleDialogs}>Show Multiple Dialogs</Button>
          {results.length > 0 && (
            <div className="text-secondary-foreground text-body-small">
              <p>Results:</p>
              <ul className="list-inside list-disc">
                {results.map((result, i) => (
                  <li key={i}>{result}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    }

    return (
      <AlertDialogProvider>
        <QueueExample />
      </AlertDialogProvider>
    )
  },
}

/**
 * With Content: Demonstrates using custom React content in dialogs.
 * Shows how to render complex content beyond simple text descriptions.
 */
export const WithContent: Story = {
  render: function WithContentStory() {
    const ContentExample = () => {
      const { show } = useAlertDialog()
      const [result, setResult] = useState<string | null>(null)

      const handleClick = async () => {
        const choice = await show({
          title: "Upgrade Plan",
          content: (
            <div className="space-y-3">
              <p>You&apos;ve reached the limit of your current plan.</p>
              <div className="bg-secondary-background rounded p-3">
                <h4 className="font-strong">Pro Plan Benefits:</h4>
                <ul className="text-body-small mt-1 space-y-1">
                  <li>• Unlimited projects</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                </ul>
              </div>
              <p className="text-secondary-foreground text-body-small">
                Only $9.99/month, cancel anytime.
              </p>
            </div>
          ),
          buttons: [
            { text: "Maybe Later", value: "later", variant: "ghost" },
            { text: "Upgrade Now", value: "upgrade", variant: "primary", autoFocus: true },
          ],
        })
        setResult(choice)
      }

      return (
        <div className="flex flex-col gap-4">
          <Button onClick={handleClick}>Check Limits</Button>
          {result && (
            <p className="text-secondary-foreground text-body-small">User choice: {result}</p>
          )}
        </div>
      )
    }

    return (
      <AlertDialogProvider>
        <ContentExample />
      </AlertDialogProvider>
    )
  },
}

/**
 * Variants: Demonstrates different visual variants for alert dialogs.
 * Shows how variant styles change the appearance of the dialog.
 */
export const Variants: Story = {
  render: function VariantsStory() {
    const VariantsExample = () => {
      const { confirm, alert } = useAlertDialog()
      const [results, setResults] = useState<Record<string, boolean | void>>({})

      const showDangerConfirm = async () => {
        const result = await confirm({
          title: "Danger Action",
          description: "This is a dangerous action that requires careful consideration.",
          variant: "danger",
          confirmVariant: "destructive",
        })
        setResults((prev) => ({ ...prev, danger: result }))
      }

      const showSuccessAlert = async () => {
        await alert({
          title: "Success",
          description: "Operation completed successfully!",
          variant: "success",
          confirmText: "Great!",
        })
        setResults((prev) => ({ ...prev, success: undefined }))
      }

      const showWarningConfirm = async () => {
        const result = await confirm({
          title: "Warning",
          description: "This action may have unexpected consequences. Continue?",
          variant: "warning",
          confirmText: "Proceed",
          confirmVariant: "primary",
        })
        setResults((prev) => ({ ...prev, warning: result }))
      }

      const showDefaultConfirm = async () => {
        const result = await confirm({
          title: "Default Dialog",
          description: "This is a standard confirmation dialog.",
          variant: "default",
          confirmText: "Confirm",
          cancelText: "Cancel",
        })
        setResults((prev) => ({ ...prev, default: result }))
      }

      return (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={showDefaultConfirm}
              variant="secondary"
            >
              Default Variant
            </Button>
            <Button
              onClick={showDangerConfirm}
              variant="destructive"
            >
              Danger Variant
            </Button>
            <Button
              onClick={showSuccessAlert}
              variant="success"
            >
              Success Variant
            </Button>
            <Button
              onClick={showWarningConfirm}
              variant="secondary"
            >
              Warning Variant
            </Button>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="text-secondary-foreground text-body-small">
              <p>Results:</p>
              <ul className="list-inside list-disc">
                {Object.entries(results).map(([variant, result]) => (
                  <li key={variant}>
                    {variant}:{" "}
                    {typeof result === "boolean"
                      ? result
                        ? "Confirmed"
                        : "Cancelled"
                      : "Acknowledged"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    }

    return (
      <AlertDialogProvider>
        <VariantsExample />
      </AlertDialogProvider>
    )
  },
}

/**
 * With Overlay: Demonstrates the overlay functionality.
 * Shows how to enable the background overlay for better visual separation.
 */
export const WithOverlay: Story = {
  render: function WithOverlayStory() {
    const OverlayExample = () => {
      const { confirm } = useAlertDialog()
      const [result, setResult] = useState<boolean | null>(null)

      const handleClick = async () => {
        const confirmed = await confirm({
          title: "With Overlay",
          description: "This dialog has a dark background overlay for better focus.",
          confirmText: "Confirm",
          cancelText: "Cancel",
        })
        setResult(confirmed)
      }

      return (
        <div className="flex flex-col gap-4">
          <Button onClick={handleClick}>Show Dialog with Overlay</Button>
          {result !== null && (
            <p className="text-secondary-foreground text-body-small">
              Result: {result ? "Confirmed" : "Cancelled"}
            </p>
          )}
        </div>
      )
    }

    return (
      <AlertDialogProvider overlay={true}>
        <OverlayExample />
      </AlertDialogProvider>
    )
  },
}

/**
 * Outside Press Enabled: Demonstrates enabling outside press functionality.
 * Shows how to enable clicking outside the dialog to close it.
 */
export const OutsidePressEnabled: Story = {
  render: function OutsidePressEnabledStory() {
    const OutsidePressExample = () => {
      const { confirm } = useAlertDialog()
      const [result, setResult] = useState<boolean | null>(null)

      const handleClick = async () => {
        const confirmed = await confirm({
          title: "Outside Press Enabled",
          description:
            "You can click outside this dialog to close it. Try clicking on the background!",
          confirmText: "Confirm",
          cancelText: "Cancel",
        })
        setResult(confirmed)
      }

      return (
        <div className="flex flex-col gap-4">
          <Button onClick={handleClick}>Show Dialog with Outside Press Enabled</Button>
          <p className="text-secondary-foreground text-body-small">
            💡 Tip: Click outside the dialog to close it
          </p>
          {result !== null && (
            <p className="text-secondary-foreground text-body-small">
              Result: {result ? "Confirmed" : "Cancelled"}
            </p>
          )}
        </div>
      )
    }

    return (
      <AlertDialogProvider outsidePress={true}>
        <OutsidePressExample />
      </AlertDialogProvider>
    )
  },
}

/**
 * Outside Press Disabled: Demonstrates disabling outside press functionality.
 * Shows that clicking outside the dialog will NOT close it.
 */
export const OutsidePressDisabled: Story = {
  render: function OutsidePressDisabledStory() {
    const OutsidePressExample = () => {
      const { confirm } = useAlertDialog()
      const [result, setResult] = useState<boolean | null>(null)

      const handleClick = async () => {
        const confirmed = await confirm({
          title: "Outside Press Disabled",
          description:
            "Clicking outside this dialog will NOT close it. You must use the buttons or ESC key.",
          confirmText: "Confirm",
          cancelText: "Cancel",
        })
        setResult(confirmed)
      }

      return (
        <div className="flex flex-col gap-4">
          <Button onClick={handleClick}>Show Dialog with Outside Press Disabled</Button>
          <p className="text-secondary-foreground text-body-small">
            💡 Tip: Clicking outside will NOT close the dialog
          </p>
          {result !== null && (
            <p className="text-secondary-foreground text-body-small">
              Result: {result ? "Confirmed" : "Cancelled"}
            </p>
          )}
        </div>
      )
    }

    return (
      <AlertDialogProvider outsidePress={false}>
        <OutsidePressExample />
      </AlertDialogProvider>
    )
  },
}

/**
 * Full Featured: Demonstrates both overlay and outside press together.
 * Shows the complete dialog experience with all features enabled.
 */
export const FullFeatured: Story = {
  render: function FullFeaturedStory() {
    const FullFeaturedExample = () => {
      const { confirm, alert } = useAlertDialog()
      const [results, setResults] = useState<Record<string, boolean | void>>({})

      const showDangerDialog = async () => {
        const result = await confirm({
          title: "Delete Account",
          description:
            "This action cannot be undone. Are you sure you want to delete your account?",
          variant: "danger",
          confirmText: "Delete",
          confirmVariant: "destructive",
          cancelText: "Keep Account",
        })
        setResults((prev) => ({ ...prev, danger: result }))
      }

      const showSuccessDialog = async () => {
        await alert({
          title: "Success!",
          description: "Your account has been created successfully. Welcome aboard!",
          variant: "success",
          confirmText: "Get Started",
        })
        setResults((prev) => ({ ...prev, success: undefined }))
      }

      return (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Button
              onClick={showDangerDialog}
              variant="destructive"
            >
              Delete Account
            </Button>
            <Button
              onClick={showSuccessDialog}
              variant="success"
            >
              Create Account
            </Button>
          </div>

          <div className="text-secondary-foreground text-body-small space-y-1">
            <p>💡 Features enabled:</p>
            <ul className="ml-4 list-inside list-disc">
              <li>Dark background overlay</li>
              <li>Click outside to close</li>
              <li>ESC key to close</li>
              <li>Variant styling</li>
            </ul>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="text-secondary-foreground text-body-small">
              <p>Results:</p>
              <ul className="list-inside list-disc">
                {Object.entries(results).map(([variant, result]) => (
                  <li key={variant}>
                    {variant}:{" "}
                    {typeof result === "boolean"
                      ? result
                        ? "Confirmed"
                        : "Cancelled"
                      : "Acknowledged"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    }

    return (
      <AlertDialogProvider
        overlay={true}
        outsidePress={true}
      >
        <FullFeaturedExample />
      </AlertDialogProvider>
    )
  },
}

/**
 * EventPropagation: Verifies that ESC key events do not propagate to window.
 * Press ESC outside alert dialog to increment counter, then press ESC inside
 * alert dialog to close it without incrementing the counter.
 */
export const EventPropagation: Story = {
  render: function EventPropagationStory() {
    const EventPropagationExample = () => {
      const { alert } = useAlertDialog()
      const [escCount, setEscCount] = React.useState(0)

      React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            setEscCount((prev) => prev + 1)
          }
        }

        window.addEventListener("keydown", handleEscape)
        return () => window.removeEventListener("keydown", handleEscape)
      }, [])

      const showAlert = async () => {
        await alert({
          title: "ESC Event Test",
          description: "Press ESC to close. The window counter should not increment.",
        })
      }

      return (
        <div className="flex flex-col gap-4">
          <p>
            Window ESC count: <strong>{escCount}</strong>
          </p>
          <p className="text-secondary-foreground text-body-small">
            Press ESC to increment. Open alert and press ESC - counter should NOT change.
          </p>
          <Button onClick={showAlert}>Open Alert</Button>
        </div>
      )
    }

    return (
      <AlertDialogProvider>
        <EventPropagationExample />
      </AlertDialogProvider>
    )
  },
}
