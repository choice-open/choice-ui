"use client"

import { List, ScrollArea, tcx } from "@choiceform/design-system"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

type NavItem = {
  title: string
  href?: string
  items?: NavItem[]
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: NavItem[]
}

function normalizePath(path: string) {
  if (!path) return "/"
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path
}

function isActiveHref(current: string, target?: string) {
  if (!target) return false
  const cur = normalizePath(current)
  const tar = normalizePath(target)
  return cur === tar
}

function renderTree(
  items: NavItem[],
  parentId: string | null,
  activeHref: string,
  level = 0,
): { node: React.ReactNode; containsActive: boolean } {
  let anyActive = false

  const rendered = items.map((item, idx) => {
    const nodeId = parentId ? `${parentId}-${idx}` : `node-${idx}`
    const selfActive = isActiveHref(activeHref, item.href)
    const hasChildren = !!item.items && item.items.length > 0

    if (hasChildren) {
      const { node: childNode, containsActive: childActive } = renderTree(
        item.items ?? [],
        nodeId,
        activeHref,
        level + 1,
      )
      const active = selfActive || childActive

      anyActive = anyActive || active

      return (
        <Fragment key={nodeId}>
          <List.SubTrigger
            defaultOpen={level <= 0 || active}
            id={nodeId}
            parentId={parentId ?? undefined}
          >
            <List.Value className="text-body-medium-strong text-secondary-foreground">
              {item.title}
            </List.Value>
          </List.SubTrigger>
          <List.Content parentId={nodeId}>{childNode}</List.Content>
        </Fragment>
      )
    }

    const active = selfActive
    anyActive = anyActive || active

    return item.href ? (
      <Link
        href={item.href}
        key={nodeId}
      >
        <List.Item
          as="div"
          selected={active}
          parentId={parentId ?? undefined}
          className={tcx(active && "bg-selected-background")}
        >
          <List.Value>{item.title}</List.Value>
        </List.Item>
      </Link>
    ) : (
      <List.Item
        key={nodeId}
        selected={active}
        parentId={parentId ?? undefined}
      >
        <List.Value>{item.title}</List.Value>
      </List.Item>
    )
  })

  return { node: rendered, containsActive: anyActive }
}

export function Sidebar({ items, className, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <ScrollArea {...props}>
      <ScrollArea.Viewport className="pb-16">
        <ScrollArea.Content>
          <List
            selection
            shouldShowReferenceLine
            className="py-0 pr-4 pl-0"
          >
            <List.Content>{renderTree(items, null, pathname).node}</List.Content>
          </List>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
    </ScrollArea>
  )
}
