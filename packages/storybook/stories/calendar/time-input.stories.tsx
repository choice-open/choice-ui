import {
  createTimeToday,
  Panel,
  Popover,
  Select,
  TimeCalendar,
  TimeInput,
  TimeRangeInput,
} from "@choiceform/design-system";
import { ActionWaitForSomeTime } from "@choiceform/icons-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { enUS } from "date-fns/locale";
import { useRef, useState } from "react";
import { useEventCallback } from "usehooks-ts";

const meta: Meta<typeof TimeInput> = {
  title: "DateAndTime/TimeInput",
  component: TimeInput,
  parameters: {
    layout: "centered",
  },
  tags: ["new", "autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础用法
export const Basic: Story = {
  render: (args) => <TimeInput {...args} />,
};

// 状态演示
export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <label className="font-strong mb-1 block">Normal</label>
        <TimeInput placeholder="Enter time..." />
      </div>

      <div>
        <label className="font-strong mb-1 block">Disabled</label>
        <TimeInput
          disabled
          value={createTimeToday(14, 30)}
          placeholder="Disabled state"
        />
      </div>

      <div>
        <label className="font-strong mb-1 block">Readonly</label>
        <TimeInput
          readOnly
          value={createTimeToday(14, 30)}
          placeholder="Readonly state"
        />
      </div>

      <div>
        <label className="font-strong mb-1 block">No prefix icon</label>
        <TimeInput prefixElement={null} placeholder="No icon" />
      </div>

      <div>
        <label className="font-strong mb-1 block">Custom prefix</label>
        <TimeInput
          prefixElement={
            <ActionWaitForSomeTime className="text-accent-foreground" />
          }
          placeholder="Custom prefix"
        />
      </div>
    </div>
  ),
};

/**
 * ReadOnly: Demonstrates the TimeInput component in readOnly mode.
 * - Prevents value changes while allowing focus and selection
 * - Maintains normal visual appearance (unlike disabled)
 * - Useful for displaying non-editable time information
 */
export const ReadOnly: Story = {
  render: function ReadOnlyStory() {
    const [value, setValue] = useState<Date | null>(createTimeToday(14, 30));
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
            {value ? value.toLocaleTimeString() : "null"}
          </div>
          <div className="text-body-small-strong mt-2 text-stone-700">
            Change Count:
          </div>
          <div className="text-body-small font-mono text-stone-600">
            {changeCount}
          </div>
        </div>
        <TimeInput
          readOnly
          value={value}
          onChange={handleChange}
          placeholder="Readonly time input..."
        />
        <TimeInput
          value={value}
          onChange={handleChange}
          placeholder="Normal time input..."
        />
        <div className="text-body-small text-stone-600">
          💡 Try changing the readonly time input - the value should not change
          and the change count should remain at 0. Only the normal input will
          change the value.
        </div>
      </div>
    );
  },
};

export const Size: Story = {
  render: function Render() {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div className="space-y-4">
        <TimeInput size="large" value={value} onChange={setValue} />
      </div>
    );
  },
};

export const Variable: Story = {
  render: function Render() {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div className="bg-gray-800 p-8">
        <TimeInput variant="dark" value={value} onChange={setValue} />
      </div>
    );
  },
};

// 键盘导航演示
export const KeyboardNavigation: Story = {
  render: function Render() {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div className="space-y-4">
        <TimeInput
          placeholder="Use keyboard to adjust time"
          value={value}
          onChange={setValue}
        />
        <div className="text-secondary-foreground space-y-2 rounded-md border p-2">
          <div className="font-strong">⌨️ Keyboard Navigation</div>
          <div>
            • <code>↑</code> / <code>↓</code> - Adjust 1 minute
          </div>
          <div>
            • <code>Shift + ↑/↓</code> - Adjust 15 minutes
          </div>
          <div>
            • <code>Alt + ↑/↓</code> - Adjust 1 hour
          </div>
          <div>
            • <code>Enter</code> - Confirm input
          </div>
        </div>
      </div>
    );
  },
};

// 拖拽交互演示
export const DragInteraction: Story = {
  render: function Render() {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div className="space-y-4">
        <TimeInput
          placeholder="Use drag to adjust time"
          value={value}
          onChange={setValue}
        />
        <div className="text-secondary-foreground space-y-2 rounded-md border p-2">
          <div className="font-strong">🖱️ Drag Interaction</div>
          <div>• Click and drag the clock icon to adjust time</div>
          <div>• Hold Shift key to drag 15 minutes</div>
          <div>• Hold Ctrl/Cmd key to drag 1 hour</div>
        </div>
      </div>
    );
  },
};

