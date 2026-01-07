import type {
  EffectItem,
  EffectStyle,
  LibrariesDisplayType,
  LibrariesType,
  PaintStyle,
  RGB,
  RGBA,
  SolidFillItem,
  Style,
  TextStyle,
  Variable,
} from "@choice-ui/react"
import {
  BLACK_RGBA,
  Button,
  ColorSwatch,
  Dropdown,
  IconButton,
  Libraries,
  Popover,
  Select,
  tcx,
} from "@choice-ui/react"
import { Add, HyperlinkBroken } from "@choiceform/icons-react"
import { faker } from "@faker-js/faker"
import { Meta, StoryObj } from "@storybook/react"
import { round } from "es-toolkit"
import React, { CSSProperties, memo, useCallback, useEffect, useMemo, useState } from "react"
import tinycolor from "tinycolor2"
import { useEventCallback } from "usehooks-ts"

const meta: Meta<typeof Libraries> = {
  title: "Colors/Libraries",
  component: Libraries,
}

export default meta
type Story = StoryObj<typeof Libraries>

const MOCK_COLOR_VARIABLE = (): Variable => ({
  id: faker.string.uuid(),
  value: {
    r: faker.number.int({ min: 0, max: 255 }),
    g: faker.number.int({ min: 0, max: 255 }),
    b: faker.number.int({ min: 0, max: 255 }),
    a: faker.number.float({ min: 0, max: 1, precision: 0.01 }),
  },
  name: faker.music.songName(),
  masterId: `${faker.helpers.arrayElement(["Google", "Facebook", "Apple"])}/${faker.helpers.arrayElement(
    ["Primary", "Secondary", "Tertiary"],
  )}`,
  type: "color",
  createdAt: faker.date.recent().getTime(),
  updatedAt: faker.date.recent().getTime(),
})

const MOCK_COLOR_STYLE = (): Style => ({
  id: faker.string.uuid(),
  name: faker.music.songName(),
  description: faker.lorem.sentence(),
  fileId: `${faker.helpers.arrayElement(["Google", "Facebook", "Apple"])}/${faker.helpers.arrayElement(
    ["Primary", "Secondary", "Tertiary"],
  )}`,
  type: "PAINT",
  fills: [
    {
      type: "SOLID",
      visible: true,
      color: {
        r: faker.number.int({ min: 0, max: 255 }),
        g: faker.number.int({ min: 0, max: 255 }),
        b: faker.number.int({ min: 0, max: 255 }),
        a: faker.number.float({ min: 0, max: 1, precision: 0.01 }),
      } as RGBA,
      index: String(faker.number.int()),
      isVariable: true,
      opacity: 1,
    },
  ],
  index: String(faker.number.int()),
  consumers: [],
  createdAt: faker.date.recent().getTime(),
  updatedAt: faker.date.recent().getTime(),
})

const MOCK_NUMBER_VARIABLE = (): Variable => ({
  id: faker.string.uuid(),
  value: faker.number.int({ min: 0, max: 1000 }),
  name: faker.person.firstName(),
  masterId: `${faker.helpers.arrayElement(["System", "User"])}`,
  type: "number",
  createdAt: faker.date.recent().getTime(),
  updatedAt: faker.date.recent().getTime(),
})

const MOCK_BOOLEAN_VARIABLE = (): Variable => ({
  id: faker.string.uuid(),
  value: faker.datatype.boolean(),
  name: faker.person.firstName(),
  masterId: `${faker.helpers.arrayElement(["System", "User"])}`,
  type: "boolean",
  createdAt: faker.date.recent().getTime(),
  updatedAt: faker.date.recent().getTime(),
})

const MOCK_STRING_VARIABLE = (): Variable => ({
  id: faker.string.uuid(),
  value: faker.music.genre(),
  name: faker.person.firstName(),
  masterId: `${faker.helpers.arrayElement(["System", "User"])}`,
  type: "string",
  createdAt: faker.date.recent().getTime(),
  updatedAt: faker.date.recent().getTime(),
})

