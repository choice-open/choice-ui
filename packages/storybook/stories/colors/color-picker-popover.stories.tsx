import type {
  ChannelFieldSpace,
  CheckColorContrastCategory,
  CheckColorContrastLevel,
  GradientPaint,
  LibrariesDisplayType,
  LibrariesType,
  Paint,
  PickerFeatures,
  PickerType,
  RGB,
  Style,
  Variable,
} from "@choice-ui/react"
import {
  Button,
  Checkbox,
  ColorGradientsPaint,
  ColorImagePaint,
  ColorInput,
  ColorPickerPopover,
  ColorSolidPaint,
  ColorSwatch,
  GradientItem,
  Label,
  Popover,
  Select,
  useColorPicker,
  VariableItem,
} from "@choice-ui/react"
import { Meta, StoryObj } from "@storybook/react"
import { forwardRef, RefObject, useRef, useState } from "react"
import tinycolor from "tinycolor2"

const meta: Meta<typeof ColorPickerPopover> = {
  title: "Colors/ColorPickerPopover",
  component: ColorPickerPopover,
  tags: ["upgrade"],
}

export default meta

type Story = StoryObj<typeof ColorPickerPopover>

const SolidBackground = ({ color, alpha }: { alpha: number; color: RGB }) => {
  return (
    <ColorSwatch
      color={color}
      alpha={alpha}
      size={32}
      className="size-full! absolute inset-0"
    />
  )
}

const FillInput = ({
  color,
  alpha,
  open,
  setOpen,
  setPickerType,
  setColor,
  setAlpha,
  libraries,
  paintsType,
  gradient,
  setGradient,
  triggerRef,
}: {
  alpha: number
  color: RGB
  gradient: GradientPaint
  libraries: {
    displayType: LibrariesDisplayType
    pickerType: PickerType
    selected: { item: Variable | Style; type: LibrariesType } | null
    selectedCategory: string
  }
  open: boolean
  paintsType: Paint["type"]
  setAlpha: (alpha: number) => void
  setColor: (color: RGB) => void
  setGradient: (gradient: GradientPaint) => void
  setOpen: (open: boolean) => void
  setPickerType: (pickerType: PickerType) => void
  triggerRef: RefObject<HTMLDivElement>
}) => {
  return (
    <div
      ref={triggerRef}
      className="flex w-48 items-center gap-2"
    >
      {libraries.selected ? (
        <VariableItem
          active={open}
          libraries={libraries.selected || undefined}
          onPickerClick={() => {
            setPickerType("LIBRARIES")
            setOpen(!open)
          }}
        />
      ) : paintsType === "SOLID" ? (
        <ColorInput
          active={open}
          color={color}
          alpha={alpha}
          onColorChange={setColor}
          onAlphaChange={setAlpha}
          onPickerClick={() => {
            setOpen(!open)
          }}
        />
      ) : (
        <GradientItem
          active={open}
          gradient={gradient}
          onGradientChange={(gradient) => {
            setGradient(gradient)
          }}
          alpha={gradient.opacity}
          onAlphaChange={(alpha) => setGradient({ ...gradient, opacity: alpha })}
          onPickerClick={() => setOpen(!open)}
        />
      )}
    </div>
  )
}