// 不同格式
export const Formats: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-strong mb-2">24-hour format (HH:mm)</h3>
        <TimeInput format="HH:mm" placeholder="14:30" />
      </div>

      <div>
        <h3 className="font-strong mb-2">12-hour format (h:mm a)</h3>
        <TimeInput format="h:mm a" placeholder="2:30 PM" locale={enUS} />
      </div>

      <div>
        <h3 className="font-strong mb-2">With seconds (HH:mm:ss)</h3>
        <TimeInput format="HH:mm:ss" placeholder="14:30:45" />
      </div>
    </div>
  ),
};

// 智能补全演示
export const SmartCompletion: Story = {
  args: {
    placeholder: "Try input: 9, 930, 2pm, 2pm...",
    format: "HH:mm",
  },
  render: (args) => (
    <div className="space-y-4">
      <TimeInput {...args} />
      <div className="text-secondary-foreground space-y-2 rounded-md border p-2">
        <div className="font-strong">💡 Smart Completion</div>
        <div>
          • <code>9</code> → 09:00
        </div>
        <div>
          • <code>930</code> → 09:30
        </div>
        <div>
          • <code>1430</code> → 14:30
        </div>
        <div>
          • <code>2pm</code> → 14:00
        </div>
        <div>
          • <code>9am</code> → 09:00
        </div>
        <div>
          • <code>下午2点</code> → 14:00
        </div>
      </div>
    </div>
  ),
};

// 时间范围限制
export const TimeRange: Story = {
  render: function RenderTimeRange() {
    const [workTime, setWorkTime] = useState<Date | null>(
      createTimeToday(12, 0)
    );
    const [afternoonTime, setAfternoonTime] = useState<Date | null>(
      createTimeToday(14, 0)
    );
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-strong mb-2">Work time (09:00 - 18:00)</h3>
          <TimeInput
            placeholder="Only select work time"
            minTime={createTimeToday(9, 0)}
            maxTime={createTimeToday(18, 0)}
            value={workTime}
            onChange={setWorkTime}
          />
        </div>

        <div>
          <h3 className="font-strong mb-2">Afternoon time (12:00 - 23:59)</h3>
          <TimeInput
            placeholder="Only select afternoon time"
            minTime={createTimeToday(12, 0)}
            maxTime={createTimeToday(23, 59)}
            value={afternoonTime}
            onChange={setAfternoonTime}
          />
        </div>
      </div>
    );
  },
};

// 自定义步长
export const CustomSteps: Story = {
  render: function RenderCustomSteps() {
    const [stepA, setStepA] = useState<Date | null>(createTimeToday(14, 30));
    const [stepB, setStepB] = useState<Date | null>(createTimeToday(14, 30));
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-strong mb-2">5-minute step</h3>
          <TimeInput
            placeholder="Adjust 5 minutes"
            step={5}
            shiftStep={30}
            value={stepA}
            onChange={setStepA}
          />
          <div className="mt-1 text-gray-500">
            ↑/↓ key adjust 5 minutes, Shift+↑/↓ adjust 30 minutes
          </div>
        </div>

        <div>
          <h3 className="font-strong mb-2">15-minute step</h3>
          <TimeInput
            placeholder="Adjust 15 minutes"
            step={15}
            shiftStep={60}
            value={stepB}
            onChange={setStepB}
          />
          <div className="mt-1 text-gray-500">
            ↑/↓ key adjust 15 minutes, Shift+↑/↓ adjust 60 minutes
          </div>
        </div>
      </div>
    );
  },
};

