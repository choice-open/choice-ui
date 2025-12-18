import { AlertDialogProvider, Button, Dialog, useAlertDialog } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

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
 * - Customizable styling and buttons
 *
 * API methods:
 * - `confirm(config)` - Confirmation dialog, returns `Promise<boolean>`
 * - `alert(config)` - Alert dialog, returns `Promise<void>`
 * - `show(config)` - Custom dialog, returns `Promise<string>` (button value)
 *
 * AlertDialogProvider is a global provider for AlertDialog. It should be wrapped around your app.
 * ```tsx
 * import { AlertDialogProvider } from "@choice-ui/alert-dialog"
 *
 * function App() {
 *   return (
 *     <AlertDialogProvider>
 *       <YourApp />
 *     </AlertDialogProvider>
 *   )
 * }
 * ```
 *
 * useAlertDialog is a hook that provides the AlertDialog context. It should be used within the AlertDialogProvider.
 * ```tsx
 * import { useAlertDialog } from "@choice-ui/alert-dialog"
 *
 * function YourComponent() {
 *   const { confirm, alert, show } = useAlertDialog()
 *
 *   const handleConfirm = async () => {
 *     const confirmed = await confirm({
 *       title: "Confirm Delete",
 *       description: "This action cannot be undone. Are you sure you want to delete this item?",
 *     })
 *   }
 * }
 * ```
 */

/**
 * Basic Usage: Demonstrates `confirm` and `alert` dialog types.
 * - `confirm` returns boolean for user confirmation actions
 * - `alert` returns void for informational messages
 */
export const Basic: Story = {
  render: function BasicStory() {
    const Example = () => {
      const { confirm, alert } = useAlertDialog()
      const [confirmResult, setConfirmResult] = useState<boolean | null>(null)
      const [alertShown, setAlertShown] = useState(false)

      const handleConfirm = async () => {
        const confirmed = await confirm({
          title: "Confirm Delete",
          description: "This action cannot be undone. Are you sure you want to delete this item?",
          confirmText: "Delete",
          cancelText: "Cancel",
          confirmVariant: "destructive",
        })
        setConfirmResult(confirmed)
      }

      const handleAlert = async () => {
        await alert({
          title: "Success",
          description: "Your changes have been saved successfully.",
          confirmText: "Got it",
        })
        setAlertShown(true)
      }

      return (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Button
              variant="destructive"
              onClick={handleConfirm}
            >
              Confirm Dialog
            </Button>
            <Button onClick={handleAlert}>Alert Dialog</Button>
          </div>
          <div className="text-secondary-foreground text-body-small">
            {confirmResult !== null && <p>Result: {confirmResult ? "Confirmed" : "Cancelled"}</p>}
            {alertShown && <p>Alert acknowledged</p>}
          </div>
        </div>
      )
    }

    return (
      <AlertDialogProvider>
        <Example />
      </AlertDialogProvider>
    )
  },
}

/**
 * Size: Demonstrates three dialog sizes - small, default, large
 */
export const Size: Story = {
  render: function SizeStory() {
    const Example = () => {
      const { confirm } = useAlertDialog()

      const description = "This action cannot be undone. Are you sure you want to continue?"

      const handleSize = async (size: "small" | "default" | "large") => {
        await confirm({
          title: `${size.charAt(0).toUpperCase() + size.slice(1)} Size`,
          description,
          size,
        })
      }

      return (
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => handleSize("small")}
          >
            Small
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleSize("default")}
          >
            Default
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleSize("large")}
          >
            Large
          </Button>
        </div>
      )
    }

    return (
      <AlertDialogProvider>
        <Example />
      </AlertDialogProvider>
    )
  },
}

/**
 * Variants: Demonstrates four visual variants - default, danger, success, warning
 */
export const Variants: Story = {
  render: function VariantsStory() {
    const Example = () => {
      const { confirm, alert } = useAlertDialog()

      const showDefault = () =>
        confirm({
          title: "Default Style",
          description: "This is a default confirmation dialog.",
          variant: "default",
        })

      const showDanger = () =>
        confirm({
          title: "Dangerous Action",
          description: "This action cannot be undone. Please proceed with caution.",
          variant: "danger",
          confirmVariant: "destructive",
        })

      const showSuccess = () =>
        alert({
          title: "Success",
          description: "Your operation has been completed successfully!",
          variant: "success",
          confirmText: "OK",
        })

      const showWarning = () =>
        confirm({
          title: "Warning",
          description: "This action may have unexpected consequences. Continue?",
          variant: "warning",
          confirmText: "Continue",
        })

      return (
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="secondary"
            onClick={showDefault}
          >
            Default
          </Button>
          <Button
            variant="destructive"
            onClick={showDanger}
          >
            Danger
          </Button>
          <Button
            variant="success"
            onClick={showSuccess}
          >
            Success
          </Button>
          <Button
            variant="secondary"
            onClick={showWarning}
          >
            Warning
          </Button>
        </div>
      )
    }

    return (
      <AlertDialogProvider>
        <Example />
      </AlertDialogProvider>
    )
  },
}

