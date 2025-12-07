import { Slot } from "@choiceform/slot"
import { tcx } from "@choiceform/design-shared"
import { ComponentPropsWithoutRef, forwardRef } from "react"
import { ITEM_PROGRESS_NAME } from "../constants"
import { useFileUploadItemContext } from "../hooks"
import { fileUploadStyles } from "../tv"

export interface FileUploadItemProgressProps extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
  circular?: boolean
  size?: number
}

export const FileUploadItemProgress = forwardRef<HTMLDivElement, FileUploadItemProgressProps>(
  (props, forwardedRef) => {
    const { circular, size = 40, asChild, className, ...progressProps } = props

    const itemContext = useFileUploadItemContext(ITEM_PROGRESS_NAME)
    const { itemProgress, itemProgressBar, itemProgressCircular } = fileUploadStyles()

    if (!itemContext.fileState) return null

    const ItemProgressPrimitive = asChild ? Slot : "div"

    if (circular) {
      if (itemContext.fileState.status === "success") return null

      const circumference = 2 * Math.PI * ((size - 4) / 2)
      const strokeDashoffset =
        circumference - (itemContext.fileState.progress / 100) * circumference

      return (
        <ItemProgressPrimitive
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={itemContext.fileState.progress}
          aria-valuetext={`${itemContext.fileState.progress}%`}
          aria-labelledby={itemContext.nameId}
          data-slot="file-upload-progress"
          {...progressProps}
          ref={forwardedRef}
          className={tcx(itemProgressCircular(), className)}
        >
          <svg
            className="rotate-[-90deg] transform"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
            stroke="currentColor"
          >
            <circle
              className="text-primary/20"
              strokeWidth="2"
              cx={size / 2}
              cy={size / 2}
              r={(size - 4) / 2}
            />
            <circle
              className="text-primary transition-all"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              cx={size / 2}
              cy={size / 2}
              r={(size - 4) / 2}
            />
          </svg>
        </ItemProgressPrimitive>
      )
    }

    return (
      <ItemProgressPrimitive
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={itemContext.fileState.progress}
        aria-valuetext={`${itemContext.fileState.progress}%`}
        aria-labelledby={itemContext.nameId}
        data-slot="file-upload-progress"
        {...progressProps}
        ref={forwardedRef}
        className={tcx(itemProgress(), className)}
      >
        <div
          className={itemProgressBar()}
          style={{
            transform: `translateX(-${100 - itemContext.fileState.progress}%)`,
          }}
        />
      </ItemProgressPrimitive>
    )
  },
)

FileUploadItemProgress.displayName = ITEM_PROGRESS_NAME