const MOCK_ENUM_VARIABLE = (): Variable => ({
  id: faker.string.uuid(),
  value: faker.helpers.arrayElement(["Option 1", "Option 2", "Option 3"]),
  options: Array.from({ length: 10 }, () => ({
    value: faker.lorem.word(),
    id: faker.string.uuid(),
  })),
  name: faker.person.firstName(),
  masterId: `${faker.helpers.arrayElement(["System", "User"])}`,
  type: "enum",
  createdAt: faker.date.recent().getTime(),
  updatedAt: faker.date.recent().getTime(),
})

const MOCK_TEXT_STYLE = (): Style => ({
  id: faker.string.uuid(),
  name: faker.music.songName(),
  description: faker.lorem.sentence(),
  fileId: `${faker.helpers.arrayElement(["System", "User"])}`,
  type: "TEXT",
  fontName: faker.helpers.arrayElement([
    {
      family: "Arial",
      style: "regular",
    },
    {
      family: "Helvetica",
      style: "regular",
    },
    {
      family: "Times New Roman",
      style: "regular",
    },
    {
      family: "Georgia",
      style: "regular",
    },
    {
      family: "Courier",
      style: "regular",
    },
  ]),

  fontSize: faker.number.int({ min: 10, max: 32 }),
  textDecoration: faker.helpers.arrayElement(["none", "underline", "line-through"]),
  textCase: faker.helpers.arrayElement(["none", "uppercase", "lowercase", "capitalize"]),
  lineHeight: {
    number: faker.helpers.arrayElement([0, 10, 12, 14, 16, 18, 20, 24, 32, 40, 48, 56]),
    unit: "px",
  },
  paragraphSpacing: faker.number.int({ min: 0, max: 10 }),
  letterSpacing: {
    number: faker.number.int({ min: 0, max: 10 }),
    unit: "px",
  },
  index: String(faker.number.int()),
  consumers: [],
  createdAt: faker.date.recent().getTime(),
  updatedAt: faker.date.recent().getTime(),
})

const MOCK_EFFECT_STYLE = (): EffectStyle => ({
  id: faker.string.uuid(),
  name: faker.music.genre(),
  description: faker.lorem.sentence(),
  fileId: `${faker.helpers.arrayElement(["System", "User"])}`,
  type: "EFFECT",
  effects: faker.helpers.arrayElement([
    [
      {
        type: "DROP_SHADOW",
        index: "a0",
        color: BLACK_RGBA,
        visible: true,
        offset: {
          x: faker.number.int({ min: -10, max: 10 }),
          y: faker.number.int({ min: -10, max: 10 }),
        },
        radius: faker.number.int({ min: 0, max: 10 }),
        spread: faker.number.int({ min: 0, max: 10 }),
      },
    ] as EffectItem[],
    [
      {
        type: "INNER_SHADOW",
        index: "a0",
        color: BLACK_RGBA,
        visible: true,
        offset: {
          x: faker.number.int({ min: -10, max: 10 }),
          y: faker.number.int({ min: -10, max: 10 }),
        },
        radius: faker.number.int({ min: 0, max: 10 }),
        spread: faker.number.int({ min: 0, max: 10 }),
      },
    ] as EffectItem[],
    [
      {
        type: "BACKGROUND_BLUR",
        index: "a0",
        color: BLACK_RGBA,
        visible: true,
        offset: {
          x: faker.number.int({ min: -10, max: 10 }),
          y: faker.number.int({ min: -10, max: 10 }),
        },
        radius: faker.number.int({ min: 0, max: 10 }),
        spread: faker.number.int({ min: 0, max: 10 }),
      },
    ] as EffectItem[],
    [
      {
        type: "FOREGROUND_BLUR",
        color: BLACK_RGBA,
        index: "a0",
        visible: true,
        offset: {
          x: faker.number.int({ min: -10, max: 10 }),
          y: faker.number.int({ min: -10, max: 10 }),
        },
        radius: faker.number.int({ min: 0, max: 10 }),
        spread: faker.number.int({ min: 0, max: 10 }),
      },
    ] as EffectItem[],
  ]),
  index: String(faker.number.int()),
  consumers: [],
  createdAt: faker.date.recent().getTime(),
  updatedAt: faker.date.recent().getTime(),
})

