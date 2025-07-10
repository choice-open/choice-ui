import { Styles, Target } from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { tcx } from "../../utils"
import { Button } from "../button"
import { Dropdown } from "../dropdown"
import { IconButton } from "../icon-button"
import { ScrollArea } from "../scroll-area"
import { Splitter } from "../splitter"
import { Panel } from "./panel"

const meta: Meta<typeof Panel> = {
  title: "Layouts/Panel/Title",
  component: Panel,
}

export default meta

type Story = StoryObj<typeof Panel>

const AllotmentContainer = ({
  children,
  header,
}: {
  children: React.ReactNode
  header: React.ReactNode
}) => {
  return (
    <Splitter
      defaultSizes={[800, 240]}
      className="absolute! inset-0"
    >
      <Splitter.Pane minSize={320}>
        <div className="bg-secondary-background flex h-screen min-h-0 w-full flex-1 flex-col"></div>
      </Splitter.Pane>

      <Splitter.Pane minSize={240}>
        <ScrollArea>
          <ScrollArea.Viewport className="bg-default-background pb-16">
            <ScrollArea.Content>
              <div className="min-w-0 border-b p-4 font-medium">{header}</div>

              {children}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea>
      </Splitter.Pane>
    </Splitter>
  )
}

/**
 * `IfPanelTitle` is a versatile panel header component that provides consistent styling and behavior
 * for panel titles across the application.
 *
 * ### Features
 * - Clean and consistent panel header styling
 * - Optional collapsible functionality
 * - Support for custom actions (buttons, dropdowns, etc.)
 * - Customizable styling through classNames
 * - Accessible button/span rendering based on interaction needs
 *
 * ### Props
 * - `title`: The text to display as the panel title
 * - `children`: Optional actions to display on the right side
 * - `onClick`: Optional click handler for the title
 * - `classNames`: Object for custom styling of different parts
 *   - `container`: Styles for the outer container
 *   - `titleWrapper`: Styles for the title wrapper
 *   - `title`: Styles for the title text
 *   - `actionWrapper`: Styles for the actions container
 *
 * ### Best Practices
 * 1. Use consistent title casing across panels
 * 2. Keep action buttons minimal and relevant
 * 3. Use collapsible panels for optional/secondary content
 * 4. Ensure action tooltips are descriptive
 * 5. Maintain consistent spacing between multiple actions
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [collapsible, setCollapsible] = useState(false)
    const [open, setOpen] = useState(false)
    return (
      <AllotmentContainer header="Panel title">
        {/* Basic panel title */}
        <Panel>
          <Panel.Title title="Panel title" />
        </Panel>

        {/* Panel title with icon button */}
        <Panel>
          <Panel.Title title="Panel title with icon button">
            <IconButton tooltip={{ content: "Action" }}>
              <Styles />
            </IconButton>
          </Panel.Title>
        </Panel>

        {/* Panel title with multiple icon buttons */}
        <Panel>
          <Panel.Title title="Panel title with multiple icon buttons">
            <IconButton tooltip={{ content: "Action 1" }}>
              <Target />
            </IconButton>
            <IconButton tooltip={{ content: "Action 2" }}>
              <Styles />
            </IconButton>
          </Panel.Title>
        </Panel>

        {/* Panel title with collapsible */}
        <Panel
          collapsible={true}
          isCollapsed={collapsible}
          onCollapsedChange={setCollapsible}
        >
          <Panel.Title title="Panel title with collapsible">
            <IconButton tooltip={{ content: "Action" }}>
              <Styles />
            </IconButton>
          </Panel.Title>
          <div className="px-4">
            <div className="bg-secondary-background grid place-items-center rounded-md py-4 text-center">
              <Button
                variant="secondary"
                onClick={() => setCollapsible(true)}
              >
                Close
              </Button>
            </div>
          </div>
        </Panel>

        {/* Panel title with action */}
        <Panel>
          <Panel.Title
            title="Panel title with action"
            classNames={{
              title: tcx(
                open
                  ? "text-default-foreground"
                  : "text-secondary-foreground hover:text-default-foreground",
              ),
            }}
            onClick={() => setOpen(!open)}
          >
            <Dropdown
              open={open}
              onOpenChange={setOpen}
              placement="bottom-end"
            >
              <Dropdown.Trigger asChild>
                <IconButton
                  variant="highlight"
                  active={open}
                  tooltip={{ content: "Action" }}
                >
                  <Styles />
                </IconButton>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>Action 1</Dropdown.Item>
                <Dropdown.Item>Action 2</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>
          </Panel.Title>
        </Panel>
      </AllotmentContainer>
    )
  },
}
