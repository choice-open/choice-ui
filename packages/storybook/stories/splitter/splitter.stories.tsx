import {
  Button,
  IconButton,
  Splitter,
  type SplitterHandle,
} from "@choiceform/design-system";
import { RemoveSmall } from "@choiceform/icons-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";

const meta = {
  title: "Layouts/Splitter",
  component: Splitter,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["new"],
} satisfies Meta<typeof Splitter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `Splitter` is a resizable split view component that allows content areas to be resized by users.
 *
 * Features:
 * - Horizontal and vertical splitting modes
 * - Nested splitter panels for complex layouts
 * - Min/max size constraints for panes
 * - Snap-to-zero functionality for collapsible panels
 * - Programmatic control with ref methods
 * - Visibility toggle support
 * - Dynamic pane management
 *
 * Usage Guidelines:
 * - Use for layouts that need user-adjustable sections
 * - Apply explicit height/width to the container
 * - Utilize Splitter.Pane for more control over individual panes
 * - Set appropriate minSize/maxSize constraints for better UX
 * - Leverage the reset method for restoring default layouts
 *
 * Accessibility:
 * - Keyboard navigable resize functionality
 * - Maintains focus management across panes
 * - Proper ARIA attributes for interactive elements
 * - High-contrast visual indicators for splitter handles
 * - Consistent behavior across input devices
 */

/**
 * Basic: Demonstrates the default horizontal splitter with two equally sized panes.
 *
 * This example shows the simplest implementation with direct child content.
 * The splitter automatically divides the available space between the children.
 */
export const Basic = {
  render: function BasicStory() {
    return (
      <Splitter className="h-screen w-full">
        <div className="grid h-full place-content-center">Pane 1</div>
        <div className="grid h-full place-content-center">Pane 2</div>
      </Splitter>
    );
  },
};

/**
 * Pane: Demonstrates using the Splitter.Pane component for explicit pane control.
 *
 * Using Splitter.Pane offers more control over individual panes, allowing for:
 * - Setting min/max sizes
 * - Configuring snap behavior
 * - Controlling visibility
 * - Setting priority for resizing
 */
export const Pane = {
  render: function PaneStory() {
    return (
      <Splitter className="h-screen w-full">
        <Splitter.Pane>
          <div className="grid h-full place-content-center">Pane 1</div>
        </Splitter.Pane>
        <Splitter.Pane>
          <div className="grid h-full place-content-center">Pane 2</div>
        </Splitter.Pane>
      </Splitter>
    );
  },
};

/**
 * Nested: Shows how to create complex layouts with nested splitters.
 *
 * This example demonstrates:
 * - Mixing horizontal and vertical splitters
 * - Setting size constraints (minSize/maxSize)
 * - Using snap behavior for collapsible panes
 * - Creating multi-level layouts
 *
 * This pattern is useful for complex application layouts like IDEs,
 * dashboards, or content management systems.
 */
export const Nested = {
  render: function NestedStory() {
    return (
      <Splitter minSize={100} className="h-screen w-screen">
        <Splitter.Pane maxSize={400}>
          <Splitter vertical>
            <Splitter.Pane minSize={100}>
              <div className="grid h-full place-content-center">Pane 1</div>
            </Splitter.Pane>
            <Splitter.Pane snap>
              <div className="grid h-full place-content-center">Pane 2</div>
            </Splitter.Pane>
            <Splitter.Pane snap>
              <div className="grid h-full place-content-center">Pane 3</div>
            </Splitter.Pane>
          </Splitter>
        </Splitter.Pane>
        <Splitter.Pane>
          <div className="grid h-full place-content-center">Pane 4</div>
        </Splitter.Pane>
      </Splitter>
    );
  },
};

/**
 * Close: Demonstrates dynamic pane management with the ability to remove panes.
 *
 * This example shows:
 * - Dynamic rendering of panes based on state
 * - Implementation of close functionality
 * - Proper key management for list rendering
 * - Maintaining layout after pane removal
 *
 * This pattern is useful for applications with tabbed interfaces or
 * dashboards where components can be added or removed.
 */
export const Close = {
  render: function CloseStory() {
    const [panes, setPanes] = useState([0, 1, 2]);
    return (
      <Splitter vertical minSize={100} className="h-screen w-screen">
        <Splitter.Pane maxSize={400}>
          <Splitter>
            {panes.map((pane, index) => (
              <Splitter.Pane key={pane}>
                <div className="grid h-full place-content-center">
                  Pane {index + 1}
                </div>
                <div className="absolute top-0 h-full w-full">
                  <IconButton
                    className="absolute top-2 right-2"
                    onClick={() =>
                      setPanes((panes) => {
                        const newPanes = [...panes];
                        newPanes.splice(pane, 1);
                        return newPanes;
                      })
                    }
                  >
                    <RemoveSmall />
                  </IconButton>
                </div>
              </Splitter.Pane>
            ))}
          </Splitter>
        </Splitter.Pane>
        <Splitter.Pane>
          <div className="grid h-full place-content-center">Pane 4</div>
        </Splitter.Pane>
      </Splitter>
    );
  },
};

/**
 * Visible: Demonstrates toggling pane visibility.
 *
 * This example shows:
 * - Controlling pane visibility with state
 * - Using the onVisibleChange callback
 * - Integrating with button controls
 * - Proper state synchronization
 *
 * This pattern is useful for collapsible sidebars, panels, or
 * details areas that can be shown or hidden.
 */
export const Visible = {
  render: function VisibleStory() {
    const [visible, setVisible] = useState(true);
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <Button
          onClick={() => {
            setVisible((visible) => !visible);
          }}
        >
          {visible ? "Hide" : "Show"}
        </Button>
        <div className="h-96 w-96 rounded-xl border">
          <Splitter
            snap
            onVisibleChange={(_index, value) => {
              setVisible(value);
            }}
          >
            <div className="grid h-full place-content-center">Pane 1</div>
            <Splitter.Pane visible={visible}>
              <div className="grid h-full place-content-center">Pane 2</div>
            </Splitter.Pane>
          </Splitter>
        </div>
      </div>
    );
  },
};

/**
 * Reset: Demonstrates programmatic control using the splitter ref.
 *
 * This example shows:
 * - Using a ref to access splitter methods
 * - Implementing a reset button to restore default layout
 * - Proper typing with SplitterHandle
 * - Imperative control of the component
 *
 * This pattern is useful for providing users with a way to reset
 * the layout after manual adjustments, or for programmatically
 * controlling the splitter layout from parent components.
 */
export const Reset = {
  render: function ResetStory() {
    const ref = useRef<SplitterHandle>(null);

    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <Button
          onClick={() => {
            ref.current?.reset();
          }}
        >
          Reset
        </Button>
        <div className="h-96 w-96 rounded-xl border">
          <Splitter ref={ref}>
            <div className="grid h-full place-content-center">Pane 1</div>
            <div className="grid h-full place-content-center">Pane 2</div>
          </Splitter>
        </div>
      </div>
    );
  },
};
