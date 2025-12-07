import {
  Panel,
  TimeRangeInput,
  timeStringToDate,
} from "@choiceform/design-system";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { enUS, ja, zhCN } from "date-fns/locale";
import React, { useState } from "react";
import { useEventCallback } from "usehooks-ts";

const meta: Meta<typeof TimeRangeInput> = {
  title: "DateAndTime/TimeRangeInput",
  component: TimeRangeInput,
  parameters: {
    layout: "centered",
  },
  tags: ["new", "autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `TimeRangeInput` is a sophisticated component for selecting time ranges with intelligent synchronization and validation.
 *
 * Features:
 * - Dual time input fields with automatic range synchronization
 * - Smart range preservation when adjusting start times
 * - Cross-midnight time range support (e.g., 22:00 to 06:00)
 * - Boundary validation with automatic start time adjustment
 * - Multiple time format support (24-hour, 12-hour, with seconds)
 * - Comprehensive internationalization support
 * - Flexible sizing and theming variants
 * - Duration calculation and display
 * - Real-time range validation and feedback
 * - Keyboard navigation and accessibility support
 *
 * Usage:
 * - Use for scheduling applications and shift management
 * - Ideal for booking systems, time tracking, and event planning
 * - Perfect for work hour configuration and availability settings
 * - Combine with calendar components for comprehensive time selection
 *
 * Best Practices:
 * - Provide clear placeholder text for start and end times
 * - Use consistent time formats across your application
 * - Consider range synchronization behavior for optimal UX
 * - Test with cross-midnight scenarios for 24-hour operations
 *
 * Accessibility:
 * - Full keyboard navigation between input fields
 * - Screen reader friendly with proper ARIA labels
 * - Clear focus indicators and validation feedback
 * - Semantic HTML structure for optimal time input
 */

// 演示组件
const TimeRangeDemo = (args: React.ComponentProps<typeof TimeRangeInput>) => {
  const [startValue, setStartValue] = useState<Date | null>(
    args.startValue || null
  );
  const [endValue, setEndValue] = useState<Date | null>(args.endValue || null);

  return (
    <Panel.Row type="two-input-two-icon" className="w-96 px-0">
      <TimeRangeInput
        {...args}
        startValue={startValue}
        endValue={endValue}
        onStartChange={setStartValue}
        onEndChange={setEndValue}
      />
    </Panel.Row>
  );
};

// 范围同步演示组件
const RangeSyncDemo = () => {
  const [startValue, setStartValue] = useState<Date | null>(
    timeStringToDate("09:00")
  );
  const [endValue, setEndValue] = useState<Date | null>(
    timeStringToDate("17:00")
  );

  const handleStartChange = useEventCallback((newStart: Date | null) => {
    if (newStart) {
      // 计算当前range长度（毫秒），fallback为8小时
      const currentRange =
        startValue && endValue
          ? endValue.getTime() - startValue.getTime()
          : 8 * 60 * 60 * 1000;
      // 保持range长度
      const newEnd = new Date(newStart.getTime() + currentRange);
      setStartValue(newStart);
      setEndValue(newEnd);
    } else {
      setStartValue(newStart);
    }
  });

  const handleEndChange = useEventCallback((newEnd: Date | null) => {
    if (newEnd && startValue && newEnd <= startValue) {
      // end <= start 时推动start
      setStartValue(newEnd);
    }
    setEndValue(newEnd);
  });

  return (
    <div className="space-y-6">
      <Panel.Row type="two-input-two-icon" className="px-0">
        <TimeRangeInput
          startValue={startValue}
          endValue={endValue}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
          startPlaceholder="开始时间"
          endPlaceholder="结束时间"
          format="HH:mm"
        />
      </Panel.Row>

      <div className="space-y-4">
        <div className="font-strong">🎯 Time Range Synchronization Logic</div>
        <div className="text-secondary-foreground space-y-2">
          <div>
            • <strong>Start Time Change</strong>：Automatically adjust the end
            time to maintain the original range length
          </div>
          <div>
            • <strong>End Time Change</strong>：If the end time is less than or
            equal to the start time, the start time is pushed to the end
            position
          </div>
          <div>
            • <strong>Dynamic Range</strong>
            ：First adjust the end time to set the desired range length, then
            any changes to the start time will maintain this length
          </div>
        </div>

        <div className="rounded-md border p-4">
          <div className="font-strong">🧪 Test Steps</div>
          <div className="mt-2 space-y-1">
            <div>
              1. Adjust the end time to 19:00 → the range becomes 10 hours
            </div>
            <div>
              2. Modify the start time to 10:00 → the end time is automatically
              adjusted to 20:00 to maintain a 10-hour distance
            </div>
            <div>
              3. Set the end time to be earlier than the start time (e.g.,
              08:00) → the start time is pushed to 08:00
            </div>
            <div>
              4. Support cross-day range: start time 22:00, end time the next
              day 06:00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Default: Shows the basic TimeRangeInput usage with standard configuration.
 * - Demonstrates dual time input fields for start and end times.
 * - Uses 24-hour format (HH:mm) as the default time format.
 * - Provides a foundation for time range selection implementation.
 */
export const Default: Story = {
  args: {
    startPlaceholder: "Start Time",
    endPlaceholder: "End Time",
    format: "HH:mm",
  },
  render: (args) => <TimeRangeDemo {...args} />,
};

/**
 * Size: Demonstrates the large size variant of TimeRangeInput.
 * - Shows the component with increased dimensions for prominent interfaces.
 * - Useful for applications requiring larger touch targets or enhanced visibility.
 */
export const Size: Story = {
  render: function Render() {
    return (
      <div className="space-y-4">
        <TimeRangeDemo size="large" />
      </div>
    );
  },
};

/**
 * Variable: Demonstrates the dark theme variant of TimeRangeInput.
 * - Shows the component styled for dark theme environments.
 * - Useful for applications with dark mode or specialized UI themes.
 */
export const Variable: Story = {
  render: function Render() {
    return (
      <div className="rounded-xl bg-gray-800 p-8">
        <TimeRangeDemo variant="dark" />
      </div>
    );
  },
};

/**
 * RangeSynchronization: Demonstrates the intelligent time range synchronization feature.
 * - Shows how start time changes automatically adjust the end time to maintain range length.
 * - Displays boundary validation where end times push start times when necessary.
 * - Includes comprehensive explanation and test scenarios for understanding the behavior.
 */
export const RangeSynchronization: Story = {
  render: () => <RangeSyncDemo />,
};

/**
 * WithPresetRange: Demonstrates TimeRangeInput with pre-filled time values.
 * - Shows the component with initial start (09:00) and end (17:30) times set.
 * - Displays a typical work schedule as an example of preset configurations.
 * - Useful for forms or interfaces that need default time ranges.
 */
export const WithPresetRange: Story = {
  args: {
    startValue: timeStringToDate("09:00"),
    endValue: timeStringToDate("17:30"),
    startPlaceholder: "Start Time",
    endPlaceholder: "End Time",
    format: "HH:mm",
  },
  render: (args) => <TimeRangeDemo {...args} />,
};

/**
 * CrossMidnight: Demonstrates cross-midnight time range support.
 * - Shows time ranges that span across midnight (22:00 to 06:00).
 * - Displays proper handling of overnight shifts and 24-hour operations.
 * - Useful for night shift scheduling, security operations, or 24/7 businesses.
 */
export const CrossMidnight: Story = {
  args: {
    startValue: timeStringToDate("22:00"),
    endValue: timeStringToDate("06:00"),
    startPlaceholder: "Start Time",
    endPlaceholder: "End Time",
    format: "HH:mm",
  },
  render: (args) => (
    <div className="space-y-4">
      <TimeRangeDemo {...args} />
      <div className="text-secondary-foreground">
        💡 Support cross-day time range (e.g., night shift from 22:00 to the
        next day 06:00)
      </div>
    </div>
  ),
};

/**
 * DifferentFormats: Demonstrates various time format options and their visual representation.
 * - Shows 24-hour format, 12-hour format with AM/PM, and format with seconds.
 * - Displays how different formats affect the display and input experience.
 * - Useful for understanding format flexibility and regional preferences.
 */
export const DifferentFormats: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-strong mb-4">24-hour format (HH:mm)</h3>
        <TimeRangeDemo
          format="HH:mm"
          startPlaceholder="09:00"
          endPlaceholder="17:00"
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("17:00")}
        />
      </div>

      <div>
        <h3 className="font-strong mb-4">12-hour format (h:mm a)</h3>
        <TimeRangeDemo
          format="h:mm a"
          locale={enUS}
          startPlaceholder="9:00 AM"
          endPlaceholder="5:00 PM"
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("17:00")}
        />
      </div>

      <div>
        <h3 className="font-strong mb-4">With seconds format (HH:mm:ss)</h3>
        <TimeRangeDemo
          format="HH:mm:ss"
          startPlaceholder="09:00:00"
          endPlaceholder="17:00:00"
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("17:00")}
        />
      </div>
    </div>
  ),
};

