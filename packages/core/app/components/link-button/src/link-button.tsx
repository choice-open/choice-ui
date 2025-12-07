import { tcv, tcx } from "@choiceform/design-shared"
import { forwardRef } from "react"

// 基础 props 接口
interface BaseLinkButtonProps {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  readOnly?: boolean
  variant?: "default" | "subtle"
}

// 条件类型：有 href 时是链接，无 href 时是按钮
type LinkButtonProps = BaseLinkButtonProps &
  (
    | (React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string
      })
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: never
      })
  )

// 样式变体定义
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

    const styles = linkButtonTv({ variant, disabled })

    // 如果有 href，渲染为链接
    if ("href" in props && props.href) {
      const { href, target, rel, ...anchorProps } =
        rest as React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

      // 安全性处理：外部链接自动添加安全属性
      const isExternal = href.startsWith("http") || href.startsWith("//")
      const safeRel = isExternal
        ? rel
          ? `${rel} noopener noreferrer`
          : "noopener noreferrer"
        : rel
      const safeTarget = isExternal && !target ? "_blank" : target

      // 在 readOnly 模式下阻止 onClick 事件
      const handleClick = readOnly
        ? undefined
        : (onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined)

      return (
        <a
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          href={disabled || readOnly ? undefined : href}
          target={safeTarget}
          rel={safeRel}
          className={tcx(styles, className)}
          aria-disabled={disabled || readOnly}
          tabIndex={disabled || readOnly ? -1 : undefined}
          onClick={handleClick}
          {...anchorProps}
        >
          {children}
        </a>
      )
    }

    // 否则渲染为按钮
    const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>
    // 在 readOnly 模式下阻止 onClick 事件
    const handleClick = readOnly
      ? undefined
      : (onClick as React.MouseEventHandler<HTMLButtonElement> | undefined)

    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type="button"
        disabled={disabled || readOnly}
        className={tcx(styles, className)}
        onClick={handleClick}
        {...buttonProps}
      >
        {children}
      </button>
    )
  },
)