const SolidString = ({
  color,
  alpha,
  category,
  type,
}: {
  alpha: number
  category?: string
  color: {
    b: number
    g: number
    r: number
  }
  type: LibrariesType
}) => {
  return (
    <div className="z-10 min-w-0 rounded-lg bg-white/50 p-3 text-center font-mono">
      {type === "VARIABLE" ? "Variable" : "Style"} / {category ? `${category} / ` : ""}rgba(
      {color.r} {color.g} {color.b} / {round(alpha, 2)})
    </div>
  )
}

// Constants for preview components
const PREVIEW_CONTAINER_CLASS = "rounded-md grid aspect-square size-54 place-items-center"
const PREVIEW_TEXT_CLASS = "text-heading-display"

const BasePreview = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={PREVIEW_CONTAINER_CLASS}>
      <h1 className={PREVIEW_TEXT_CLASS}>{children}</h1>
    </div>
  )
}
BasePreview.displayName = "BasePreview"

const ColorPreview = memo(
  ({ color, alpha, type }: { alpha?: number; color?: RGB; type?: LibrariesType }) => {
    if (!color) return null
    return (
      <ColorSwatch
        color={color}
        alpha={alpha ?? 1}
        size={32}
        type={type}
        className={tcx("size-48!", type === "VARIABLE" ? "rounded-md" : "rounded-full")}
      />
    )
  },
)
ColorPreview.displayName = "ColorPreview"

const NumberPreview = memo(({ value }: { value?: number }) => {
  if (typeof value !== "number") return null
  return <BasePreview>{value}</BasePreview>
})
NumberPreview.displayName = "NumberPreview"

const StringPreview = memo(({ value }: { value?: string }) => {
  if (!value) return null
  return <BasePreview>{value}</BasePreview>
})
StringPreview.displayName = "StringPreview"

const BooleanPreview = memo(({ value }: { value?: boolean }) => {
  if (typeof value !== "boolean") return null
  return <BasePreview>{value ? "true" : "false"}</BasePreview>
})
BooleanPreview.displayName = "BooleanPreview"

const EnumPreview = memo(({ value }: { value?: string }) => {
  if (!value) return null
  return <BasePreview>{value}</BasePreview>
})
EnumPreview.displayName = "EnumPreview"

const TextPreview = memo(({ value }: { value?: TextStyle }) => {
  const style: CSSProperties = useMemo(() => {
    if (!value) return {}
    const {
      fontSize,
      textDecoration,
      fontName: { family, style },
      letterSpacing,
    } = value

    return {
      fontSize: fontSize,
      fontFamily: family,
      fontWeight: style,
      textDecoration: textDecoration,
      letterSpacing: letterSpacing.number,
    }
  }, [value])

  if (!value) return null
  return (
    <div className={PREVIEW_CONTAINER_CLASS}>
      <h1 style={style}>Ag</h1>
    </div>
  )
})
TextPreview.displayName = "TextPreview"

const EffectPreview = memo(({ value }: { value?: EffectStyle }) => {
  const effectText = useMemo(() => {
    if (!value?.effects?.[0]) return null
    const effectType = value.effects[0].type
    switch (effectType) {
      case "DROP_SHADOW":
        return "Drop Shadow"
      case "INNER_SHADOW":
        return "Inner Shadow"
      case "BACKGROUND_BLUR":
        return "Background Blur"
      case "FOREGROUND_BLUR":
        return "Foreground Blur"
      default:
        return null
    }
  }, [value])

  if (!effectText) return null
  return <BasePreview>{effectText}</BasePreview>
})
EffectPreview.displayName = "EffectPreview"

// Type definitions for Control props
interface ControlProps {
  boolean?: { value: boolean }
  colors?: { alpha: number; color: RGB; type: LibrariesType }
  effect?: { value: EffectStyle }
  enumValue?: { value: string }
  number?: { value: number }
  setLibraries: (libraries: { styles?: Style[]; variables?: Variable[] }) => void
  string?: { value: string }
  text?: { value: TextStyle }
}

