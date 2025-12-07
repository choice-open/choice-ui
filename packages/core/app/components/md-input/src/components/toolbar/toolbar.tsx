import { tcx } from "@choiceform/design-shared"
import React, { forwardRef, memo, useContext, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { MdInputContext } from "../../context"
import type { ToolbarProps } from "../../types"
import { DEFAULT_TOOLBAR_GROUPS } from "./default-actions"
import { ToolbarButton } from "./toolbar-button"
import { toolbarTv } from "./tv"

export const Toolbar = memo(
  forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
    {
      afterElement,
      beforeElement,
      children,
      groups = DEFAULT_TOOLBAR_GROUPS,
      onAction: onActionProp,
      disabled: disabledProp,
      className,
      visible: visibleProp,
      visibleActions,
      i18n = {
        bold: "Bold",
        code: "Code",
        "code-block": "Code block",
        heading: "Heading",
        italic: "Italic",
        "ordered-list": "Ordered list",
        quote: "Quote",
        "task-list": "Task list",
        "unordered-list": "Unordered list",
      },
      ...rest
    },
    ref,
  ) {
    const context = useContext(MdInputContext)

    const onAction = onActionProp ?? context?.handleToolbarAction
    const disabled = disabledProp ?? (context?.disabled || context?.readOnly)
    const visible = visibleProp ?? (context ? context.activeTab === "write" : true)

    if (!onAction) {
      throw new Error(
        "Toolbar requires onAction prop when used outside MdInput context, or must be used within MdInput component",
      )
    }

    const tv = toolbarTv({ visible })

    const handleAction = useEventCallback((action?: string) => {
      if (!action || disabled) return
      onAction(action)
    })

    const filteredGroups = useMemo(() => {
      if (!visibleActions) {
        return groups
      }

      const visibleSet = new Set(visibleActions)
      const filtered: typeof groups = []

      for (const group of groups) {
        const filteredGroup = group.filter((action) => visibleSet.has(action.id))

        if (filteredGroup.length > 0) {
          filtered.push(filteredGroup)
        }
      }

      return filtered
    }, [groups, visibleActions])

    return (
      <div
        ref={ref}
        className={tcx(tv.root(), className)}
        {...rest}
      >
        {beforeElement}

        {filteredGroups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex > 0 && <div className={tcx(tv.divider())} />}
            {group.map((action) => (
              <ToolbarButton
                key={action.id}
                label={i18n[action.id as keyof typeof i18n]}
                icon={action.icon}
                onClick={() => handleAction(action.id)}
                disabled={disabled}
              />
            ))}
          </React.Fragment>
        ))}

        {afterElement}

        {children}
      </div>
    )
  }),
)

Toolbar.displayName = "Toolbar"
