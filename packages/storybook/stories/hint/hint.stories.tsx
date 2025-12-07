import { Hint } from "@choiceform/design-system";
import { CircleInfoLargeSolid } from "@choiceform/icons-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Hint> = {
  title: "Feedback/Hint",
  component: Hint,
  parameters: {
    layout: "centered",
  },
  tags: ["new", "autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Screenshot Match - Reference implementation matching the design specification
 *
 * Features:
 * - Right-start placement for optimal positioning
 * - Clean layout with label and hint combination
 * - Standard content formatting
 *
 * Usage:
 * ```tsx
 * <Hint content="Optional reason" placement="right-start" />
 * ```
 */
export const ScreenshotMatch: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span className="font-strong">Reason</span>
      <Hint content="Optional reason" placement="right-start" />
    </div>
  ),
};

/**
 * Custom Icon - Demonstrates how to use custom icons in hint tooltips
 *
 * Features:
 * - Custom icon replacement for default info icon
 * - Maintains consistent tooltip behavior
 * - Flexible icon system integration
 *
 * Usage:
 * ```tsx
 * <Hint
 *   icon={<CircleInfoLargeSolid />}
 *   content="Optional reason"
 * />
 * ```
 */
export const CustomIcon: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span className="font-strong">Reason</span>
      <Hint icon={<CircleInfoLargeSolid />} content="Optional reason" />
    </div>
  ),
};
/**
 * Default - Basic hint implementation with minimal configuration
 *
 * Features:
 * - Default bottom placement
 * - Standard info icon
 * - Simple content display
 * - Auto-positioning on hover/focus
 *
 * Usage:
 * ```tsx
 * <Hint content="Optional reason" />
 * ```
 */
export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2 rounded-xl p-4">
      <span className="font-strong">Reason</span>
      <Hint content="Optional reason" />
    </div>
  ),
};

/**
 * Placements - Demonstrates different tooltip positioning options
 *
 * Features:
 * - Multiple placement variations (left-start, right-start)
 * - Adaptive positioning based on available space
 * - Consistent behavior across different alignments
 * - Visual comparison of placement options
 *
 * Usage:
 * ```tsx
 * <Hint content="Left tooltip" placement="left-start" />
 * <Hint content="Right tooltip" placement="right-start" />
 * ```
 */
export const Placements: Story = {
  render: () => (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <div className="flex items-center gap-2">
        <Hint
          content="Information tooltip displayed on the left"
          placement="left-start"
        />
        <span>Left placement</span>
      </div>

      <div className="flex items-center gap-2">
        <span>Right placement</span>
        <Hint
          content="Information tooltip displayed on the right"
          placement="right-start"
        />
      </div>
    </div>
  ),
};

/**
 * Long Content - Tests hint behavior with extensive text content
 *
 * Features:
 * - Automatic text wrapping for long content
 * - Maintains optimal width for readability
 * - Preserves tooltip positioning with larger content
 * - Responsive design adaptation
 *
 * Usage:
 * ```tsx
 * <Hint
 *   content="Very long explanatory text that demonstrates..."
 *   placement="right-start"
 * />
 * ```
 */
export const LongContent: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span>Complex field</span>
      <Hint
        content="This is a very long information tooltip content used to demonstrate the display effect when there is more content. The component will automatically wrap and maintain appropriate width to ensure content readability and aesthetics."
        placement="right-start"
      />
    </div>
  ),
};

/**
 * Disabled - Shows hint component in disabled state
 *
 * Features:
 * - Disabled interaction state
 * - Visual indication of unavailable tooltip
 * - Maintains layout consistency when disabled
 * - Prevents hover/focus activation
 *
 * Usage:
 * ```tsx
 * <Hint
 *   content="Disabled tooltip content"
 *   disabled={true}
 * />
 * ```
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span>Disabled field</span>
      <Hint content="This information tooltip is disabled" disabled={true} />
    </div>
  ),
};

/**
 * Dark Variant - Shows hint component in dark variant
 *
 * Features:
 * - Dark background and text color
 * - Visual consistency with dark theme
 * - Maintains tooltip functionality in dark mode
 *
 * Usage:
 * ```tsx
 * <Hint
 *   content="Dark variant tooltip content"
 *   variant="dark"
 * />
 * ```
 */
export const DarkVariant: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span>Dark variant</span>
      <Hint content="Dark variant tooltip content" variant="dark" />
    </div>
  ),
};
