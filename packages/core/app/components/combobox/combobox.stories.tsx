import type { Meta, StoryObj } from "@storybook/react"
import React, { useMemo, useState } from "react"
import { Combobox } from "."
import { useEventCallback } from "usehooks-ts"

const meta: Meta<typeof Combobox> = {
  title: "Collections/Combobox",
  component: Combobox,
  tags: ["beta", "autodocs"],
}

export default meta
type Story = StoryObj<typeof Combobox>

// Sample data
const fruits = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
  "Kiwi",
  "Lemon",
  "Mango",
  "Orange",
  "Papaya",
  "Quince",
  "Raspberry",
  "Strawberry",
  "Tangerine",
  "Watermelon",
]

/**
 * Basic: Simple combobox with searchable fruit options.
 * - Type to filter the list
 * - Use arrow keys to navigate
 * - Press Enter or click to select
 * - Selected value appears in the input
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [value, setValue] = useState("")
    const [triggerType, setTriggerType] = useState<"click" | "focus" | "input">("input")

    const itemsToShow = useMemo(() => {
      if (triggerType === "click") {
        // 点击trigger时显示所有items
        return fruits
      }
      if (!value.trim()) {
        return []
      }
      // 输入或focus时显示过滤后的items
      return fruits.filter((fruit) => fruit.toLowerCase().startsWith(value.toLowerCase()))
    }, [value, triggerType])

    const handleChange = useEventCallback((newValue: string) => {
      setValue(newValue)
      setTriggerType("input")
    })

    const handleOpenChange = useEventCallback(
      (open: boolean, trigger: "click" | "focus" | "input" = "input") => {
        if (open) {
          setTriggerType(trigger)
        }
      },
    )

    return (
      <div className="w-64">
        <Combobox
          value={value}
          onChange={handleChange}
          onOpenChange={handleOpenChange}
        >
          <Combobox.Trigger placeholder="Search fruits..." />
          {itemsToShow.length > 0 && (
            <Combobox.Content>
              <>
                <Combobox.Label>Fruits</Combobox.Label>
                {itemsToShow.map((fruit) => (
                  <Combobox.Item
                    key={fruit}
                    onClick={() => setValue(fruit)}
                  >
                    <Combobox.Value>{fruit}</Combobox.Value>
                  </Combobox.Item>
                ))}
              </>
            </Combobox.Content>
          )}
        </Combobox>
      </div>
    )
  },
}

/**
 * Clearable: Combobox with clearable input.
 * - Shows clear button when value is not empty
 * - Clear button is hidden when value is empty
 */
export const Clearable: Story = {
  render: function ClearableStory() {
    const [value, setValue] = useState("")

    const filteredFruits = useMemo(() => {
      if (!value.trim()) return []
      return fruits.filter((fruit) => fruit.toLowerCase().startsWith(value.toLowerCase()))
    }, [value])

    return (
      <div className="w-64">
        <Combobox
          value={value}
          onChange={setValue}
        >
          <Combobox.Trigger
            showClear
            placeholder="Search fruits..."
          />
          {filteredFruits.length > 0 && (
            <Combobox.Content>
              <>
                <Combobox.Label>Fruits</Combobox.Label>
                {filteredFruits.map((fruit) => (
                  <Combobox.Item
                    key={fruit}
                    onClick={() => setValue(fruit)}
                  >
                    <Combobox.Value>{fruit}</Combobox.Value>
                  </Combobox.Item>
                ))}
              </>
            </Combobox.Content>
          )}
        </Combobox>
      </div>
    )
  },
}

/**
 * Controlled: Controlled combobox with external state management.
 * - Value is controlled by parent component
 * - Demonstrates integration with forms
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [selectedFruit, setSelectedFruit] = useState("Apple")
    const [searchValue, setSearchValue] = useState("")

    const filteredFruits = useMemo(() => {
      if (!searchValue.trim()) return []
      return fruits.filter((fruit) => fruit.toLowerCase().startsWith(searchValue.toLowerCase()))
    }, [searchValue])

    return (
      <div className="space-y-4">
        <div className="w-64">
          <Combobox
            value={searchValue}
            onChange={setSearchValue}
          >
            <Combobox.Trigger placeholder="Search fruits..." />
            <Combobox.Content>
              {filteredFruits.length > 0 ? (
                <>
                  <Combobox.Label>Available Fruits</Combobox.Label>
                  {filteredFruits.map((fruit) => (
                    <Combobox.Item
                      key={fruit}
                      onClick={() => {
                        setSelectedFruit(fruit)
                        setSearchValue(fruit)
                      }}
                    >
                      <Combobox.Value>{fruit}</Combobox.Value>
                    </Combobox.Item>
                  ))}
                </>
              ) : (
                <div className="p-4 text-center text-white/50">No matches found</div>
              )}
            </Combobox.Content>
          </Combobox>
        </div>

        <div className="text-secondary-foreground">
          <div>
            Selected fruit: <strong>{selectedFruit}</strong>
          </div>
          <div>
            Search value: <strong>{searchValue || "(empty)"}</strong>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Empty: Combobox with no initial value.
 * - Shows placeholder text
 * - All options visible when opened
 */