/**
 * `ColorPickerPopover` is a feature-rich color picker component that supports multiple color types and interaction modes.
 *
 * ### Key Features
 *
 * 1. Multiple Color Type Support:
 *    - Solid Colors
 *    - Gradients (Linear, Radial, Angular)
 *    - Image-based Colors
 *
 * 2. Dual Mode Operation:
 *    - Custom Mode: Direct color editing
 *    - Libraries Mode: Selection from predefined color libraries
 *
 * 3. Advanced Color Editing:
 *    - Multiple Color Spaces: HEX, RGB, HSL, HSB
 *    - Alpha Channel Control
 *    - Native Color Picker Integration
 *    - Gradient Editor
 *
 * 4. High Configurability:
 *    - Feature Toggle System
 *    - Customizable Container Width
 *    - Configurable Color Space Display
 *
 * ### Usage Examples
 *
 * 1. Basic Implementation:
 * ```tsx
 * const [color, setColor] = useState<RGB>({ r: 0, g: 0, b: 0 })
 * const [alpha, setAlpha] = useState(1)
 *
 * <ColorPickerPopover
 *   open={open}
 *   onOpenChange={setOpen}
 *   color={color}
 *   alpha={alpha}
 *   onColorChange={setColor}
 *   onAlphaChange={setAlpha}
 * />
 * ```
 *
 * 2. Feature Configuration:
 * ```tsx
 * <ColorPickerPopover
 *   features={{
 *     pickerType: true,     // Enable picker type switching
 *     custom: true,         // Enable custom mode
 *     libraries: true,      // Enable libraries mode
 *     paintsType: true,     // Enable paint type switching
 *     solid: true,          // Enable solid colors
 *     gradient: true,       // Enable gradients
 *     image: true,          // Enable image colors
 *     spaceDropdown: true,  // Enable color space dropdown
 *     alpha: true,          // Enable alpha channel
 *     nativePicker: true,   // Enable native picker
 *     presets: true,        // Enable color presets
 *   }}
 * />
 * ```
 *
 * 3. Gradient Implementation:
 * ```tsx
 * const [gradient, setGradient] = useState<GradientPaint>({
 *   type: "GRADIENT_LINEAR",
 *   gradientStops: [
 *     { position: 0, color: { r: 0, g: 0, b: 0 }, alpha: 1 },
 *     { position: 1, color: { r: 255, g: 255, b: 255 }, alpha: 1 }
 *   ]
 * })
 *
 * <ColorPickerPopover
 *   paintsType="GRADIENT_LINEAR"
 *   gradient={gradient}
 *   onGradientChange={setGradient}
 * />
 * ```
 *
 * ### Best Practices
 *
 * 1. State Management:
 *    - Maintain color state in parent component
 *    - Optimize callbacks with useCallback
 *    - Handle state synchronization during type switches
 *
 * 2. Performance Optimization:
 *    - Prevent unnecessary re-renders
 *    - Wrap child components with memo
 *    - Cache computed values with useMemo
 *
 * 3. UX Considerations:
 *    - Provide immediate visual feedback
 *    - Maintain color selection continuity
 *    - Preserve user selections during mode switches
 *
 * 4. Error Handling:
 *    - Validate color values
 *    - Provide sensible defaults
 *    - Handle edge cases gracefully
 *
 * ### Component Architecture
 *
 * The component is built with a modular architecture:
 * - Main Popover Container
 * - Mode Switching Tabs
 * - Paint Type Selector
 * - Color Space Controls
 * - Gradient Editor
 * - Library Browser
 *
 * Each module can be enabled/disabled through the features configuration,
 * allowing for flexible implementation based on specific needs.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const triggerRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const [showColorContrast, setShowColorContrast] = useState(false)
    const [level, setLevel] = useState<CheckColorContrastLevel>("AA")
    const [category, setCategory] = useState<CheckColorContrastCategory>("auto")
    const [colorSpace, setColorSpace] = useState<ChannelFieldSpace>("hex")

    const {
      color,
      alpha,
      pickerType,
      paintsType,
      libraries,
      gradient,
      handlePickerTypeChange,
      handlePaintsTypeChange,
      handleColorChange,
      handleAlphaChange,
      handleGradientChange,
    } = useColorPicker()

    return (
      <>
        <FillInput
          color={color}
          alpha={alpha}
          open={open}
          setOpen={setOpen}
          setPickerType={handlePickerTypeChange}
          setColor={handleColorChange}
          setAlpha={handleAlphaChange}
          paintsType={paintsType}
          libraries={libraries}
          gradient={gradient}
          setGradient={handleGradientChange}
          triggerRef={triggerRef}
        />

        <ColorPickerPopover
          autoUpdate={true}
          triggerRef={triggerRef}
          pickerType={pickerType}
          onPickerTypeChange={handlePickerTypeChange}
          paintsType={paintsType}
          onPaintsTypeChange={handlePaintsTypeChange}
          solidPaint={
            <ColorSolidPaint
              colorSpace={colorSpace}
              onColorSpaceChange={(value) => setColorSpace(value as ChannelFieldSpace)}
              color={color}
              alpha={alpha}
              onColorChange={handleColorChange}
              onAlphaChange={handleAlphaChange}
            />
          }
          gradientPaint={
            <ColorGradientsPaint
              colorSpace={colorSpace}
              onColorSpaceChange={(value) => setColorSpace(value as ChannelFieldSpace)}
              gradient={gradient}
              onGradientChange={handleGradientChange}
            />
          }
          imagePaint={<ColorImagePaint />}
          open={open}
          onOpenChange={setOpen}
          placement="left"
          checkColorContrast={{
            showColorContrast,
            level,
            category,
            backgroundColor: { r: 255, g: 255, b: 255 }, // TODO: Background color should be passed in
            foregroundColor: color,
            foregroundAlpha: alpha,
            selectedElementType: "graphics", // TODO: Element type should be passed in
            handleLevelChange: setLevel,
            handleCategoryChange: setCategory,
            handleShowColorContrast: () => setShowColorContrast((prev) => !prev),
          }}
        />
      </>
    )
  },
}

interface FeaturesControllerProps {
  features: PickerFeatures
  setFeatures: (features: PickerFeatures) => void
  setShowColorContrast: (showColorContrast: boolean) => void
  backgroundColor: RGB
  selectedElementType: "text" | "graphics"
  setBackgroundColor: (backgroundColor: RGB) => void
  setSelectedElementType: (selectedElementType: "text" | "graphics") => void
  children: React.ReactNode
}

const FeaturesController = forwardRef<HTMLDivElement, FeaturesControllerProps>(
  function FeaturesController(props, ref) {
    const {
      features,
      setFeatures,
      setShowColorContrast,
      backgroundColor,
      selectedElementType,
      setBackgroundColor,
      setSelectedElementType,
      children,
    } = props

    const triggerRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const [colorSpace, setColorSpace] = useState<ChannelFieldSpace>("hex")

    return (
      <div
        ref={ref}
        className="bg-default-background z-10 rounded-lg shadow-lg"
      >
        <div className="text-body-medium-strong flex h-10 items-center border-b pl-4 pr-2">
          Features Controller
        </div>
        <div className="flex w-60 flex-col gap-2 p-3">
          <Checkbox
            value={features.pickerType}
            onChange={(checked) => setFeatures({ ...features, pickerType: checked })}
          >
            <Checkbox.Label>Picker Type</Checkbox.Label>
          </Checkbox>
          {features.pickerType && (
            <>
              <Checkbox
                label="Custom"
                value={features.custom}
                onChange={(checked) => setFeatures({ ...features, custom: checked })}
              >
                <Checkbox.Label>Custom</Checkbox.Label>
              </Checkbox>
              {/* <Checkbox
                  value={features.libraries}
                  onChange={(checked) => setFeatures({ ...features, libraries: checked })}
                >
                  <Checkbox.Label>Libraries</Checkbox.Label>
                </Checkbox> */}
            </>
          )}

          <hr />
          <Checkbox
            value={features.paintsType}
            onChange={(checked) => setFeatures({ ...features, paintsType: checked })}
          >
            <Checkbox.Label>paintsType</Checkbox.Label>
          </Checkbox>
          {features.paintsType && (
            <>
              <Checkbox
                value={features.solid}
                onChange={(checked) => setFeatures({ ...features, solid: checked })}
              >
                <Checkbox.Label>Solid</Checkbox.Label>
              </Checkbox>
              <Checkbox
                value={features.gradient}
                onChange={(checked) => setFeatures({ ...features, gradient: checked })}
              >
                <Checkbox.Label>Gradient</Checkbox.Label>
              </Checkbox>
              <Checkbox
                value={features.pattern}
                onChange={(checked) => setFeatures({ ...features, pattern: checked })}
              >
                <Checkbox.Label>Pattern</Checkbox.Label>
              </Checkbox>
              <Checkbox
                value={features.image}
                onChange={(checked) => setFeatures({ ...features, image: checked })}
              >
                <Checkbox.Label>Image</Checkbox.Label>
              </Checkbox>
              <hr />
              <Checkbox
                value={features.checkColorContrast}
                onChange={(checked) => {
                  setFeatures({ ...features, checkColorContrast: checked })
                  setShowColorContrast(false)
                }}
              >
                <Checkbox.Label>Check Color Contrast</Checkbox.Label>
              </Checkbox>
              {features.checkColorContrast && (
                <>
                  <Select
                    value={selectedElementType}
                    onChange={(value) => setSelectedElementType(value as "text" | "graphics")}
                  >
                    <Select.Trigger>
                      <span className="flex-1 truncate capitalize">{selectedElementType}</span>
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Label>Selected Element Type</Select.Label>
                      <Select.Item value="text">
                        <Select.Value>Text</Select.Value>
                      </Select.Item>
                      <Select.Item value="graphics">
                        <Select.Value>Graphics</Select.Value>
                      </Select.Item>
                    </Select.Content>
                  </Select>
                  <ColorInput
                    ref={triggerRef}
                    color={backgroundColor}
                    onColorChange={setBackgroundColor}
                    onPickerClick={() => setOpen(!open)}
                    alpha={1}
                    features={{
                      alpha: false,
                    }}
                  />
                  <ColorPickerPopover
                    triggerRef={triggerRef}
                    labels={{
                      custom: "Background Color",
                    }}
                    open={open}
                    onOpenChange={setOpen}
                    autoUpdate={true}
                    placement="left-start"
                    features={{
                      pickerType: false,
                      paintsType: false,
                      alpha: false,
                    }}
                    solidPaint={
                      <ColorSolidPaint
                        colorSpace={colorSpace}
                        onColorSpaceChange={(value) => setColorSpace(value as ChannelFieldSpace)}
                        color={backgroundColor}
                        alpha={1}
                        onColorChange={(color) => setBackgroundColor(color)}
                      />
                    }
                  />
                </>
              )}
            </>
          )}
        </div>

        {children}
      </div>
    )
  },
)

