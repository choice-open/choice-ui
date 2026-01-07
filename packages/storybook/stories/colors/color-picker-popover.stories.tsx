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
  Popover,
  useColorPicker,
  VariableItem,
} from "@choice-ui/react"
import { Meta, StoryObj } from "@storybook/react"
import { RefObject, useRef, useState } from "react"
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
              checkColorContrast={{
                showColorContrast,
                level,
                category,
                backgroundColor: { r: 255, g: 255, b: 255 }, // TODO: 背景颜色需要传入
                foregroundColor: color,
                foregroundAlpha: alpha,
                selectedElementType: "graphics", // TODO: 需要传入元素类型
                handleLevelChange: setLevel,
                handleCategoryChange: setCategory,
                handleShowColorContrast: () => setShowColorContrast((prev) => !prev),
              }}
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
            backgroundColor: { r: 255, g: 255, b: 255 }, // TODO: 背景颜色需要传入
            foregroundColor: color,
            foregroundAlpha: alpha,
            selectedElementType: "graphics", // TODO: 需要传入元素类型
            handleLevelChange: setLevel,
            handleCategoryChange: setCategory,
            handleShowColorContrast: () => setShowColorContrast((prev) => !prev),
          }}
        />
      </>
    )
  },
}

const FeaturesController = ({
  features,
  setFeatures,
}: {
  features: PickerFeatures
  setFeatures: (features: PickerFeatures) => void
}) => {
  return (
    <div className="bg-default-background z-10 rounded-lg shadow-lg">
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
            <Checkbox
              value={features.checkColorContrast}
              onChange={(checked) => setFeatures({ ...features, checkColorContrast: checked })}
            >
              <Checkbox.Label>Check Color Contrast</Checkbox.Label>
            </Checkbox>
          </>
        )}
      </div>
    </div>
  )
}

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
          color={color}
          alpha={alpha}
        />

        <div className="grid grid-cols-2 place-items-center gap-4">
          <ColorPickerPopover
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
            placement="left"
            checkColorContrast={{
              showColorContrast,
              level,
              category,
              backgroundColor: { r: 255, g: 255, b: 255 }, // TODO: 背景颜色需要传入
              foregroundColor: color,
              foregroundAlpha: alpha,
              selectedElementType: "graphics", // TODO: 需要传入元素类型
              handleLevelChange: setLevel,
              handleCategoryChange: setCategory,
              handleShowColorContrast: () => setShowColorContrast((prev) => !prev),
            }}
          >
            <Popover.Trigger>
              <Button
                className="z-10"
                onClick={() => setOpen(!open)}
              >
                Open
              </Button>
            </Popover.Trigger>
          </ColorPickerPopover>

          <FeaturesController
            features={features}
            setFeatures={setFeatures}
          />
        </div>
      </>
    )
  },
}

/**
 * `DynamicTabs` 展示了如何使用 `additionalTabs` 属性来扩展颜色选择器的功能。
 *
 * ### 动态标签页功能
 *
 * 通过 `additionalTabs` 属性，可以向颜色选择器添加自定义标签页内容，从而扩展其功能：
 *
 * 1. 每个标签页由以下属性组成：
 *    - `value`: 标签页的唯一标识符
 *    - `label`: 显示在标签页上的文本
 *    - `content`: 标签页的内容组件
 *
 * 2. 实现方式：
 *    ```tsx
 *    const additionalTabs = [
 *      {
 *        value: "CUSTOM_TAB",
 *        label: "My Tab",
 *        content: <CustomTabContent />
 *      }
 *    ];
 *
 *    <ColorPickerPopover
 *      additionalTabs={additionalTabs}
 *      // ...其他属性
 *    />
 *    ```
 *
 * 3. 用例示例：
 *    - 添加品牌色板或主题色选择器
 *    - 集成设计系统特定的颜色功能
 *    - 添加自定义的颜色工具或使用场景
 *
 * 4. 扩展建议：
 *    - 保持标签页内容简洁明了
 *    - 确保每个标签页提供独特的功能
 *    - 可以通过设计一致的视觉风格增强用户体验
 */
export const DynamicTabs: Story = {
  render: function DynamicTabsStory() {
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

    // 自定义调色板标签页内容
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

    // 主题色标签页内容
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

    // 定义额外标签页
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
      <div className="flex min-h-[500px] items-center justify-center gap-12">
        <div className="flex max-w-md flex-col gap-6">
          <h2 className="text-heading-large">Dynamic Tabs Feature</h2>

          <div className="flex flex-col gap-2">
            <h3 className="text-body-large-strong">How to use:</h3>
            <p className="text-body-small text-gray-700">
              Extend the color picker with custom tabs by passing an array of tab objects to the{" "}
              <code className="rounded bg-gray-100 px-1 font-mono text-xs">additionalTabs</code>{" "}
              prop.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-body-large-strong">Tab object structure:</h3>
            <pre className="overflow-auto rounded bg-gray-100 p-2 font-mono text-xs">
              {`{
  value: "TAB_ID",      // Unique identifier
  label: "Tab Label",   // Display text
  content: <Component /> // React component
}`}
            </pre>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-body-large-strong">Example usage:</h3>
            <p className="text-body-small text-gray-700">
              In this demo, we've added "Palette" and "Theme" tabs alongside the default "Custom"
              tab. Try clicking on the different tabs to see how they work.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-body-large-strong">Benefits:</h3>
            <ul className="text-body-small list-disc pl-5 text-gray-700">
              <li>Add custom color selection interfaces</li>
              <li>Integrate with design systems</li>
              <li>Create specialized color tools</li>
              <li>Maintain consistent UI patterns</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <ColorSwatch
            color={color}
            alpha={alpha}
            size={64}
            className="rounded-md"
          />

          <ColorPickerPopover
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
          >
            <Popover.Trigger>
              <Button
                className="z-10"
                onClick={() => setOpen(!open)}
              >
                Open
              </Button>
            </Popover.Trigger>
          </ColorPickerPopover>
        </div>
      </div>
    )
  },
}
