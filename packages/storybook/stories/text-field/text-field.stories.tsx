import { Badge, Checkbox, Select, TextField } from "@choiceform/design-system";
import { ArrowRight, Search } from "@choiceform/icons-react";
import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = {
  title: "Forms/TextField",
  component: TextField,
  tags: ["new"],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic text field without any additional features.
 * Demonstrates the simplest usage of the TextField component.
 */
export const Basic: Story = {
  render: function BasicStory() {
    return <TextField placeholder="Enter text" />;
  },
};

/**
 * Text field with a prefix icon.
 * Shows how to add icons or other elements before the input area.
 * The prefix changes color on hover and focus for better user feedback.
 */
export const WithPrefix: Story = {
  render: function WithPrefixStory() {
    return (
      <TextField placeholder="Enter text">
        <TextField.Prefix className="text-secondary-foreground group-hover/text-field:text-default-foreground group-focus-within/text-field:text-default-foreground">
          <Search />
        </TextField.Prefix>
      </TextField>
    );
  },
};

/**
 * Text field with a suffix element.
 * Demonstrates adding badges, buttons, or other elements after the input.
 * Useful for status indicators or action buttons.
 */
export const WithSuffix: Story = {
  render: function WithSuffixStory() {
    return (
      <TextField placeholder="Enter text">
        <TextField.Suffix className="px-1">
          <Badge>Suffix</Badge>
        </TextField.Suffix>
      </TextField>
    );
  },
};

/**
 * Text field with both prefix and suffix elements.
 * Combines prefix icons and suffix badges for rich input experiences.
 * Commonly used for search fields with filters or status indicators.
 */
export const WithPrefixAndSuffix: Story = {
  render: function WithPrefixAndSuffixStory() {
    return (
      <TextField placeholder="Enter text">
        <TextField.Prefix className="text-secondary-foreground group-hover/text-field:text-default-foreground group-focus-within/text-field:text-default-foreground">
          <Search />
        </TextField.Prefix>
        <TextField.Suffix className="px-1">
          <Badge>Suffix</Badge>
        </TextField.Suffix>
      </TextField>
    );
  },
};

/**
 * Text field with a label.
 * Shows proper form labeling for accessibility and usability.
 * Labels help users understand the expected input.
 */
export const WithLabel: Story = {
  render: function WithLabelStory() {
    return (
      <TextField placeholder="Enter text">
        <TextField.Label>Label</TextField.Label>
      </TextField>
    );
  },
};

/**
 * Text field with a description.
 * Provides additional context or help text below the input.
 * Useful for explaining format requirements or providing examples.
 */
export const WithDescription: Story = {
  render: function WithDescriptionStory() {
    return (
      <TextField placeholder="Enter text">
        <TextField.Description>{faker.lorem.words()}</TextField.Description>
      </TextField>
    );
  },
};

/**
 * Large size variant of the text field.
 * Demonstrates the larger size option for improved visibility.
 * Use for prominent inputs or when more padding is needed.
 */
export const Size: Story = {
  render: function SizeStory() {
    return <TextField placeholder="Enter text" size="large" />;
  },
};

/**
 * Disabled text field with label and description.
 * Shows how the component appears when interaction is prevented.
 * All child elements inherit the disabled state automatically.
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    return (
      <TextField placeholder="Enter text" disabled>
        <TextField.Label>Label</TextField.Label>
        <TextField.Description>Description</TextField.Description>
      </TextField>
    );
  },
};

/**
 * Read-only text field.
 * Allows viewing but not editing the value.
 * Useful for displaying non-editable information in form contexts.
 */
export const ReadOnly: Story = {
  render: function ReadOnlyStory() {
    return <TextField readOnly value="Read Only" />;
  },
};

/**
 * Variants: Demonstrates different visual variants of the text field component.
 * - default: Follows the page theme dynamically (light/dark mode)
 * - light: Fixed light appearance regardless of theme
 * - dark: Fixed dark appearance regardless of theme
 * - reset: Removes variant styling, no variant settings applied
 */
export const Variants: Story = {
  render: function VariantsStory() {
    const [disabled, setDisabled] = useState(false);
    return (
      <div className="flex flex-col gap-2">
        <Checkbox value={disabled} onChange={(value) => setDisabled(value)}>
          Disabled
        </Checkbox>
        <div className="grid grid-cols-3 overflow-hidden rounded-xl border">
          <div className="bg-default-background flex aspect-square items-center justify-center p-8">
            <TextField disabled={disabled} placeholder="Enter text">
              <TextField.Label description="This is a description">
                Label
              </TextField.Label>
              <TextField.Description>Description</TextField.Description>
            </TextField>
          </div>
          <div className="flex aspect-square items-center justify-center bg-white p-8">
            <TextField
              disabled={disabled}
              variant="light"
              placeholder="Enter text"
            >
              <TextField.Label description="This is a description">
                Label
              </TextField.Label>
              <TextField.Description>Description</TextField.Description>
            </TextField>
          </div>
          <div className="flex aspect-square items-center justify-center bg-gray-800 p-8">
            <TextField
              disabled={disabled}
              variant="dark"
              placeholder="Enter text"
            >
              <TextField.Label description="This is a description">
                Label
              </TextField.Label>
              <TextField.Description>Description</TextField.Description>
            </TextField>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Controlled text field with value display.
 * Shows two-way data binding with React state.
 * The current value is displayed below the input for demonstration.
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState("");
    return (
      <div className="flex flex-col gap-2">
        <TextField value={value} onChange={setValue} />
        <p className="text-secondary-foreground h-6">{value}</p>
      </div>
    );
  },
};

/**
 * TextField with arrow icon prefix and dropdown menu suffix
 * Demonstrates a URL or page input with navigation and dropdown functionality
 */
export const WithArrowAndDropdown: Story = {
  render: function WithArrowAndDropdownStory() {
    const [dropdownValue, setDropdownValue] = useState<string>("recent");

    return (
      <TextField placeholder="Page or URL">
        <TextField.Prefix className="text-secondary-foreground group-hover/text-field:text-default-foreground group-focus-within/text-field:text-default-foreground">
          <ArrowRight />
        </TextField.Prefix>
        <TextField.Suffix className="">
          <Select value={dropdownValue} onChange={setDropdownValue}>
            <Select.Trigger className="h-6 w-6 border-0 bg-transparent p-0 hover:bg-transparent"></Select.Trigger>
            <Select.Content>
              <Select.Item value="recent">
                <Select.Value>Recent</Select.Value>
              </Select.Item>
              <Select.Item value="bookmarks">
                <Select.Value>Bookmarks</Select.Value>
              </Select.Item>
              <Select.Item value="history">
                <Select.Value>History</Select.Value>
              </Select.Item>
              <Select.Divider />
              <Select.Item value="settings">
                <Select.Value>Settings</Select.Value>
              </Select.Item>
            </Select.Content>
          </Select>
        </TextField.Suffix>
      </TextField>
    );
  },
};