/**
 * `Features` demonstrates the comprehensive feature configuration system of the ColorPickerPopover component.
 *
 * ### Feature Configuration System
 *
 * The component supports three preset configurations:
 *
 * ### Feature Categories
 *
 * 1. Mode Selection Features:
 *    - `pickerType`: Enable/disable mode switching
 *    - `custom`: Allow custom color editing
 *    - `libraries`: Enable color library access
 *
 * 2. Paint Type Features:
 *    - `solid`: Enable solid color selection
 *    - `gradient`: Enable gradient creation
 *    - `image`: Enable image-based colors
 *
 * 3. Color Space Features:
 *    - `spaceDropdown`: Enable color space selection
 *    - `hex`: Enable HEX color input
 *    - `rgb`: Enable RGB color input
 *    - `hsl`: Enable HSL color input
 *    - `hsb`: Enable HSB color input
 *
 * 4. Additional Controls:
 *    - `alpha`: Enable opacity control
 *    - `nativePicker`: Show native color picker
 *    - `presets`: Display color presets
 *
 * ### Usage Guidelines
 *
 * 1. Feature Dependencies:
 *    ```tsx
 *    // Correct: Enable required parent features
 *    features={{
 *      pickerType: true,  // Parent feature
 *      custom: true,      // Child feature
 *      libraries: true    // Child feature
 *    }}
 *
 *    // Incorrect: Child features without parent
 *    features={{
 *      pickerType: false,  // Parent disabled
 *      custom: true,       // Won't work
 *      libraries: true     // Won't work
 *    }}
 *    ```
 *
 * 2. Performance Optimization:
 *    - Enable only necessary features
 *    - Consider using Basic mode for simple use cases
 *    - Disable unused color spaces
 *
 * 3. UX Recommendations:
 *    - Maintain consistent feature sets across instances
 *    - Provide appropriate defaults based on user needs
 *    - Consider progressive feature disclosure
 *
 * ### Example Configurations
 *
 * 1. Simple Color Picker:
 *    ```tsx
 *    <ColorPickerPopover
 *      features={{
 *        pickerType: false,
 *        paintsType: false,
 *        solid: true,
 *        spaceDropdown: false,
 *        hex: true,
 *        rgb: true
 *      }}
 *    />
 *    ```
 *
 * 2. Gradient Editor:
 *    ```tsx
 *    <ColorPickerPopover
 *      features={{
 *        paintsType: true,
 *        solid: true,
 *        gradient: true,
 *        spaceDropdown: true,
 *        alpha: true
 *      }}
 *    />
 *    ```
 *
 * 3. Design System Integration:
 *    ```tsx
 *    <ColorPickerPopover
 *      features={{
 *        pickerType: true,
 *        libraries: true,
 *        solid: true,
 *        presets: true
 *      }}
 *    />
 *    ```
 *
 * ### Color Contrast Checking (`checkColorContrast`)
 *
 * The `checkColorContrast` prop enables WCAG color contrast validation:
 *
 * - `showColorContrast`: Controls visibility of contrast checker UI (toolbar and boundary lines)
 * - `level`: Target WCAG level ('AA' | 'AAA')
 * - `category`: Content type ('auto' | 'large-text' | 'normal-text' | 'graphics')
 * - `backgroundColor`: Background RGB color object
 * - `foregroundColor`: Foreground RGB color (linked to picker's color state)
 * - `foregroundAlpha`: Alpha value (0-1) of foreground color
 * - `selectedElementType`: Element type ('text' | 'graphics') for 'auto' category behavior
 * - `handleLevelChange`: Callback when contrast level changes
 * - `handleCategoryChange`: Callback when category changes
 * - `handleShowColorContrast`: Callback to toggle contrast checker visibility
 * - `contrastInfo`: Optional override for calculated contrast ratio display
 */
