import { tcx } from "@choice-ui/shared"
import { Use } from "@choiceform/icons-react"
import { ElementType, forwardRef, memo, useEffect, useMemo, useState, type HTMLProps } from "react"
import tinycolor from "tinycolor2"
import { InitialLetter } from "./letter"
import { avatarTv } from "./tv"

export interface AvatarProps extends Omit<HTMLProps<HTMLDivElement>, "size" | "as"> {
  as?: ElementType
  children?: React.ReactNode
  color?: string
  name?: string
  photo?: string
  size?: "small" | "medium" | "large" | number
  states?: "default" | "dash" | "design" | "spotlight" | "anonymous"
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
    const [isLoading, setIsLoading] = useState(states !== "anonymous" && !!photo)
    const [imageLoadedError, setImageLoadedError] = useState(false)

    useEffect(() => {
      setImageLoadedError(false)
      setIsLoading(states !== "anonymous" && !!photo)
    }, [photo, states])

    const isNumericSize = typeof size === "number"
    const tvSize: "small" | "medium" | "large" = isNumericSize ? "medium" : (size ?? "medium")

    const tv = avatarTv({
      size: tvSize,
      states,
      isLoading,
    })

    const AnonymousIcon = () => (
      <svg
        data-slot="anonymous-icon"
        viewBox="0 0 24 24"
        className="h-full w-full"
        role="img"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M12.48 22.99a.5.5 0 0 1 .043 1 12 12 0 0 1-1.046 0 .5.5 0 0 1 .043-1 11 11 0 0 0 .96 0m-4.417-.17a.5.5 0 0 1 .628-.326q.455.144.926.247a.5.5 0 0 1-.215.977q-.514-.114-1.011-.27a.5.5 0 0 1-.328-.628m7.246-.326a.5.5 0 1 1 .3.953q-.496.157-1.011.27a.5.5 0 1 1-.215-.976q.471-.104.926-.247m-9.91-1.062a.5.5 0 0 1 .69-.153q.405.258.83.48a.5.5 0 0 1-.461.887q-.466-.243-.906-.524a.5.5 0 0 1-.154-.69m12.511-.153a.501.501 0 0 1 .538.843q-.44.281-.906.524a.5.5 0 0 1-.462-.886q.426-.224.83-.48M3.184 19.4a.5.5 0 0 1 .706.032q.324.354.678.678a.5.5 0 1 1-.675.738 12 12 0 0 1-.74-.74.5.5 0 0 1 .03-.708m16.926.032a.5.5 0 1 1 .738.675q-.354.387-.74.74a.5.5 0 0 1-.676-.737q.354-.324.678-.678M1.566 16.868a.5.5 0 0 1 .674.212q.223.426.48.83a.501.501 0 0 1-.842.538 12 12 0 0 1-.524-.906.5.5 0 0 1 .212-.674m20.194.212a.5.5 0 1 1 .886.462q-.243.466-.524.906a.5.5 0 0 1-.843-.538q.258-.404.48-.83M11.998 14a7 7 0 0 1 5.748 3.004.48.48 0 0 1-.054.612c-.232.235-.619.167-.811-.102A6 6 0 0 0 11.998 15a6 6 0 0 0-4.883 2.515c-.192.268-.578.337-.81.102a.48.48 0 0 1-.054-.612A6.99 6.99 0 0 1 11.998 14m-11.336.002a.5.5 0 0 1 .597.38q.104.473.247.927a.5.5 0 1 1-.953.3 12 12 0 0 1-.27-1.011.5.5 0 0 1 .38-.596m22.676 0a.5.5 0 0 1 .38.596q-.114.514-.27 1.011a.5.5 0 1 1-.954-.3q.144-.455.247-.926a.5.5 0 0 1 .597-.381M.532 10.998a.5.5 0 0 1 .479.522 11 11 0 0 0 0 .96.5.5 0 0 1-1 .043 12 12 0 0 1 0-1.046.5.5 0 0 1 .521-.479m22.936 0a.5.5 0 0 1 .521.479 12 12 0 0 1 0 1.046.5.5 0 0 1-1-.043 11 11 0 0 0 0-.96.5.5 0 0 1 .479-.522M11.998 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8m0 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M1.18 8.063a.5.5 0 0 1 .326.628q-.144.455-.247.926a.5.5 0 0 1-.977-.215q.114-.514.27-1.011a.5.5 0 0 1 .628-.328m21.64 0a.5.5 0 0 1 .627.328q.157.496.27 1.011a.5.5 0 1 1-.976.215q-.104-.471-.247-.926a.5.5 0 0 1 .326-.628M1.878 5.552a.5.5 0 1 1 .843.538q-.259.404-.48.83a.5.5 0 0 1-.887-.462q.242-.466.524-.906m19.554-.154a.5.5 0 0 1 .69.154q.281.44.524.906a.5.5 0 0 1-.886.462 11 11 0 0 0-.48-.83.5.5 0 0 1 .152-.692M3.892 3.152a.5.5 0 0 1 .676.738q-.354.324-.678.678a.5.5 0 1 1-.738-.675q.354-.387.74-.74m15.508.032a.5.5 0 0 1 .707-.032q.387.354.74.74a.5.5 0 0 1-.737.676 11 11 0 0 0-.678-.678.5.5 0 0 1-.032-.706M6.458 1.354a.5.5 0 0 1 .462.886q-.426.223-.83.48a.501.501 0 0 1-.538-.842q.44-.281.906-.524m10.41.212a.5.5 0 0 1 .674-.212q.466.242.906.524a.5.5 0 1 1-.538.843 11 11 0 0 0-.83-.48.5.5 0 0 1-.212-.675M9.402.282a.5.5 0 1 1 .215.977q-.471.104-.926.247a.5.5 0 1 1-.3-.953 12 12 0 0 1 1.011-.27m5.196 0q.514.114 1.011.27a.5.5 0 1 1-.3.954 11 11 0 0 0-.926-.247.5.5 0 0 1 .215-.977M12.523.011a.5.5 0 0 1-.043 1 11 11 0 0 0-.96 0 .5.5 0 0 1-.043-1 12 12 0 0 1 1.046 0"
        />
      </svg>
    )

    const fallback = useMemo(() => {
      if (states === "anonymous") {
        return <AnonymousIcon />
      }

      return photo && !imageLoadedError ? (
        <img
          data-slot="image"
          src={photo}
          alt={name ?? "avatar"}
          className={tv.image()}
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
    }, [photo, imageLoadedError, name, size, states, tv])

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
        className={tcx(tv.root(), className)}
        style={{ backgroundColor: color, color: textColor, ...sizeStyle }}
        {...rest}
      >
        {children ?? fallback}
      </Component>
    )
  }),
)

Avatar.displayName = "Avatar"