const DEFAULT_TEXT_STYLE: TextStyle = {
  id: "text-style-1",
  type: "TEXT",
  fileId: "System/Text",
  index: "1",
  consumers: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  fontName: {
    family: "Arial",
    style: "regular",
  },
  fontSize: 16,
  textDecoration: "none",
  textCase: "none",
  lineHeight: {
    number: 1,
    unit: "px",
  },
  paragraphSpacing: 0,
  letterSpacing: {
    number: 0,
    unit: "px",
  },
}

const DEFAULT_COLORS = {
  color: { r: 0, g: 0, b: 0 },
  alpha: 1,
  type: "VARIABLE" as LibrariesType,
}

const Control = memo(
  ({
    setLibraries,
    colors = DEFAULT_COLORS,
    number = { value: 0 },
    boolean = { value: false },
    string = { value: "" },
    enumValue = { value: "" },
    text = { value: DEFAULT_TEXT_STYLE },
    effect = { value: MOCK_EFFECT_STYLE() },
  }: ControlProps) => {
    const [type, setType] = useState<Variable["type"] | Style["type"]>("color")

    const libraryOptions = useMemo(
      () => [
        { label: "Color", value: "color" },
        { divider: true },
        { label: "Number", value: "number" },
        { label: "Boolean", value: "boolean" },
        { label: "String", value: "string" },
        { label: "Enum", value: "enum" },
        { divider: true },
        { label: "Text", value: "TEXT" },
        { label: "Effect", value: "EFFECT" },
      ],
      [],
    )

    useEffect(() => {
      const generateLibraries = () => {
        switch (type) {
          case "color":
            return {
              variables: Array.from({ length: 20 }, MOCK_COLOR_VARIABLE),
              styles: Array.from({ length: 20 }, MOCK_COLOR_STYLE),
            }
          case "number":
            return { variables: Array.from({ length: 20 }, MOCK_NUMBER_VARIABLE), styles: [] }
          case "boolean":
            return { variables: Array.from({ length: 20 }, MOCK_BOOLEAN_VARIABLE), styles: [] }
          case "string":
            return { variables: Array.from({ length: 20 }, MOCK_STRING_VARIABLE), styles: [] }
          case "enum":
            return { variables: Array.from({ length: 20 }, MOCK_ENUM_VARIABLE), styles: [] }
          case "TEXT":
            return { variables: [], styles: Array.from({ length: 20 }, MOCK_TEXT_STYLE) }
          case "EFFECT":
            return { variables: [], styles: Array.from({ length: 20 }, MOCK_EFFECT_STYLE) }
          default:
            return { variables: [], styles: [] }
        }
      }

      setLibraries(generateLibraries())
    }, [type, setLibraries])

    const preview = useMemo(() => {
      switch (type) {
        case "color":
          return (
            <ColorPreview
              color={colors?.color}
              alpha={colors?.alpha}
              type={colors?.type}
            />
          )
        case "number":
          return <NumberPreview value={number?.value} />
        case "boolean":
          return <BooleanPreview value={boolean?.value} />
        case "string":
          return <StringPreview value={string?.value} />
        case "enum":
          return <EnumPreview value={enumValue?.value} />
        case "TEXT":
          return <TextPreview value={text?.value} />
        case "EFFECT":
          return <EffectPreview value={effect?.value} />
        default:
          return null
      }
    }, [type, colors, number, boolean, string, enumValue, text, effect])

    const handleTypeChange = useCallback((value: string) => {
      setType(value as Variable["type"] | Style["type"])
    }, [])

    return (
      <div className="bg-default-background flex flex-col gap-2 rounded-lg p-4 shadow-lg">
        <span className="font-strong">Choose Library Type</span>
        <Select
          value={type}
          onChange={handleTypeChange}
        >
          <Select.Trigger>
            <span className="flex-1 truncate">{type}</span>
          </Select.Trigger>
          <Select.Content>
            {libraryOptions.map((option) =>
              option.divider ? (
                <Select.Divider key={`divider-${option.value}`} />
              ) : (
                <Select.Item
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Select.Item>
              ),
            )}
          </Select.Content>
        </Select>
        <div className="bg-secondary-background rounded-md">{preview}</div>
      </div>
    )
  },
)
Control.displayName = "Control"