export const Features: Story = {
  render: function FeaturesControllerStory() {
    const [features, setFeatures] = useState<PickerFeatures>({
      paintsType: true,
      custom: true,
      // libraries: true,
      pickerType: true,
      solid: true,
      gradient: true,
      pattern: true,
      image: true,
      alpha: true,
      spaceDropdown: true,
      hex: true,
      rgb: true,
      hsl: true,
      hsb: true,
      presets: true,
      nativePicker: true,
      checkColorContrast: true,
    })

    const triggerRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const [showColorContrast, setShowColorContrast] = useState(false)
    const [backgroundColor, setBackgroundColor] = useState<RGB>({ r: 255, g: 255, b: 255 })
    const [selectedElementType, setSelectedElementType] = useState<"text" | "graphics">("graphics")
    const [level, setLevel] = useState<CheckColorContrastLevel>("AA")
    const [category, setCategory] = useState<CheckColorContrastCategory>("auto")
    const [colorSpace, setColorSpace] = useState<ChannelFieldSpace>("hex")

    const {
      color,
      alpha,
      pickerType,
      paintsType,
      gradient,
      handlePickerTypeChange,
      handlePaintsTypeChange,
      handleColorChange,
      handleAlphaChange,
      handleGradientChange,
    } = useColorPicker()

    return (
      <>
        <SolidBackground
          color={features.checkColorContrast ? backgroundColor : color}
          alpha={alpha}
        />

        <div className="grid grid-cols-2 place-items-center gap-4">
          <ColorSwatch
            color={color}
            alpha={alpha}
            size={64}
            className="z-10 rounded-md"
          />
          <FeaturesController
            backgroundColor={backgroundColor}
            selectedElementType={selectedElementType}
            setBackgroundColor={setBackgroundColor}
            setSelectedElementType={setSelectedElementType}
            features={features}
            setFeatures={setFeatures}
            setShowColorContrast={setShowColorContrast}
          >
            <div
              className="p-3"
              ref={triggerRef}
            >
              <Button onClick={() => setOpen(!open)}>Open</Button>
            </div>
          </FeaturesController>
        </div>

        <ColorPickerPopover
          triggerRef={triggerRef}
          draggable
          rememberPosition
          features={features}
          pickerType={pickerType}
          onPickerTypeChange={handlePickerTypeChange}
          paintsType={paintsType}
          onPaintsTypeChange={handlePaintsTypeChange}
          solidPaint={
            <ColorSolidPaint
              colorSpace={colorSpace}
              onColorSpaceChange={(value) => setColorSpace(value as ChannelFieldSpace)}
              color={color}
              alpha={alpha}
              onColorChange={handleColorChange}
              onAlphaChange={handleAlphaChange}
            />
          }
          gradientPaint={
            <ColorGradientsPaint
              colorSpace={colorSpace}
              onColorSpaceChange={(value) => setColorSpace(value as ChannelFieldSpace)}
              gradient={gradient}
              onGradientChange={handleGradientChange}
            />
          }
          open={open}
          onOpenChange={setOpen}
          autoUpdate={true}
          placement="right-start"
          checkColorContrast={{
            showColorContrast,
            level,
            category,
            backgroundColor,
            foregroundColor: color,
            foregroundAlpha: alpha,
            selectedElementType,
            handleLevelChange: setLevel,
            handleCategoryChange: setCategory,
            handleShowColorContrast: () => setShowColorContrast((prev) => !prev),
          }}
        />
      </>
    )
  },
}