export const Combined: Story = {
  render: function RenderCombined() {
    const [activeInput, setActiveInput] = useState<
      "single" | "range-start" | "range-end" | null
    >(null);

    enum Format {
      HH_MM = "HH:mm",
      H_MM_A = "h:mm a",
    }

    const [format, setFormat] = useState<Format>(Format.HH_MM);
    const [value, setValue] = useState<Date | null>(createTimeToday(1, 30));
    const [startTime, setStartTime] = useState<Date | null>(
      createTimeToday(1, 30)
    );
    const [endTime, setEndTime] = useState<Date | null>(createTimeToday(2, 30));

    const [open, setOpen] = useState(false);
    const timeRef = useRef<HTMLFieldSetElement>(null);
    const rangeRef = useRef<HTMLFieldSetElement>(null);

    const currentTriggerRef = activeInput === "single" ? timeRef : rangeRef;
    const currentValue =
      activeInput === "single"
        ? value
        : activeInput === "range-start"
          ? startTime
          : activeInput === "range-end"
            ? endTime
            : null;

    const handleValueChange = useEventCallback((newDate: Date | null) => {
      if (activeInput === "single") {
        setValue(newDate);
        setOpen(false);
      } else if (activeInput === "range-start") {
        if (newDate) {
          const currentRange =
            startTime && endTime
              ? endTime.getTime() - startTime.getTime()
              : 1 * 60 * 60 * 1000;
          const newEnd = new Date(newDate.getTime() + currentRange);
          setStartTime(newDate);
          setEndTime(newEnd);
          console.log("🔥 Calendar start推动:", {
            newStart: newDate.toTimeString(),
            newEnd: newEnd.toTimeString(),
            rangeHours: currentRange / (60 * 60 * 1000),
          });
        } else {
          setStartTime(newDate);
        }
        setOpen(false);
      } else if (activeInput === "range-end") {
        if (newDate && startTime && newDate <= startTime) {
          setStartTime(newDate);
          console.log("🔥 Calendar end推动start:", newDate.toTimeString());
        }
        setEndTime(newDate);
        setOpen(false);
      }
    });

    return (
      <>
        <Panel className="w-80 rounded-xl border">
          <Panel.Title title="Select Time" />
          <Panel.Row>
            <Select
              value={format}
              onChange={(value) => setFormat(value as Format)}
            >
              <Select.Trigger className="[grid-area:input]">
                <Select.Value>
                  {format === Format.HH_MM
                    ? "24-hour format (HH:mm)"
                    : "12-hour format (h:mm a)"}
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Item value={Format.HH_MM}>
                  24-hour format (HH:mm)
                </Select.Item>
                <Select.Item value={Format.H_MM_A}>
                  12-hour format (h:mm a)
                </Select.Item>
              </Select.Content>
            </Select>
          </Panel.Row>
          <Panel.Row type="single" ref={timeRef} className="time-input">
            <TimeInput
              format={format}
              className="[grid-area:input]"
              value={value}
              onChange={setValue}
              onFocus={() => {
                setActiveInput("single");
                setOpen(true);
              }}
              step={15}
              onEnterKeyDown={() => setOpen(false)}
            />
          </Panel.Row>

          <Panel.Row
            className="time-range-input"
            type="two-input-two-icon"
            ref={rangeRef}
          >
            <TimeRangeInput
              format={format}
              startValue={startTime}
              endValue={endTime}
              onStartChange={(newStart) => {
                if (newStart) {
                  // 计算当前range长度（毫秒），fallback为1小时
                  const currentRange =
                    startTime && endTime
                      ? endTime.getTime() - startTime.getTime()
                      : 1 * 60 * 60 * 1000;
                  // 保持range长度
                  const newEnd = new Date(newStart.getTime() + currentRange);
                  setStartTime(newStart);
                  setEndTime(newEnd);
                } else {
                  setStartTime(newStart);
                }
              }}
              onEndChange={(newEnd) => {
                if (newEnd && startTime && newEnd <= startTime) {
                  // end <= start 时推动start
                  setStartTime(newEnd);
                }
                setEndTime(newEnd);
              }}
              onStartFocus={() => {
                setActiveInput("range-start");
                setOpen(true);
              }}
              onEndFocus={() => {
                setActiveInput("range-end");
                setOpen(true);
              }}
              onEnterKeyDown={() => setOpen(false)}
            />
          </Panel.Row>
        </Panel>
        <Popover
          interactions="focus"
          open={open}
          onOpenChange={setOpen}
          outsidePressIgnore={
            activeInput === "single" ? "time-input" : "time-range-input"
          }
          triggerRef={currentTriggerRef}
          placement="left-start"
          focusManagerProps={{
            initialFocus: -1,
            returnFocus: false,
          }}
        >
          <Popover.Content className="overflow-hidden">
            <TimeCalendar
              format={format}
              className="h-64"
              value={currentValue}
              onChange={handleValueChange}
            />
          </Popover.Content>
        </Popover>
      </>
    );
  },
};
