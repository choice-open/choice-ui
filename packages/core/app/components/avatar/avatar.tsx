import { Use } from "@choiceform/icons-react"
import { ElementType, forwardRef, memo, useMemo, useState, type HTMLProps } from "react"
import tinycolor from "tinycolor2"
import { tcx } from "~/utils"
import { InitialLetter } from "./letter"
import { avatarTv } from "./tv"

export interface AvatarProps extends Omit<HTMLProps<HTMLDivElement>, "size" | "as"> {
  as?: ElementType
  children?: React.ReactNode
  color?: string
  name?: string
  photo?: string
  size?: "small" | "medium" | "large" | number
  states?: "default" | "dash" | "design" | "spotlight"
}

export const Avatar = memo(
  forwardRef<HTMLDivElement, AvatarProps>(function Avatar(props, ref) {
    const {
      as,
      children,
      className,
      color = "#d3d3d3",
      name,
      photo,
      size = "medium",
      states = "default",
      ...rest
    } = props
    const [isLoading, setIsLoading] = useState(!!photo)
    const [imageLoadedError, setImageLoadedError] = useState(false)

    const isNumericSize = typeof size === "number"
    const tvSize: "small" | "medium" | "large" = isNumericSize ? "medium" : (size ?? "medium")

    const styles = avatarTv({
      size: tvSize,
      states,
      isLoading,
    })

    const fallback = useMemo(() => {
      return photo && !imageLoadedError ? (
        <img
          data-slot="image"
          src={photo}
          alt={name}
          className={styles.image()}
          onLoad={() => {
            setIsLoading(false)
            setImageLoadedError(false)
          }}
          onError={() => {
            setIsLoading(false)
            setImageLoadedError(true)
          }}
        />
      ) : name ? (
        <InitialLetter
          letter={name?.[0] ?? ""}
          size={size}
        />
      ) : (
        <Use className="text-black/40" />
      )
    }, [photo, imageLoadedError, name, size, styles])

    const textColor = useMemo(() => {
      return tinycolor(color).isDark() ? "white" : "black"
    }, [color])

    const Component = as ?? "div"

    const sizeStyle = isNumericSize
      ? {
          width: `${size}px`,
          height: `${size}px`,
        }
      : {}

    return (
      <Component
        ref={ref}
        tabIndex={-1}
        className={tcx(styles.root(), className)}
        style={{ backgroundColor: color, color: textColor, ...sizeStyle }}
        {...rest}
      >
        {children ?? fallback}
      </Component>
    )
  }),
)

Avatar.displayName = "Avatar"
