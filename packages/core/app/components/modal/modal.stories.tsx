import { ChevronLeft, ThemeSunBright } from "@choiceform/icons-react"
import { faker } from "@faker-js/faker"
import { Story } from "@storybook/blocks"
import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { Avatar } from "../avatar"
import { Button } from "../button"
import { IconButton } from "../icon-button"
import { Select } from "../select"
import { Tabs } from "../tabs"
import { TextField } from "../text-field"
import { Modal } from "./modal"
import { SearchInput } from "../search-input"

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  tags: ["new"],
}

export default meta

type Story = StoryObj<typeof Modal>

/**
 * `Modal` is a versatile overlay component for displaying focused content and gathering user input.
 *
 * Features:
 * - Structured layout with header, content, and footer sections
 * - Flexible header with support for custom elements (tabs, selects, navigation)
 * - Customizable sizing and positioning
 * - Specialized input components for modal contexts
 * - Footer with action buttons
 * - Proper focus management
 *
 * Usage Guidelines:
 * - Use for important interactions that require focused attention
 * - Structure content with clear headers and organized body content
 * - Include appropriate action buttons in the footer
 * - Consider responsive behavior for different screen sizes
 * - Limit the number of interactive elements to maintain focus
 *
 * Accessibility:
 * - Manages focus properly when opened and closed
 * - Traps focus within the modal when open
 * - Supports keyboard navigation and dismissal
 * - Provides appropriate ARIA roles and attributes
 * - Ensures adequate contrast for all elements
 */

/**
 * Basic: Demonstrates the Modal component with different header configurations.
 *
 * Features:
 * - Multiple header styles showcasing flexibility
 * - Icon button for navigation or dismissal
 * - Tabs integration for content organization
 * - Select component in header for filtering or context
 * - Basic content area with padding
 * - Footer with action buttons
 *
 * This example shows how the Modal can be adapted for various UI patterns
 * while maintaining a consistent structure and appearance.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [tab, setTab] = useState("tab-1")
    const [select, setSelect] = useState("option-1")
    return (
      <Modal className="w-md">
        <Modal.Header
          title="Modal"
          onClose={() => {}}
        />
        <Modal.Header
          title="Modal"
          onClose={() => {}}
        >
          <div className="px-2 pb-2 [grid-area:input]">
            <SearchInput />
          </div>
        </Modal.Header>
        <Modal.Header
          title={
            <>
              <IconButton>
                <ChevronLeft />
              </IconButton>
              Modal
            </>
          }
        />
        <Modal.Header
          title={
            <Tabs
              value={tab}
              onChange={setTab}
            >
              <Tabs.Item value="tab-1">Tab 1</Tabs.Item>
              <Tabs.Item value="tab-2">Tab 2</Tabs.Item>
              <Tabs.Item value="tab-3">Tab 3</Tabs.Item>
            </Tabs>
          }
        />
        <Modal.Header
          title={
            <Select
              matchTriggerWidth
              value={select}
              onChange={setSelect}
            >
              <Select.Trigger prefixElement={<ThemeSunBright />}>
                {select || "Select"}
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="option-1">Option 1</Select.Item>
                <Select.Item value="option-2">Option 2</Select.Item>
                <Select.Item value="option-3">Option 3</Select.Item>
              </Select.Content>
            </Select>
          }
        />

        <Modal.Content>
          <div className="p-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
          </div>
        </Modal.Content>
        <Modal.Footer className="justify-end">
          <Button variant="secondary">Cancel</Button>
          <Button>Action</Button>
        </Modal.Footer>
      </Modal>
    )
  },
}

/**
 * ModalContent: Demonstrates specialized form elements designed for modals.
 *
 * Features:
 * - TextField component integration
 * - Modal.MultiLineInput for multi-line text entry
 * - Modal.Select for dropdown selection with custom trigger content
 * - Proper spacing and layout for form elements
 * - Avatar integration with select component
 *
 * This pattern is useful for:
 * - Forms and data entry dialogs
 * - Settings or configuration panels
 * - User input collection with proper validation
 * - Creating consistent form experiences within modals
 */
export const ModalContent: Story = {
  render: function ModalContentStory() {
    const [select, setSelect] = useState("option-1")
    const [input, setInput] = useState("")
    const [multiLineInput, setMultiLineInput] = useState("")

    return (
      <Modal>
        <Modal.Header title="Modal" />
        <Modal.Content className="flex w-md flex-col gap-4 p-4">
          <Modal.Input
            size="large"
            label="Name"
            placeholder="Please enter your name"
            description="This is a description"
            value={input}
            onChange={setInput}
          />

          <Modal.MultiLineInput
            label="Multi-line input"
            placeholder="Please enter your multi-line input"
            description="This is a description"
            value={multiLineInput}
            onChange={setMultiLineInput}
          />

          <Modal.Select
            label="Select"
            value={select}
            onChange={setSelect}
          >
            <Select.Trigger
              size="large"
              className="gap-2"
            >
              <Avatar
                photo={faker.image.avatar()}
                name={faker.name.fullName()}
                size="small"
              />
              <span className="flex-1 truncate">{select || "Select"}</span>
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="option-1">Option 1</Select.Item>
              <Select.Item value="option-2">Option 2</Select.Item>
              <Select.Item value="option-3">Option 3</Select.Item>
            </Select.Content>
          </Modal.Select>
        </Modal.Content>
      </Modal>
    )
  },
}

export const LongTitle: Story = {
  render: function LongTitleStory() {
    return (
      <Modal className="w-sm">
        <Modal.Header title={faker.lorem.sentence(10)} />
        <Modal.Content className="p-4">{faker.lorem.sentence(10)}</Modal.Content>
      </Modal>
    )
  },
}
