import { HTMLProps } from "react"
import { type TooltipProps } from "../tooltip"

/**
 * Root
 * Main button component properties
 */
export interface ButtonProps extends Omit<HTMLProps<HTMLButtonElement>, "size"> {
  /**
   * Whether the button is in an active/pressed state
   *
   * @default false
   * @example
   * ```tsx
   * <Button active>Active Button</Button>
   * ```
   */
  active?: boolean

  /**
   * Render as a custom element instead of button
   *
   * @default false
   * @example
   * ```tsx
   * <Button asChild>
   *   <Link href="/profile">Profile</Link>
   * </Button>
   * ```
   */
  asChild?: boolean

  /**
   * Additional CSS class names
   */
  className?: string

  /**
   * Whether the button appears focused (for keyboard navigation)
   *
   * @default false
   */
  focused?: boolean

  /**
   * Whether the button is in loading state with spinner
   *
   * @default false
   * @example
   * ```tsx
   * <Button loading>Saving...</Button>
   * ```
   */
  loading?: boolean

  /**
   * Button size variant
   *
   * @default "default"
   * @example
   * ```tsx
   * <Button size="large">Large Button</Button>
   * ```
   */
  size?: "default" | "large"

  /**
   * Tooltip configuration for the button
   *
   * @example
   * ```tsx
   * <Button tooltip={{ content: "Save your changes", placement: "top" }}>
   *   Save
   * </Button>
   * ```
   */
  tooltip?: TooltipProps

  /**
   * Visual style variant of the button
   *
   * @default "primary"
   * @example
   * ```tsx
   * <Button variant="primary">Primary Action</Button>
   * <Button variant="destructive">Delete</Button>
   * <Button variant="ghost">Subtle Action</Button>
   * ```
   */
  variant?:
    | "primary" // Main call-to-action
    | "secondary" // Secondary actions
    | "solid" // Solid background
    | "destructive" // Dangerous actions
    | "secondary-destruct" // Secondary dangerous actions
    | "inverse" // High contrast
    | "success" // Success actions
    | "link" // Link-style button
    | "link-danger" // Dangerous link-style
    | "ghost" // Minimal styling
    | "dark" // Dark theme
    | "reset" // Reset all styles
}