/**
 * `DynamicTabs` demonstrates how to use the `additionalTabs` prop to extend the color picker functionality.
 *
 * ### Dynamic Tabs Feature
 *
 * The `additionalTabs` prop allows you to add custom tab content to the color picker, extending its capabilities.
 *
 * ### Tab Object Structure
 *
 * Each tab consists of the following properties:
 * - `value`: Unique identifier for the tab
 * - `label`: Text displayed on the tab
 * - `content`: Content component for the tab
 *
 * ### Implementation
 *
 * ```tsx
 * const additionalTabs = [
 *   {
 *     value: "CUSTOM_TAB",
 *     label: "My Tab",
 *     content: <CustomTabContent />
 *   }
 * ];
 *
 * <ColorPickerPopover
 *   additionalTabs={additionalTabs}
 *   // ...other props
 * />
 * ```
 *
 * ### Example Usage
 *
 * In this demo, we've added "Palette" and "Theme" tabs alongside the default "Custom" tab.
 * Try clicking on the different tabs to see how they work.
 *
 * ### Use Case Examples
 *
 * - Add brand color palettes or theme color selectors
 * - Integrate design system specific color features
 * - Add custom color tools or usage scenarios
 *
 * ### Benefits
 *
 * - Add custom color selection interfaces
 * - Integrate with design systems
 * - Create specialized color tools
 * - Maintain consistent UI patterns
 *
 * ### Extension Recommendations
 *
 * - Keep tab content concise and clear
 * - Ensure each tab provides unique functionality
 * - Enhance user experience through consistent visual design
 */