const LibrariesPopover = ({
  children,
  header,
}: {
  children: React.ReactNode
  header: React.ReactNode
}) => {
  return (
    <Popover
      open={true}
      placement="left"
      draggable
      rememberPosition
    >
      <Popover.Trigger>
        <div className="pointer-events-none absolute right-1/2" />
      </Popover.Trigger>
      <Popover.Header title="Libraries" />
      <Popover.Content>
        <div className="p-0">{children}</div>
      </Popover.Content>
    </Popover>
  )
}

const RandomButtons = ({
  libraries,
  setSelectedItem,
  bindingItem,
  setBindingItem,
}: {
  bindingItem: { item: Variable | Style; type: LibrariesType } | null
  libraries: { styles?: Style[]; variables?: Variable[] } | null
  setBindingItem: (item: { item: Variable | Style; type: LibrariesType } | null) => void
  setSelectedItem: (item: { item: Variable | Style; type: LibrariesType } | null) => void
}) => {
  // 获取当前绑定项的颜色
  const getHexColor = () => {
    const boundItem = bindingItem
    if (!boundItem) return ""

    const color =
      boundItem.type === "VARIABLE"
        ? ((boundItem.item as Variable).value as RGB)
        : (((boundItem.item as PaintStyle).fills[0] as SolidFillItem)?.color as RGB)

    const alpha =
      boundItem.type === "VARIABLE"
        ? ((boundItem.item as Variable).value as RGBA).a || 1
        : (((boundItem.item as PaintStyle).fills[0] as SolidFillItem).color as RGBA).a || 1

    if (!color) return ""

    return tinycolor({ r: color.r, g: color.g, b: color.b, a: alpha })
      .toHexString()
      .toUpperCase()
      .replace("#", "")
  }

  return (
    <div className="flex items-center gap-1 border-t p-3">
      <Button
        onClick={() => {
          // 随机选择变量或样式
          const variables = libraries?.variables || []
          const styles = libraries?.styles || []
          const allItems = [
            ...variables.map((item) => ({ type: "VARIABLE" as const, item })),
            ...styles.map((item) => ({ type: "STYLE" as const, item })),
          ]

          if (allItems.length > 0) {
            const randomItem = allItems[Math.floor(Math.random() * allItems.length)]
            setSelectedItem(randomItem)
            setBindingItem(randomItem)
          }
        }}
      >
        {bindingItem ? (
          <ColorSwatch
            color={
              bindingItem.type === "VARIABLE"
                ? ((bindingItem.item as Variable).value as RGB)
                : (((bindingItem.item as PaintStyle).fills[0] as SolidFillItem).color as RGB)
            }
            alpha={
              bindingItem.type === "VARIABLE"
                ? ((bindingItem.item as Variable).value as RGBA).a || 1
                : (((bindingItem.item as PaintStyle).fills[0] as SolidFillItem).color as RGBA).a ||
                  1
            }
            className={bindingItem.type === "VARIABLE" ? "rounded-sm" : "rounded-full"}
            type={bindingItem.type === "STYLE" ? "STYLE" : undefined}
          />
        ) : (
          <div className="bg-tertiary-background size-3.5 rounded-sm" />
        )}
        <span>{bindingItem ? getHexColor() : "Select Random Item"}</span>
      </Button>

      {bindingItem && (
        <IconButton
          onClick={() => {
            setBindingItem(null)
            setSelectedItem(null)
          }}
        >
          <HyperlinkBroken />
        </IconButton>
      )}
    </div>
  )
}

const AddLibraryItem = ({
  handleAddVariable,
  handleAddStyle,
}: {
  handleAddStyle: () => void
  handleAddVariable: () => void
}) => {
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <IconButton aria-label="Add library item">
          <Add />
        </IconButton>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onClick={handleAddVariable}>Add Variable</Dropdown.Item>
        <Dropdown.Item onClick={handleAddStyle}>Add Style</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  )
}

