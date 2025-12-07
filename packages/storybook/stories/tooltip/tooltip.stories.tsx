import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@choiceform/design-system";
import { Placement } from "@floating-ui/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Tooltip> = {
  title: "Feedback/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["upgrade"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 使用新的简化 API
export const SimpleAPI: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Tooltip content="Basic tooltip">
          <Button>Basic Tooltip</Button>
        </Tooltip>

        <Tooltip
          content="Save file"
          shortcut={{
            modifier: ["command"],
            keys: "S",
          }}
        >
          <Button>Tooltip with shortcut</Button>
        </Tooltip>

        <Tooltip content="Tooltip without arrow" withArrow={false}>
          <Button>Tooltip without arrow</Button>
        </Tooltip>

        <Tooltip content="Disabled tooltip" disabled={true}>
          <Button>Disabled tooltip</Button>
        </Tooltip>
      </div>

      <div className="flex gap-4">
        <Tooltip content="Default style" variant="default">
          <Button>Default style</Button>
        </Tooltip>

        <Tooltip content="Light style" variant="light">
          <Button>Light style</Button>
        </Tooltip>

        <Tooltip content="Large offset" offset={20}>
          <Button>Large offset</Button>
        </Tooltip>

        <Tooltip content="Small offset" offset={2}>
          <Button>Small offset</Button>
        </Tooltip>
      </div>
    </div>
  ),
};

// Basic tooltip example using old API
export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <Button>Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>This is a tooltip</TooltipContent>
    </Tooltip>
  ),
};