export const DynamicTabs: Story = {
  render: function DynamicTabsStory() {
    const triggerRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const [colorSpace, setColorSpace] = useState<ChannelFieldSpace>("hex")

    const {
      color,
      alpha,
      pickerType,
      paintsType,
      gradient,
      handlePickerTypeChange,
      handlePaintsTypeChange,
      handleColorChange,
      handleAlphaChange,
      handleGradientChange,
    } = useColorPicker()

    // Custom palette tab content
    const customPaletteContent = (
      <div className="flex flex-col gap-3 p-4">
        <div className="text-body-small-strong">Custom Palette</div>
        <div className="grid grid-cols-5 gap-1">
          {[
            "#FF5733",
            "#33FF57",
            "#3357FF",
            "#F3FF33",
            "#FF33F3",
            "#33FFF3",
            "#FF3333",
            "#33FF33",
            "#3333FF",
            "#FFFF33",
          ].map((color, index) => (
            <ColorSwatch
              key={index}
              color={tinycolor(color).toRgb()}
              size={32}
              className="cursor-pointer rounded"
              onClick={() => {
                handleColorChange(tinycolor(color).toRgb())
              }}
            />
          ))}
        </div>
      </div>
    )

    // Theme colors tab content
    const themesTabContent = (
      <div className="flex flex-col gap-3 p-4">
        <div className="text-body-small-strong">Theme</div>
        <div className="flex flex-col gap-2">
          <div
            className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-100"
            onClick={() => handleColorChange({ r: 59, g: 130, b: 246 })}
          >
            <ColorSwatch
              color={tinycolor("#3B82F6").toRgb()}
              size={32}
              className="rounded-full"
            />
            <div>Brand Blue</div>
          </div>
          <div
            className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-100"
            onClick={() => handleColorChange({ r: 234, g: 88, b: 12 })}
          >
            <ColorSwatch
              color={tinycolor("#EA580C").toRgb()}
              size={32}
              className="rounded-full"
            />
            <div>Vibrant Orange</div>
          </div>
          <div
            className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-100"
            onClick={() => handleColorChange({ r: 22, g: 163, b: 74 })}
          >
            <ColorSwatch
              color={tinycolor("#16A34A").toRgb()}
              size={32}
              className="rounded-full"
            />
            <div>Ecological Green</div>
          </div>
        </div>
      </div>
    )

    // Define additional tabs
    const additionalTabs = [
      {
        value: "CUSTOM_PALETTE",
        label: "Palette",
        content: customPaletteContent,
      },
      {
        value: "THEMES",
        label: "Theme",
        content: themesTabContent,
      },
    ]

    return (
      <div className="flex flex-col items-center gap-4">
        <ColorSwatch
          color={color}
          alpha={alpha}
          size={64}
          className="rounded-md"
        />

        <ColorPickerPopover
          triggerRef={triggerRef}
          draggable
          rememberPosition
          pickerType={pickerType}
          onPickerTypeChange={handlePickerTypeChange}
          paintsType={paintsType}
          onPaintsTypeChange={handlePaintsTypeChange}
          additionalTabs={additionalTabs}
          solidPaint={
            <ColorSolidPaint
              colorSpace={colorSpace}
              onColorSpaceChange={(value) => setColorSpace(value as ChannelFieldSpace)}
              color={color}
              alpha={alpha}
              onColorChange={handleColorChange}
              onAlphaChange={handleAlphaChange}
            />
          }
          gradientPaint={
            <ColorGradientsPaint
              colorSpace={colorSpace}
              onColorSpaceChange={(value) => setColorSpace(value as ChannelFieldSpace)}
              gradient={gradient}
              onGradientChange={handleGradientChange}
            />
          }
          open={open}
          onOpenChange={setOpen}
        />

        <div
          ref={triggerRef}
          className="z-10"
        >
          <Button onClick={() => setOpen(!open)}>Open</Button>
        </div>
      </div>
    )
  },
}
