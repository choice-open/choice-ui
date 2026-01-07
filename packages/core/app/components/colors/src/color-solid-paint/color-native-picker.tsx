import { tcx } from "@choice-ui/shared"
import { IconButton } from "@choice-ui/icon-button"
import { forwardRef, type HTMLProps } from "react"
import tinycolor from "tinycolor2"
import { translation } from "../contents"
import type { RGB } from "../types/colors"

interface ColorNativePickerProps extends Omit<HTMLProps<HTMLButtonElement>, "onChange"> {
  onChange: (color: RGB) => void
  tooltip?: string
}

export const ColorNativePicker = forwardRef<HTMLButtonElement, ColorNativePickerProps>(
  function ColorNativePicker(props, ref) {
    const { className, onChange, tooltip = translation.colorNativePicker.PICK_COLOR } = props

    // 目前该方法在兼容性方面只有 Chrome、Edge、Opera 这三个浏览器在全力支持，所以适用范围并不广泛。
    const nativePick = async (value: any) => {
      const val = value ? value.target.value : null
      if (val) {
        return
      } else {
        // 检查浏览器是否支持 EyeDropper API
        if (!("EyeDropper" in window)) {
          // 提示用户他的浏览器不支持此功能
          alert(translation.colorNativePicker.ALERT)
          return
        }

        const eyeDropper = new (window as any).EyeDropper() // 初始化一个EyeDropper对象
        const result = await eyeDropper.open() // 开始拾取颜色
        const rgb = tinycolor(result.sRGBHex).toRgb()
        onChange({ r: rgb.r, g: rgb.g, b: rgb.b })
      }
    }

    return (
      <div className={tcx("flex items-center justify-center", className)}>
        <IconButton
          ref={ref}
          onClick={nativePick}
          tooltip={{
            content: tooltip,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1.5 14.5L2 14H3.99998L9.99998 8" />
              <path d="M2 14V12L8 6" />
              <path d="M9.99997 4L12.2666 1.73334C12.5319 1.46812 12.8916 1.31912 13.2666 1.31912C13.6417 1.31912 14.0014 1.46812 14.2666 1.73334C14.5319 1.99855 14.6809 2.35826 14.6809 2.73334C14.6809 3.10841 14.5319 3.46812 14.2666 3.73334L12 6L12.2666 6.26667C12.398 6.39799 12.5021 6.55389 12.5732 6.72547C12.6443 6.89705 12.6809 7.08095 12.6809 7.26667C12.6809 7.45239 12.6443 7.63628 12.5732 7.80787C12.5021 7.97945 12.398 8.13535 12.2666 8.26667C12.1353 8.39799 11.9794 8.50216 11.8078 8.57323C11.6363 8.6443 11.4524 8.68088 11.2666 8.68088C11.0809 8.68088 10.897 8.6443 10.7254 8.57323C10.5539 8.50216 10.398 8.39799 10.2666 8.26667L7.73331 5.73334C7.60198 5.60201 7.49781 5.44611 7.42674 5.27453C7.35567 5.10295 7.31909 4.91905 7.31909 4.73334C7.31909 4.54762 7.35567 4.36372 7.42674 4.19214C7.49781 4.02056 7.60198 3.86466 7.73331 3.73334C7.86463 3.60201 8.02053 3.49784 8.19211 3.42677C8.36369 3.3557 8.54759 3.31912 8.73331 3.31912C8.91902 3.31912 9.10292 3.3557 9.2745 3.42677C9.44608 3.49784 9.60198 3.60201 9.73331 3.73334L9.99997 4Z" />
            </g>
          </svg>
        </IconButton>
      </div>
    )
  },
)

ColorNativePicker.displayName = "ColorNativePicker"
