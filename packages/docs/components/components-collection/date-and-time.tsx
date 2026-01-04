import { memo } from "react"
import {
  createTimeToday,
  DateInput,
  DateRangeInput,
  Menus,
  MonthCalendar,
  Panel,
  QuarterCalendar,
  TimeInput,
  TimeRangeInput,
  YearCalendar,
} from "../ui"
import { CollectionSection } from "./collection-section"
import { ComponentCard } from "./component-card"

export const DateAndTimeCollection = memo(function DateAndTimeCollection() {
  return (
    <CollectionSection
      title="Date & Time"
      description="Specialized inputs and calendars for selecting dates, times, and date ranges."
    >
      <ComponentCard
        title="Date Input"
        collection="date-and-time"
      >
        <DateInput
          value={new Date("2026-01-01")}
          onChange={() => {}}
        />
      </ComponentCard>
      <ComponentCard
        title="Date Range Input"
        collection="date-and-time"
      >
        <Panel.Row
          type="two-input-two-icon"
          className="w-[120%] scale-90 px-0"
        >
          <DateRangeInput
            startValue={new Date("2026-01-01")}
            endValue={new Date("2026-01-02")}
          />
        </Panel.Row>
      </ComponentCard>

      <ComponentCard
        title="Month Calendar"
        collection="date-and-time"
      >
        <MonthCalendar
          className="absolute top-0 w-full bg-transparent"
          value={new Date("2026-01-01")}
          onChange={() => {}}
          showOutsideDays={false}
        />
      </ComponentCard>

      <ComponentCard
        title="Time Input"
        collection="date-and-time"
      >
        <TimeInput
          value={createTimeToday(12, 0)}
          onChange={() => {}}
        />
      </ComponentCard>

      <ComponentCard
        title="Time Range Input"
        collection="date-and-time"
      >
        <Panel.Row
          type="two-input-two-icon"
          className="w-[120%] scale-90 px-0"
        >
          <TimeRangeInput
            startValue={createTimeToday(12, 0)}
            endValue={createTimeToday(14, 0)}
            onStartChange={() => {}}
            onEndChange={() => {}}
          />
        </Panel.Row>
      </ComponentCard>

      <ComponentCard
        title="Time Calendar"
        collection="date-and-time"
      >
        <Menus className="!z-2 scale-75">
          <Menus.Item>
            <Menus.Value>12:00</Menus.Value>
          </Menus.Item>
          <Menus.Item>
            <Menus.Value>13:00</Menus.Value>
          </Menus.Item>
          <Menus.Item>
            <Menus.Value>14:00</Menus.Value>
          </Menus.Item>
          <Menus.Item>
            <Menus.Value>15:00</Menus.Value>
          </Menus.Item>
          <Menus.Item>
            <Menus.Value>16:00</Menus.Value>
          </Menus.Item>
          <Menus.Item>
            <Menus.Value>17:00</Menus.Value>
          </Menus.Item>
          <Menus.Item>
            <Menus.Value>18:00</Menus.Value>
          </Menus.Item>
        </Menus>
      </ComponentCard>

      <ComponentCard
        title="Quarter Calendar"
        collection="date-and-time"
      >
        <QuarterCalendar
          className="w-full bg-transparent"
          value={{
            quarter: 1,
            year: 2026,
            label: "Q1 2026",
            months: ["January", "February", "March"],
          }}
          onChange={() => {}}
        />
      </ComponentCard>

      <ComponentCard
        title="Year Calendar"
        collection="date-and-time"
      >
        <YearCalendar
          className="w-full bg-transparent"
          value={new Date(2026, 0, 1)}
          onChange={() => {}}
        />
      </ComponentCard>
    </CollectionSection>
  )
})
