import { tcv, tcx } from "@choice-ui/shared"
import { forwardRef } from "react"

interface BaseLinkButtonProps {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  readOnly?: boolean
  variant?: "default" | "subtle"
}

// Conditional type: if href exists, it's a link, if not, it's a button
export type LinkButtonProps = BaseLinkButtonProps &
  (
    | (React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string
      })
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: never
      })
  )

// Style variant definition
const linkButtonTv = tcv({
  base: [
    "cursor-default",
    "inline-flex items-center justify-center gap-1",
    "focus-visible:ring-accent-background focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-none",
  ],
  variants: {
    variant: {
      default: "text-accent-foreground hover:underline",
      subtle: "text-default-foreground hover:text-accent-foreground underline",
    },
    disabled: {
      true: "text-disabled-foreground",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    disabled: false,
  },
})

export const LinkButton = forwardRef<HTMLAnchorElement | HTMLButtonElement, LinkButtonProps>(
  function LinkButton(props, ref) {
    const {
      children,
      className,
      disabled = false,
      readOnly = false,
      variant = "default",
      onClick,
      ...rest
    } = props

    const tv = linkButtonTv({ variant, disabled })

    // If href exists, render as link
    if ("href" in props && props.href) {
      const { href, target, rel, ...anchorProps } =
        rest as React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

      // Security handling: external links automatically add safe attributes
      const isExternal = href.startsWith("http") || href.startsWith("//")
      const safeRel = isExternal
        ? rel
          ? `${rel} noopener noreferrer`
          : "noopener noreferrer"
        : rel
      const safeTarget = isExternal && !target ? "_blank" : target

      // Prevent onClick event when in readOnly mode
      const handleClick = readOnly
        ? undefined
        : (onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined)

      return (
        <a
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          href={disabled || readOnly ? undefined : href}
          target={safeTarget}
          rel={safeRel}
          className={tcx(tv, className)}
          aria-disabled={disabled || readOnly}
          tabIndex={disabled || readOnly ? -1 : undefined}
          onClick={handleClick}
          {...anchorProps}
        >
          {children}
        </a>
      )
    }

    // Otherwise render as button
    const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>
    // Prevent onClick event when in readOnly mode
    const handleClick = readOnly
      ? undefined
      : (onClick as React.MouseEventHandler<HTMLButtonElement> | undefined)

    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type="button"
        disabled={disabled || readOnly}
        className={tcx(tv, className)}
        onClick={handleClick}
        {...buttonProps}
      >
        {children}
      </button>
    )
  },
)
