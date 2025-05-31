import { Check } from "@choiceform/icons-react"
import React, {
  HTMLProps,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { flushSync } from "react-dom"
import { useEventCallback } from "usehooks-ts"
import { useMergedValue } from "~/hooks"
import { MenuItem, MenusBase, MenuScrollArrow } from "../../menus"
import { convertToOriginalFormat, generateTimeOptions, normalizeValue } from "../utils"

export interface TimeCalendarProps
  extends Omit<HTMLProps<HTMLDivElement>, "value" | "defaultValue"> {
  children?: ReactNode
  defaultValue?: string | { hour: number; minute: number }
  format?: "12h" | "24h"
  onValueChange?: (value: string | { hour: number; minute: number }) => void
  selection?: boolean
  step?: number
  value?: string | { hour: number; minute: number }
}

export const TimeCalendar = memo(function TimeCalendar(props: TimeCalendarProps) {
  const {
    value,
    defaultValue,
    onValueChange,
    format = "24h",
    step = 15,
    selection = true,
    className,
    hourStep,
    minuteStep,
    ...rest
  } = props as TimeCalendarProps & { hourStep?: unknown; minuteStep?: unknown }

  // References
  const scrollRef = useRef<HTMLDivElement>(null)
  const elementsRef = useRef<Array<HTMLButtonElement | null>>([])
  const hasInitialScrolled = useRef(false)

  // Local state management
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false)

  // Use useMergedValue to manage controlled/uncontrolled state
  const [innerValue, setValue] = useMergedValue({
    value,
    defaultValue,
    onChange: onValueChange,
    allowEmpty: true,
  })

  // Convert current value to normalized string format
  const normalizedValue = useMemo(() => normalizeValue(innerValue), [innerValue])

  // Helper function to format time to 12h format
  const formatTo12Hour = (timeStr: string): string => {
    const [hour, minute] = timeStr.split(":").map(Number)
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const ampm = hour < 12 ? "AM" : "PM"
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`
  }

  // Helper function to render time label with proper formatting
  const renderTimeLabel = useCallback(
    (label: string) => {
      if (format === "12h" && label.includes(" ")) {
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
    [format],
  )

  // Generate time options
  const timeOptions = useMemo(() => {
    const standardOptions = generateTimeOptions(format, step)

    // If current value is not in standard options, add it to the beginning
    if (normalizedValue && !standardOptions.some((option) => option.value === normalizedValue)) {
      const customOption = {
        value: normalizedValue,
        label: format === "12h" ? formatTo12Hour(normalizedValue) : normalizedValue,
      }
      return [customOption, ...standardOptions]
    }

    return standardOptions
  }, [format, step, normalizedValue])

  // Find current selected index based on normalized value
  const selectedIndex = useMemo(() => {
    if (!normalizedValue) return null
    const index = timeOptions.findIndex((option) => option.value === normalizedValue)
    return index === -1 ? null : index
  }, [normalizedValue, timeOptions])

  // Create prefix element like DropdownItem does
  const createPrefixElement = useCallback(
    (isSelected: boolean) => {
      return selection ? isSelected ? <Check /> : <></> : undefined
    },
    [selection],
  )

  // Clear keyboard navigation flag after scrolling finishes
  useEffect(() => {
    if (isKeyboardNavigating) {
      const timer = setTimeout(() => {
        setIsKeyboardNavigating(false)
      }, 300) // Wait for smooth scroll to finish
      return () => clearTimeout(timer)
    }
  }, [isKeyboardNavigating])

  // Scroll handlers
  const handleArrowScroll = useEventCallback((amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop -= amount
      flushSync(() => setScrollTop(scrollRef.current?.scrollTop ?? 0))
    }
  })

  // Handle scroll events
  const handleScroll = useEventCallback(({ currentTarget }: React.UIEvent) => {
    flushSync(() => setScrollTop(currentTarget.scrollTop))
  })

  // Handle time selection
  const handleTimeSelect = useEventCallback((timeValue: string) => {
    // Convert back to the same format as the original input value
    const result = convertToOriginalFormat(timeValue, innerValue)
    setValue(result)
    setIsKeyboardNavigating(false)
  })

  // Handle mouse enter - but ignore during keyboard navigation
  const handleMouseEnter = useEventCallback((index: number) => {
    if (isKeyboardNavigating) {
      return
    }
    setActiveIndex(index)
  })

  // Handle mouse leave from container
  const handleMouseLeave = useEventCallback(() => {
    setActiveIndex(null)
  })

  // Handle click selection
  const handleClick = useEventCallback((timeValue: string) => {
    handleTimeSelect(timeValue)
  })

  // Handle key events
  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setIsKeyboardNavigating(true)
      setActiveIndex((prev) => {
        const next = prev === null ? 0 : Math.min(prev + 1, timeOptions.length - 1)
        // Scroll to active item
        requestAnimationFrame(() => {
          elementsRef.current[next]?.scrollIntoView({
            block: "nearest",
          })
        })
        return next
      })
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setIsKeyboardNavigating(true)
      setActiveIndex((prev) => {
        const next = prev === null ? timeOptions.length - 1 : Math.max(prev - 1, 0)
        // Scroll to active item
        requestAnimationFrame(() => {
          elementsRef.current[next]?.scrollIntoView({
            block: "nearest",
          })
        })
        return next
      })
    } else if (activeIndex !== null && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault()
      const selectedOption = timeOptions[activeIndex]
      if (selectedOption) {
        handleTimeSelect(selectedOption.value)
      }
    }
  })

  // Scroll to selected item when selectedIndex changes (like Dropdown)
  useEffect(() => {
    if (
      selectedIndex !== null &&
      scrollRef.current &&
      elementsRef.current[selectedIndex] &&
      !hasInitialScrolled.current
    ) {
      elementsRef.current[selectedIndex]?.scrollIntoView({
        block: "center",
        behavior: "auto",
      })
      hasInitialScrolled.current = true
    }
  }, [selectedIndex])

  return (
    <div
      className="relative"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <MenusBase
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseLeave={handleMouseLeave}
        className={className}
        {...rest}
      >
        {timeOptions.map((option, index) => (
          <MenuItem
            key={option.value}
            ref={(node) => {
              elementsRef.current[index] = node
            }}
            selected={selectedIndex === index}
            active={activeIndex === index}
            onClick={() => handleClick(option.value)}
            onMouseEnter={() => handleMouseEnter(index)}
            prefixElement={createPrefixElement(selectedIndex === index)}
          >
            {renderTimeLabel(option.label)}
          </MenuItem>
        ))}
      </MenusBase>

      {["up", "down"].map((dir) => (
        <MenuScrollArrow
          key={dir}
          dir={dir as "up" | "down"}
          scrollTop={scrollTop}
          scrollRef={scrollRef}
          innerOffset={0}
          isPositioned={true}
          onScroll={handleArrowScroll}
          onHide={() => {}}
        />
      ))}
    </div>
  )
})

TimeCalendar.displayName = "TimeCalendar"
