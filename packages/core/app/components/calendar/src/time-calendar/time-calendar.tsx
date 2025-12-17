import { Dropdown, DropdownProps } from "@choice-ui/dropdown"
import { MenuTrigger } from "@choice-ui/menus"
import { useMergedValue } from "@choice-ui/shared"
import { Check } from "@choiceform/icons-react"
import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import type { BaseTimeProps, StepProps } from "../types"
import { generateTimeOptions, normalizeTimeValue, timeStringToDate } from "../utils"

interface TimeCalendarComponentType extends React.MemoExoticComponent<React.FC<TimeCalendarProps>> {
  Trigger: typeof MenuTrigger
}

export interface TimeCalendarProps
  extends
    BaseTimeProps,
    StepProps,
    Pick<DropdownProps, "offset" | "placement" | "matchTriggerWidth" | "variant" | "readOnly"> {
  children?: React.ReactNode
  className?: string
  hourStep?: number
  minuteStep?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  closeOnSelect?: boolean
  triggerRef?: React.RefObject<HTMLElement>
  triggerSelector?: string
}

const TimeCalendarBase = memo(function TimeCalendar(props: TimeCalendarProps) {
  const {
    value,
    defaultValue,
    onChange,
    format: timeFormat = "HH:mm",
    step = 15,
    className,
    children,
    readOnly = false,
    open: controlledOpen,
    onOpenChange,
    closeOnSelect = true,
    triggerRef,
    triggerSelector,
    offset,
    placement,
    matchTriggerWidth,
    variant,
    ...rest
  } = props

  // Local open state for uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen ?? internalOpen

  const handleOpenChange = useEventCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  })

  // Use useMergedValue to manage controlled/uncontrolled state
  const [innerValue, setValue] = useMergedValue({
    value,
    defaultValue,
    onChange: onChange,
    allowEmpty: true,
  })

  // Generate time options - keep completely stable
  const timeOptions = useMemo(() => {
    return generateTimeOptions(timeFormat, step)
  }, [timeFormat, step])

  const normalizedTimeString = useMemo(() => {
    return normalizeTimeValue(innerValue)
  }, [innerValue])

  const formatTo12Hour = useCallback((timeStr: string): string => {
    const [hour, minute] = timeStr.split(":").map(Number)
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const ampm = hour < 12 ? "am" : "pm"
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`
  }, [])

  const customTimeOption = useMemo(() => {
    if (!normalizedTimeString) return null

    // Check if it is in the standard options
    const hasStandardOption = timeOptions.some((option) => option.value === normalizedTimeString)
    if (hasStandardOption) return null

    // Generate custom options
    const is12Hour = timeFormat.toLowerCase().includes("a") || timeFormat === "12h"
    return {
      value: normalizedTimeString,
      label: is12Hour ? formatTo12Hour(normalizedTimeString) : normalizedTimeString,
    }
  }, [normalizedTimeString, timeOptions, timeFormat, formatTo12Hour])

  const renderTimeLabel = useCallback(
    (label: string) => {
      // Check if it is 12 hour format
      const is12Hour = timeFormat.toLowerCase().includes("a") || timeFormat === "12h"
      if (is12Hour && label.includes(" ")) {
        const [timePart, ampmPart] = label.split(" ")
        return (
          <>
            <span>{timePart}</span>
            <span className="flex-1 text-right text-white/40">{ampmPart}</span>
          </>
        )
      }
      return label
    },
    [timeFormat],
  )

  // Check if we need divider between AM and PM
  const needsDivider = useMemo(() => {
    const is12Hour = timeFormat.toLowerCase().includes("a") || timeFormat === "12h"
    if (!is12Hour) return () => false

    return (index: number) => {
      return (
        index > 0 &&
        timeOptions[index].label.toLowerCase().includes("pm") &&
        timeOptions[index - 1].label.toLowerCase().includes("am")
      )
    }
  }, [timeFormat, timeOptions])

  // Create prefix element
  const createPrefixElement = useCallback((isSelected: boolean) => {
    return isSelected ? <Check /> : <></>
  }, [])

  // Scroll to selected item when menu opens
  useEffect(() => {
    if (!isOpen || !normalizedTimeString) return

    let attempts = 0
    const maxAttempts = 10

    const scrollToSelected = () => {
      const selectedItem = document.querySelector(
        `[data-testid="${normalizedTimeString}"]`,
      ) as HTMLElement | null

      if (selectedItem) {
        selectedItem.scrollIntoView({ block: "center" })
      } else if (attempts < maxAttempts) {
        attempts++
        requestAnimationFrame(scrollToSelected)
      }
    }

    requestAnimationFrame(scrollToSelected)
  }, [isOpen, normalizedTimeString])

  // Handle time selection
  const handleTimeSelect = useEventCallback((timeValue: string) => {
    if (readOnly) return

    // Convert time string to Date object
    const dateValue = timeStringToDate(timeValue)
    setValue(dateValue)

    // Close dropdown after selection
    if (closeOnSelect) {
      handleOpenChange(false)
    }
  })

  return (
    <Dropdown
      open={isOpen}
      onOpenChange={handleOpenChange}
      selection
      triggerRef={triggerRef}
      triggerSelector={triggerSelector}
      offset={offset}
      placement={placement}
      matchTriggerWidth={matchTriggerWidth}
      variant={variant}
      readOnly={readOnly}
      {...rest}
    >
      {/* Custom trigger from children */}
      {children}

      <Dropdown.Content className={className}>
        {/* Custom time item (if exists) */}
        {customTimeOption && (
          <>
            <Dropdown.Item
              onMouseUp={() => handleTimeSelect(customTimeOption.value)}
              prefixElement={createPrefixElement(normalizedTimeString === customTimeOption.value)}
              data-testid="custom-time-item"
            >
              {renderTimeLabel(customTimeOption.label)}
            </Dropdown.Item>
            <Dropdown.Divider data-testid="custom-time-divider" />
          </>
        )}

        {/* Standard time list */}
        {timeOptions.map((option, index) => {
          const isAmToPmTransition = needsDivider(index)
          const isSelected = normalizedTimeString === option.value

          return (
            <React.Fragment key={option.value}>
              {isAmToPmTransition && <Dropdown.Divider data-testid="ampm-divider" />}
              <Dropdown.Item
                onMouseUp={() => handleTimeSelect(option.value)}
                prefixElement={createPrefixElement(isSelected)}
                data-testid={option.value}
              >
                {renderTimeLabel(option.label)}
              </Dropdown.Item>
            </React.Fragment>
          )
        })}
      </Dropdown.Content>
    </Dropdown>
  )
})

TimeCalendarBase.displayName = "TimeCalendar"

// Export with static Trigger property
export const TimeCalendar = Object.assign(TimeCalendarBase, {
  Trigger: MenuTrigger,
}) as TimeCalendarComponentType