const getPreviewProps = (
  selectedItem: { item: Variable | Style; type: LibrariesType } | null,
  setLibraries: (libraries: { styles?: Style[]; variables?: Variable[] }) => void,
) => {
  if (!selectedItem) return { setLibraries }

  // Handle variables
  if (selectedItem.type === "VARIABLE" && "value" in selectedItem.item) {
    const value = selectedItem.item.value
    const type = selectedItem.item.type

    // Handle color variable
    if (
      type === "color" &&
      typeof value === "object" &&
      "r" in value &&
      "g" in value &&
      "b" in value
    ) {
      return {
        setLibraries,
        colors: {
          color: {
            r: Number(value.r),
            g: Number(value.g),
            b: Number(value.b),
          },
          alpha: "a" in value && typeof value.a === "number" ? value.a : 1,
          type: selectedItem.type,
        },
      }
    }
    // Handle number variable
    else if (type === "number" && typeof value === "number") {
      return {
        setLibraries,
        number: { value },
      }
    }
    // Handle boolean variable
    else if (type === "boolean" && typeof value === "boolean") {
      return {
        setLibraries,
        boolean: { value },
      }
    }
    // Handle string variable
    else if (type === "string" && typeof value === "string") {
      return {
        setLibraries,
        string: { value },
      }
    }
    // Handle enum variable
    else if (type === "enum") {
      return {
        setLibraries,
        enumValue: { value: value as string },
      }
    }
  }
  // Handle styles
  else if (selectedItem.type === "STYLE") {
    const style = selectedItem.item

    // Handle paint style
    if (style.type === "PAINT" && "fills" in style && (style.fills?.[0] as SolidFillItem)?.color) {
      const color = (style.fills[0] as SolidFillItem).color as RGBA
      return {
        setLibraries,
        colors: {
          color: {
            r: Number(color.r),
            g: Number(color.g),
            b: Number(color.b),
          },
          alpha: color.a ?? 1,
          type: selectedItem.type,
        },
      }
    }
    // Handle text style
    else if (style.type === "TEXT") {
      return {
        setLibraries,
        text: { value: style as TextStyle },
      }
    }
    // Handle effect style
    else if (style.type === "EFFECT") {
      return {
        setLibraries,
        effect: { value: style as EffectStyle },
      }
    }
  }
  return { setLibraries }
}