/**
 * Custom Dialog: Uses `show` method to create dialogs with multiple custom buttons.
 * Returns the clicked button's `value`.
 */
export const CustomDialog: Story = {
  render: function CustomDialogStory() {
    const Example = () => {
      const { show } = useAlertDialog()
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
        <Example />
      </AlertDialogProvider>
    )
  },
}

/**
 * With Content: Uses `content` prop to render complex React content.
 */
export const WithContent: Story = {
  render: function WithContentStory() {
    const Example = () => {
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
        <Example />
      </AlertDialogProvider>
    )
  },
}

/**
 * Queue System: Multiple dialogs are automatically queued and displayed in sequence.
 */
export const QueueSystem: Story = {
  render: function QueueSystemStory() {
    const Example = () => {
      const { confirm, alert } = useAlertDialog()
      const [results, setResults] = useState<string[]>([])

      const handleMultiple = async () => {
        setResults([])

        const promises = [
          confirm("Delete first item?"),
          alert("Processing..."),
          confirm("Delete second item?"),
          alert("All done!"),
        ]

        const allResults = await Promise.all(promises)
        setResults(allResults.map((r, i) => `Dialog ${i + 1}: ${r}`))
      }

      return (
        <div className="flex flex-col gap-4">
          <Button onClick={handleMultiple}>Show Multiple Dialogs</Button>
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
        <Example />
      </AlertDialogProvider>
    )
  },
}

/**
 * Provider Options: Demonstrates provider-level configurations.
 * - `overlay`: Shows dark background overlay (default: false)
 * - `outsidePress`: Allows clicking outside to close (default: true, this demo shows disabled)
 */
export const ProviderOptions: Story = {
  render: function ProviderOptionsStory() {
    const ExampleWithOverlay = () => {
      const { confirm } = useAlertDialog()

      return (
        <Button
          variant="secondary"
          onClick={() =>
            confirm({
              title: "With Overlay",
              description: "This dialog has a dark background overlay.",
            })
          }
        >
          Overlay
        </Button>
      )
    }

    const ExampleOutsidePressDisabled = () => {
      const { confirm } = useAlertDialog()

      return (
        <Button
          variant="secondary"
          onClick={() =>
            confirm({
              title: "Outside Press Disabled",
              description: "Clicking outside will NOT close this dialog.",
            })
          }
        >
          OutsidePress Disabled
        </Button>
      )
    }

    return (
      <div className="flex gap-4">
        <AlertDialogProvider overlay>
          <ExampleWithOverlay />
        </AlertDialogProvider>

        <AlertDialogProvider outsidePress={false}>
          <ExampleOutsidePressDisabled />
        </AlertDialogProvider>
      </div>
    )
  },
}

/**
 * Escape Key Disabled: Demonstrates disabling ESC key to close dialog.
 * Set `closeOnEscape: false` in dialog config to prevent ESC key from closing the dialog.
 */
export const EscapeKeyDisabled: Story = {
  render: function EscapeKeyDisabledStory() {
    const Example = () => {
      const { confirm } = useAlertDialog()

      return (
        <Button
          variant="secondary"
          onClick={() =>
            confirm({
              title: "ESC Key Disabled",
              description: "Pressing ESC will NOT close this dialog. Use the buttons instead.",
              closeOnEscape: false,
            })
          }
        >
          ESC Disabled
        </Button>
      )
    }

    return (
      <AlertDialogProvider>
        <Example />
      </AlertDialogProvider>
    )
  },
}

/**
 * Z-Index Layering: AlertDialog correctly appears above Dialog components.
 */
export const ZIndexLayering: Story = {
  render: function ZIndexLayeringStory() {
    const Example = () => {
      const { alert, confirm } = useAlertDialog()
      const [dialogOpen, setDialogOpen] = useState(false)

      return (
        <div className="flex flex-col gap-4">
          <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>

          {dialogOpen && (
            <Dialog
              draggable
              open={dialogOpen}
              onOpenChange={setDialogOpen}
            >
              <Dialog.Header title="Regular Dialog" />
              <Dialog.Content className="flex gap-2 p-4">
                <Button
                  variant="primary"
                  onClick={() =>
                    alert({
                      title: "Alert",
                      description: "This AlertDialog should appear above the Dialog.",
                    })
                  }
                >
                  Show Alert
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    confirm({
                      title: "Confirm",
                      description: "This AlertDialog should appear above the Dialog.",
                    })
                  }
                >
                  Show Confirm
                </Button>
              </Dialog.Content>
              <Dialog.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setDialogOpen(false)}
                >
                  Close Dialog
                </Button>
              </Dialog.Footer>
            </Dialog>
          )}
        </div>
      )
    }

    return (
      <AlertDialogProvider>
        <Example />
      </AlertDialogProvider>
    )
  },
}