/**
 * Internationalization: Demonstrates comprehensive multi-language support.
 * - Shows TimeRangeInput working with Chinese, English, and Japanese locales.
 * - Displays locale-specific time formatting and placeholder text.
 * - Demonstrates proper duration display in multiple languages.
 */
export const Internationalization: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-strong mb-4">中文 (zh-CN)</h3>
        <TimeRangeDemo
          locale={zhCN}
          startPlaceholder="开始时间"
          endPlaceholder="结束时间"
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("17:30")}
        />
        <div className="text-body-small mt-2 text-gray-500">
          Duration display: 8h 30m
        </div>
      </div>

      <div>
        <h3 className="font-strong mb-4">English (en-US)</h3>
        <TimeRangeDemo
          locale={enUS}
          format="h:mm a"
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("17:30")}
        />
        <div className="text-body-small mt-2 text-gray-500">
          Duration display: 8h 30m
        </div>
      </div>

      <div>
        <h3 className="font-strong mb-4">日本語 (ja)</h3>
        <TimeRangeDemo
          locale={ja}
          startPlaceholder="開始時間"
          endPlaceholder="終了時間"
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("17:30")}
        />
        <div className="text-body-small mt-2 text-gray-500">
          Duration display: 8h 30m
        </div>
      </div>
    </div>
  ),
};