/**
 * `IfLibraries` is a comprehensive design system management component that provides a unified interface
 * for handling both variables and styles across different types.
 *
 * ### Core Features
 *
 * #### Variable System
 * - Multiple variable types support:
 *   - Color (RGB/RGBA)
 *   - Number
 *   - Boolean
 *   - String
 *   - Enum
 * - Control key bindings for UI behaviors:
 *   - Overflow
 *   - Blending Mode
 *   - Pointer Events
 *   - User Select
 *   - Scrollbars
 *   - Cursor
 *
 * #### Style System
 * - Multiple style types support:
 *   - Paint Styles (fills, colors)
 *   - Text Styles (font, typography)
 *   - Effect Styles (shadows, blurs)
 * - Style properties:
 *   - File organization
 *   - Consumer tracking
 *   - Metadata management
 *
 * #### Library Management
 * - Unified management of variables and styles
 * - Hierarchical category organization
 * - Support for both list and grid display modes
 * - Dynamic search and filtering capabilities
 * - Component variable support
 * - Reference tracking system
 *
 * #### User Interface
 * - Drag-and-drop interface for organization
 * - Visual previews for different types
 * - Detailed information display
 * - Interactive selection and binding
 * - Real-time synchronization
 *
 * ### Use Cases
 *
 * 1. Design System Management
 *    - Variable and style centralization
 *    - Design token management
 *    - Component theming
 *    - Style guide maintenance
 *
 * 2. Component Configuration
 *    - Property binding
 *    - State management
 *    - Interaction control
 *    - Variant management
 *
 * 3. Asset Organization
 *    - Design token categorization
 *    - Style hierarchy management
 *    - Reference tracking
 *    - Version control support
 *
 * ### Component States
 *
 * - Display Types: List/Grid views
 * - Selection States: Active/Selected/Disabled
 * - Binding States: Bound/Unbound items
 * - Category States: All/Filtered views
 * - Component States: Normal/Component mode
 *
 * ### Integration Points
 *
 * - Variables System
 *   - Design token management
 *   - Property control
 *   - State binding
 *
 * - Styles System
 *   - Visual styling
 *   - Typography management
 *   - Effect configuration
 *
 * - Component System
 *   - Variant management
 *   - Property binding
 *   - State synchronization
 *
 * - Design System
 *   - Token management
 *   - Style organization
 *   - Asset versioning
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [color, setColor] = useState<RGB | undefined>(undefined)
    const [alpha, setAlpha] = useState<number>(1)

    const [libraries, setLibraries] = useState<{ styles?: Style[]; variables?: Variable[] } | null>(
      null,
    )

    const [displayType, setDisplayType] = useState<LibrariesDisplayType>("LIST")
    const [category, setCategory] = useState("all")
    const [selectedItem, setSelectedItem] = useState<{
      item: Variable | Style
      type: LibrariesType
    } | null>(null)

    const [bindingItem, setBindingItem] = useState<{
      item: Variable | Style
      type: LibrariesType
    } | null>(null)

    const handleLibraryChange = useEventCallback(
      (item: { item: Variable | Style; type: LibrariesType }) => {
        setSelectedItem(item)
        if (item.type === "VARIABLE" && "value" in item.item) {
          const value = item.item.value as RGBA
          if (typeof value === "object" && "r" in value && "g" in value && "b" in value) {
            setColor({ r: value.r, g: value.g, b: value.b })
            setAlpha("a" in value && typeof value.a === "number" ? value.a : 1)
          }
        } else if (
          item.type === "STYLE" &&
          "fills" in item.item &&
          (item.item.fills?.[0] as SolidFillItem)?.color
        ) {
          const color = (item.item.fills[0] as SolidFillItem).color as RGBA
          setColor({ r: color.r, g: color.g, b: color.b })
          setAlpha(color.a ?? 1)
        }
      },
    )

    // Add Variable
    const handleAddVariable = useEventCallback(() => {
      const newVariable = MOCK_COLOR_VARIABLE()
      newVariable.masterId = "New/Variable"
      setLibraries({
        ...libraries,
        variables: [...(libraries?.variables || []), newVariable],
      })
    })

    // Add Style
    const handleAddStyle = useEventCallback(() => {
      const newStyle = MOCK_COLOR_STYLE()
      newStyle.fileId = "New/Style"
      setLibraries({
        ...libraries,
        styles: [...(libraries?.styles || []), newStyle],
      })
    })

    const findVariable = (v: Variable) => {
      const value = v.value
      if (typeof value === "object" && "r" in value) {
        return (
          value.r === color?.r &&
          value.g === color?.g &&
          value.b === color?.b &&
          ("a" in value ? value.a : 1) === alpha
        )
      }
      return false
    }

    const previewProps = getPreviewProps(selectedItem, setLibraries)
    const matchedVariable =
      selectedItem?.type === "VARIABLE"
        ? libraries?.variables?.find(findVariable)
        : (selectedItem?.item as Style)

    return (
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 place-items-start gap-4">
          <div className="bg-default-background flex flex-col gap-2 rounded-lg shadow-lg">
            <Libraries
              variables={libraries?.variables}
              styles={libraries?.styles}
              displayType={displayType}
              onDisplayTypeChange={setDisplayType}
              onLibraryChange={handleLibraryChange}
              category={category}
              onCategoryChange={setCategory}
              selectedItem={selectedItem}
            />
            <RandomButtons
              libraries={libraries}
              setSelectedItem={setSelectedItem}
              bindingItem={bindingItem}
              setBindingItem={setBindingItem}
            />
          </div>

          <Control {...previewProps} />
        </div>
      </div>
    )
  },
}
