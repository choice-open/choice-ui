import type { YearCalendarProps } from "@choiceform/design-system";
import { YearCalendar } from "@choiceform/design-system";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

// 辅助组件
const YearPickerDemo = (args: YearCalendarProps) => {
  const [selectedYear, setSelectedYear] = useState<Date | null>(
    args.value ?? new Date()
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <YearCalendar
          {...args}
          value={selectedYear}
          onChange={setSelectedYear}
          className="w-48 rounded-xl border"
        />
        <YearCalendar
          {...args}
          value={selectedYear}
          onChange={setSelectedYear}
          className="w-48 rounded-xl border"
          variant="dark"
        />
      </div>
      <div className="text-secondary-foreground">
        Selected year: {selectedYear?.getFullYear() ?? "None"}
      </div>
    </div>
  );
};

const meta: Meta<typeof YearCalendar> = {
  title: "DateAndTime/YearCalendar",
  component: YearCalendar,
  parameters: {
    layout: "centered",
  },
  tags: ["new", "autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `YearCalendar` is a specialized calendar component for year selection with flexible range and display options.
 *
 * Features:
 * - Grid-based year selection with customizable year count
 * - Year range restrictions with minimum and maximum year limits
 * - Selective year disabling for specific years
 * - Current year highlighting and navigation
 * - Light and dark theme variants
 * - Customizable starting year and display range
 * - Disabled state support for entire component
 * - Keyboard navigation and accessibility support
 * - Compact grid layout optimized for year selection
 * - Proper year boundary handling and validation
 *
 * Usage:
 * - Use for year selection in date pickers and filters
 * - Ideal for historical data selection or future planning
 * - Perfect for birth year selection or document year filtering
 * - Combine with other calendar components for comprehensive date selection
 *
 * Best Practices:
 * - Set appropriate year ranges based on your data requirements
 * - Use disabled years to prevent selection of irrelevant years
 * - Consider the year count for optimal display and navigation
 * - Provide clear visual feedback for current and selected years
 *
 * Accessibility:
 * - Full keyboard navigation with arrow keys and enter/space selection
 * - Screen reader friendly with proper ARIA labels and year announcements
 * - High contrast support for all year states
 * - Semantic HTML structure with proper year semantics
 */

const currentYear = new Date();

/**
 * Default: Shows the basic YearCalendar with standard configuration.
 * - Demonstrates year selection with 12 years displayed in a grid.
 * - Shows both light and dark theme variants side by side.
 * - Uses current year as the selected value and reference point.
 */
export const Default: Story = {
  args: {
    value: currentYear,
    currentYear,
    yearCount: 12,
    disabled: false,
  },
  render: (args) => <YearPickerDemo {...args} />,
};

/**
 * WithRange: Demonstrates YearCalendar with year range restrictions.
 * - Shows how to limit selectable years to a specific range (±5 years from current).
 * - Displays navigation boundaries and how they affect user interaction.
 * - Useful for applications with relevant time period constraints.
 */
export const WithRange: Story = {
  args: {
    value: currentYear,
    currentYear,
    minYear: new Date(currentYear.getFullYear() - 5, 0, 1),
    maxYear: new Date(currentYear.getFullYear() + 5, 0, 1),
    yearCount: 12,
    disabled: false,
  },
  render: (args) => <YearPickerDemo {...args} />,
};

/**
 * WithDisabledYears: Demonstrates selective year disabling functionality.
 * - Shows how to disable specific years (2 years ago, 1 year ago, 1 year ahead).
 * - Displays disabled years with visual indicators and prevented interaction.
 * - Useful for restricting selection based on data availability or business rules.
 */
export const WithDisabledYears: Story = {
  args: {
    value: currentYear,
    currentYear,
    disabledYears: [
      new Date(currentYear.getFullYear() - 2, 0, 1),
      new Date(currentYear.getFullYear() - 1, 0, 1),
      new Date(currentYear.getFullYear() + 1, 0, 1),
    ],
    yearCount: 12,
    disabled: false,
  },
  render: (args) => <YearPickerDemo {...args} />,
};

/**
 * DifferentCount: Demonstrates customizable year count display.
 * - Shows 9 years instead of the default 12 years in the grid.
 * - Displays how year count affects the grid layout and navigation.
 * - Useful for compact displays or when fewer years are needed.
 */
export const DifferentCount: Story = {
  args: {
    value: currentYear,
    currentYear,
    yearCount: 9,
    disabled: false,
  },
  render: (args) => <YearPickerDemo {...args} />,
};

/**
 * Disabled: Demonstrates the completely disabled state of YearCalendar.
 * - Shows how the entire component appears and behaves when disabled.
 * - Displays proper disabled styling and interaction prevention.
 * - Useful for readOnly scenarios or when year selection is not applicable.
 */
export const Disabled: Story = {
  args: {
    value: currentYear,
    currentYear,
    yearCount: 12,
    disabled: true,
  },
  render: (args) => <YearPickerDemo {...args} />,
};

/**
 * CustomStartYear: Demonstrates custom starting year configuration.
 * - Shows year selection starting from 2020 with 15 years displayed.
 * - Displays how to control the year range and starting point.
 * - Useful for historical data selection or specific year range requirements.
 */
export const CustomStartYear: Story = {
  args: {
    value: new Date(2025, 0, 1),
    currentYear,
    startYear: new Date(2020, 0, 1),
    yearCount: 15,
    disabled: false,
  },
  render: (args) => <YearPickerDemo {...args} />,
};

/**
 * ReadOnly: Demonstrates the YearCalendar component in readOnly mode.
 * - Prevents value changes while allowing focus and navigation
 * - Maintains normal visual appearance (unlike disabled)
 * - Useful for displaying non-editable year information
 */
export const ReadOnly: Story = {
  render: function ReadOnlyStory() {
    const [value, setValue] = useState<Date | null>(new Date(2024, 0, 1));
    const [changeCount, setChangeCount] = useState(0);

    const handleChange = (newValue: Date | null) => {
      setValue(newValue);
      setChangeCount((prev) => prev + 1);
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-stone-50 p-4">
          <div className="text-body-small-strong mb-2 text-stone-700">
            Current Value:
          </div>
          <div className="text-body-small font-mono text-stone-600">
            {value ? value.getFullYear().toString() : "null"}
          </div>
          <div className="text-body-small-strong mt-2 text-stone-700">
            Change Count:
          </div>
          <div className="text-body-small font-mono text-stone-600">
            {changeCount}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <YearCalendar
            readOnly
            value={value}
            onChange={handleChange}
            currentYear={currentYear}
          />
          <YearCalendar
            value={value}
            onChange={handleChange}
            currentYear={currentYear}
          />
        </div>
        <div className="text-body-small text-stone-600">
          💡 Try clicking years on the readonly calendar - the value should not
          change and the change count should remain at 0. Only the normal
          calendar will change the value.
        </div>
      </div>
    );
  },
};