// Tooltip with different placements
export const Placements: Story = {
  render: () => (
    <div className="space-y-8">
      {/* 顶部排列 */}
      <div className="flex items-center justify-center gap-4">
        <Tooltip placement="top-start">
          <TooltipTrigger>
            <Button variant="secondary">Top Start</Button>
          </TooltipTrigger>
          <TooltipContent>Top start placement</TooltipContent>
        </Tooltip>

        <Tooltip placement="top">
          <TooltipTrigger>
            <Button variant="secondary">Top</Button>
          </TooltipTrigger>
          <TooltipContent>Top placement</TooltipContent>
        </Tooltip>

        <Tooltip placement="top-end">
          <TooltipTrigger>
            <Button variant="secondary">Top End</Button>
          </TooltipTrigger>
          <TooltipContent>Top end placement</TooltipContent>
        </Tooltip>
      </div>

      {/* 中间排列 */}
      <div className="flex items-center justify-between">
        {/* 左侧 */}
        <div className="flex flex-col gap-4">
          <Tooltip placement="left-start">
            <TooltipTrigger>
              <Button variant="secondary" className="h-16">
                Left Start
              </Button>
            </TooltipTrigger>
            <TooltipContent>Left start placement</TooltipContent>
          </Tooltip>

          <Tooltip placement="left">
            <TooltipTrigger>
              <Button variant="secondary" className="h-16">
                Left
              </Button>
            </TooltipTrigger>
            <TooltipContent>Left placement</TooltipContent>
          </Tooltip>

          <Tooltip placement="left-end">
            <TooltipTrigger>
              <Button variant="secondary" className="h-16">
                Left End
              </Button>
            </TooltipTrigger>
            <TooltipContent>Left end placement</TooltipContent>
          </Tooltip>
        </div>

        {/* 中心元素 */}
        <div className="flex items-center justify-center">
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-8">
            <span className="text-gray-500">
              Hover around buttons to see tooltips
            </span>
          </div>
        </div>

        {/* 右侧 */}
        <div className="flex flex-col gap-4">
          <Tooltip placement="right-start">
            <TooltipTrigger>
              <Button variant="secondary" className="h-16">
                Right Start
              </Button>
            </TooltipTrigger>
            <TooltipContent>Right start placement</TooltipContent>
          </Tooltip>

          <Tooltip placement="right">
            <TooltipTrigger>
              <Button variant="secondary" className="h-16">
                Right
              </Button>
            </TooltipTrigger>
            <TooltipContent>Right placement</TooltipContent>
          </Tooltip>

          <Tooltip placement="right-end">
            <TooltipTrigger>
              <Button variant="secondary" className="h-16">
                Right End
              </Button>
            </TooltipTrigger>
            <TooltipContent>Right end placement</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* 底部排列 */}
      <div className="flex items-center justify-center gap-4">
        <Tooltip placement="bottom-start">
          <TooltipTrigger>
            <Button variant="secondary">Bottom Start</Button>
          </TooltipTrigger>
          <TooltipContent>Bottom start placement</TooltipContent>
        </Tooltip>

        <Tooltip placement="bottom">
          <TooltipTrigger>
            <Button variant="secondary">Bottom</Button>
          </TooltipTrigger>
          <TooltipContent>Bottom placement</TooltipContent>
        </Tooltip>

        <Tooltip placement="bottom-end">
          <TooltipTrigger>
            <Button variant="secondary">Bottom End</Button>
          </TooltipTrigger>
          <TooltipContent>Bottom end placement</TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

// DelayGroup example - the key feature that was causing issues
export const DelayGroup: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-strong mb-4">With DelayGroup</h3>
        <p className="text-body-small mb-4 text-gray-600">
          Hover over the first button and wait 200ms for tooltip to appear.
          <br />
          Then quickly move to other buttons - they should appear instantly!
        </p>
        <div className="flex gap-4">
          <TooltipProvider
            delay={{
              open: 400,
              close: 200,
            }}
          >
            <Tooltip>
              <TooltipTrigger>
                <Button>First</Button>
              </TooltipTrigger>
              <TooltipContent>
                First tooltip - 200ms delay initially
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button>Second</Button>
              </TooltipTrigger>
              <TooltipContent>
                Second tooltip - instant when moving from first
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button>Third</Button>
              </TooltipTrigger>
              <TooltipContent>
                Third tooltip - instant when moving from others
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <TooltipProvider
      delay={{
        open: 400,
        close: 200,
      }}
    >
      <div className="grid grid-cols-4 gap-4">
        {["default", "light"].map((variant) =>
          ["right", "left", "top", "bottom"].map((placement) => (
            <Tooltip
              key={`${placement}-${variant}`}
              placement={placement as Placement}
            >
              <TooltipTrigger>
                <Button variant="secondary">
                  {placement} / {variant}
                </Button>
              </TooltipTrigger>
              <TooltipContent variant={variant as "default" | "light"}>
                {placement} / {variant}
              </TooltipContent>
            </Tooltip>
          ))
        )}
      </div>
    </TooltipProvider>
  ),
};

/**
 * Shows how to use the `shortcut` prop to add keyboard shortcuts to a tooltip.
 *
 * ### Features
 * - Display keyboard shortcuts
 * - Support for modifier keys
 *
 * ### Usage
 * ```tsx
 * <Tooltip
 *   content="This is a tooltip"
 *   shortcut={{ modifier: ["command"], keys: "K" }}
 * >
 *   <Button>Tooltip</Button>
 * </Tooltip>
 * ```
 */

export const Shortcut: Story = {
  render: function ShortcutStory() {
    return (
      <TooltipProvider
        delay={{
          open: 400,
          close: 200,
        }}
      >
        <div className="flex gap-4">
          <Tooltip
            content="Save file"
            shortcut={{ modifier: ["command"], keys: "K" }}
          >
            <Button variant="secondary">Command + K</Button>
          </Tooltip>

          <Tooltip
            content="Select all"
            shortcut={{ modifier: ["ctrl"], keys: "A" }}
          >
            <Button variant="secondary">Ctrl + A</Button>
          </Tooltip>

          <Tooltip
            content="Shift"
            shortcut={{ modifier: ["shift"], keys: "A" }}
          >
            <Button variant="secondary">Shift + A</Button>
          </Tooltip>
        </div>
      </TooltipProvider>
    );
  },
};