export const Empty: Story = {
  render: function EmptyStory() {
    const [value, setValue] = useState("")

    const filteredFruits = useMemo(() => {
      if (!value.trim()) return []
      return fruits.filter((fruit) => fruit.toLowerCase().startsWith(value.toLowerCase()))
    }, [value])

    return (
      <div className="w-64">
        <Combobox
          value={value}
          onChange={setValue}
        >
          <Combobox.Trigger placeholder="Choose a fruit..." />
          <Combobox.Content>
            <Combobox.Label>Popular Fruits</Combobox.Label>
            {filteredFruits.map((fruit) => (
              <Combobox.Item
                key={fruit}
                onClick={() => setValue(fruit)}
              >
                <Combobox.Value>{fruit}</Combobox.Value>
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox>
      </div>
    )
  },
}

/**
 * Large: Large size variant of the combobox.
 * - Increased padding and font size
 * - Better for touch interfaces
 */
export const Large: Story = {
  render: function LargeStory() {
    const [value, setValue] = useState("")

    const filteredFruits = useMemo(() => {
      if (!value.trim()) return []
      return fruits.filter((fruit) => fruit.toLowerCase().startsWith(value.toLowerCase()))
    }, [value])

    return (
      <div className="w-80">
        <Combobox
          value={value}
          onChange={setValue}
        >
          <Combobox.Trigger
            placeholder="Search fruits..."
            size="large"
          />
          <Combobox.Content>
            <Combobox.Label>Fruits</Combobox.Label>
            {filteredFruits.map((fruit) => (
              <Combobox.Item
                key={fruit}
                size="large"
                onClick={() => setValue(fruit)}
              >
                <Combobox.Value>{fruit}</Combobox.Value>
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox>
      </div>
    )
  },
}

/**
 * Disabled: Disabled combobox state.
 * - Input and interactions are disabled
 * - Visual feedback for unavailable state
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    return (
      <div className="w-64">
        <Combobox disabled>
          <Combobox.Trigger
            placeholder="Disabled combobox..."
            value="Apple"
          />
          <Combobox.Content>
            <Combobox.Item>
              <Combobox.Value>Apple</Combobox.Value>
            </Combobox.Item>
          </Combobox.Content>
        </Combobox>
      </div>
    )
  },
}

/**
 * LongList: Combobox with many options demonstrating scrolling.
 * - Generated list of countries
 * - Efficient filtering
 * - Scroll behavior in dropdown
 */
export const LongList: Story = {
  render: function LongListStory() {
    const [value, setValue] = useState("")

    const countries = useMemo(
      () => Array.from({ length: 100 }, (_, index) => `Option ${index + 1}`),
      [],
    )

    const filteredCountries = useMemo(() => {
      if (!value.trim()) return []
      return countries
        .filter((country) => country.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 50) // Limit results for performance
    }, [value, countries])

    return (
      <div className="w-64">
        <Combobox
          value={value}
          onChange={setValue}
        >
          <Combobox.Trigger placeholder="Search countries..." />
          <Combobox.Content>
            <Combobox.Label>
              Countries ({filteredCountries.length} {!value ? "shown" : "found"})
            </Combobox.Label>
            {filteredCountries.map((country, index) => (
              <Combobox.Item
                key={`${country}-${index}`}
                onClick={() => setValue(country)}
              >
                <Combobox.Value>{country}</Combobox.Value>
              </Combobox.Item>
            ))}
            {filteredCountries.length === 0 && value && (
              <div className="p-4 text-center text-white/50">
                No countries found for &ldquo;{value}&rdquo;
              </div>
            )}
          </Combobox.Content>
        </Combobox>
      </div>
    )
  },
}

/**
 * CustomWidth: Combobox with custom width that doesn't match trigger.
 * - Dropdown width independent of trigger
 * - Useful for compact triggers with wider options
 */
export const CustomWidth: Story = {
  render: function CustomWidthStory() {
    const [value, setValue] = useState("")

    const filteredFruits = useMemo(() => {
      if (!value.trim()) return []
      return fruits.filter((fruit) => fruit.toLowerCase().startsWith(value.toLowerCase()))
    }, [value])

    return (
      <div className="w-48">
        <Combobox
          value={value}
          onChange={setValue}
          matchTriggerWidth={false}
        >
          <Combobox.Trigger placeholder="Fruit..." />
          <Combobox.Content className="w-80">
            <Combobox.Label>Available Fruits (Custom Width)</Combobox.Label>
            {filteredFruits.map((fruit) => (
              <Combobox.Item
                key={fruit}
                onClick={() => setValue(fruit)}
              >
                <Combobox.Value>{fruit}</Combobox.Value>
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox>
      </div>
    )
  },
}