/**
 * CommonScenarios: Demonstrates real-world usage scenarios for TimeRangeInput.
 * - Shows work hours, lunch breaks, exercise time, and night shift examples.
 * - Displays practical applications with appropriate time ranges and contexts.
 * - Useful for understanding when and how to implement time range selection.
 */
export const CommonScenarios: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-strong mb-4">🏢 Work Time</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("18:00")}
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
        />
      </div>

      <div>
        <h3 className="font-strong mb-4">🍽️ Lunch Time</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("12:00")}
          endValue={timeStringToDate("13:00")}
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
        />
      </div>

      <div>
        <h3 className="font-strong mb-4">🏃‍♂️ Exercise Time</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("06:30")}
          endValue={timeStringToDate("07:30")}
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
        />
      </div>

      <div>
        <h3 className="font-strong mb-4">🌙 Night Shift Time</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("22:00")}
          endValue={timeStringToDate("06:00")}
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
        />
        <div className="text-body-small mt-2 text-gray-500">
          💡 Cross-day work, 8 hours
        </div>
      </div>
    </div>
  ),
};

/**
 * DurationOnly: Demonstrates time range duration calculation and display.
 * - Shows short duration (45 minutes), full hours (2 hours), and long duration (12 hours).
 * - Displays how the component calculates and presents time range durations.
 * - Useful for understanding duration formatting and time range analysis.
 */
export const DurationOnly: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-strong mb-4">Short Time Range</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("14:00")}
          endValue={timeStringToDate("14:45")}
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
        />
      </div>

      <div>
        <h3 className="font-strong mb-4">Full Hour Time Range</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("10:00")}
          endValue={timeStringToDate("12:00")}
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
        />
      </div>

      <div>
        <h3 className="font-strong mb-4">Long Time Range</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("08:00")}
          endValue={timeStringToDate("20:00")}
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
        />
      </div>
    </div>
  ),
};

/**
 * ReadOnly: Demonstrates the TimeRangeInput component in readOnly mode.
 * - Prevents value changes while allowing focus and selection
 * - Maintains normal visual appearance (unlike disabled)
 * - Useful for displaying non-editable time range information
 */
export const ReadOnly: Story = {
  render: function ReadOnlyStory() {
    const [startValue, setStartValue] = useState<Date | null>(
      timeStringToDate("09:00")
    );
    const [endValue, setEndValue] = useState<Date | null>(
      timeStringToDate("17:00")
    );
    const [changeCount, setChangeCount] = useState(0);

    const handleStartChange = (newValue: Date | null) => {
      setStartValue(newValue);
      setChangeCount((prev) => prev + 1);
    };

    const handleEndChange = (newValue: Date | null) => {
      setEndValue(newValue);
      setChangeCount((prev) => prev + 1);
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-stone-50 p-4">
          <div className="text-body-small-strong mb-2 text-stone-700">
            Current Start:
          </div>
          <div className="text-body-small font-mono text-stone-600">
            {startValue ? startValue.toLocaleTimeString() : "null"}
          </div>
          <div className="text-body-small-strong mt-2 text-stone-700">
            Current End:
          </div>
          <div className="text-body-small font-mono text-stone-600">
            {endValue ? endValue.toLocaleTimeString() : "null"}
          </div>
          <div className="text-body-small-strong mt-2 text-stone-700">
            Change Count:
          </div>
          <div className="text-body-small font-mono text-stone-600">
            {changeCount}
          </div>
        </div>
        <Panel.Row type="two-input-two-icon" className="w-96 px-0">
          <TimeRangeInput
            readOnly
            startValue={startValue}
            endValue={endValue}
            onStartChange={handleStartChange}
            onEndChange={handleEndChange}
          />
        </Panel.Row>
        <Panel.Row type="two-input-two-icon" className="w-96 px-0">
          <TimeRangeInput
            startValue={startValue}
            endValue={endValue}
            onStartChange={handleStartChange}
            onEndChange={handleEndChange}
          />
        </Panel.Row>
        <div className="text-body-small text-stone-600">
          💡 Try changing the readonly time range input - the values should not
          change and the change count should remain at 0. Only the normal input
          will change the values.
        </div>
      </div>
    );
  },
};
