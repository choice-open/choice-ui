"use client"

import { Badge, List, ScrollArea, tcx } from "@choice-ui/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createContext, Fragment, useContext, useEffect, useRef } from "react"

type NavItem = {
  title: string
  href?: string
  items?: NavItem[]
  tags?: string[]
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

// Context to pass activeRef down
const ActiveRefContext = createContext<React.RefObject<HTMLAnchorElement | null> | null>(null)

interface NavTreeProps {
  items: NavItem[]
  parentId: string | null
  activeHref: string
  level?: number
}

function NavTree({ items, parentId, activeHref, level = 0 }: NavTreeProps) {
  const activeRef = useContext(ActiveRefContext)

  return (
    <>
      {items.map((item, idx) => {
        const nodeId = parentId ? `${parentId}-${idx}` : `node-${idx}`
        const selfActive = isActiveHref(activeHref, item.href)
        const hasChildren = !!item.items && item.items.length > 0

        if (hasChildren) {
          return (
            <NavTreeGroup
              key={nodeId}
              item={item}
              nodeId={nodeId}
              parentId={parentId}
              activeHref={activeHref}
              selfActive={selfActive}
              level={level}
            />
          )
        }

        return (
          <NavTreeItem
            key={nodeId}
            item={item}
            nodeId={nodeId}
            parentId={parentId}
            active={selfActive}
            activeRef={activeRef}
          />
        )
      })}
    </>
  )
}

interface NavTreeGroupProps {
  item: NavItem
  nodeId: string
  parentId: string | null
  activeHref: string
  selfActive: boolean
  level: number
}

function NavTreeGroup({
  item,
  nodeId,
  parentId,
  activeHref,
  selfActive,
  level,
}: NavTreeGroupProps) {
  const childItems = item.items ?? []
  const childActive = childItems.some((child) => {
    if (isActiveHref(activeHref, child.href)) return true
    if (child.items) {
      return child.items.some((subChild) => isActiveHref(activeHref, subChild.href))
    }
    return false
  })
  const active = selfActive || childActive

  return (
    <Fragment>
      <List.SubTrigger
        defaultOpen={level <= 1 || active}
        id={nodeId}
        parentId={parentId ?? undefined}
      >
        <List.Value className="text-body-large text-secondary-foreground">{item.title}</List.Value>
      </List.SubTrigger>
      <List.Content parentId={nodeId}>
        <NavTree
          items={childItems}
          parentId={nodeId}
          activeHref={activeHref}
          level={level + 1}
        />
      </List.Content>
    </Fragment>
  )
}

interface NavTreeItemProps {
  item: NavItem
  nodeId: string
  parentId: string | null
  active: boolean
  activeRef: React.RefObject<HTMLAnchorElement | null> | null
}

function NavTreeItem({ item, nodeId, parentId, active, activeRef }: NavTreeItemProps) {
  if (item.href) {
    return (
      <Link
        ref={active && activeRef ? (activeRef as React.RefObject<HTMLAnchorElement>) : undefined}
        href={item.href}
        key={nodeId}
      >
        <List.Item
          as="div"
          selected={active}
          parentId={parentId ?? undefined}
          className={tcx("text-body-large", active && "bg-selected-background")}
          suffixElement={
            item.tags?.length ? (
              <div className="flex gap-1">
                {item.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            ) : undefined
          }
        >
          <List.Value>{item.title}</List.Value>
        </List.Item>
      </Link>
    )
  }

  return (
    <List.Item
      key={nodeId}
      selected={active}
      parentId={parentId ?? undefined}
      className="text-body-large"
    >
      <List.Value>{item.title}</List.Value>
    </List.Item>
  )
}

export function Sidebar({ items, className, ...props }: SidebarNavProps) {
  const pathname = usePathname()
  const activeRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    requestAnimationFrame(() => {
      activeRef.current?.scrollIntoView({ block: "center" })
    })
  }, [])

  return (
    <ActiveRefContext.Provider value={activeRef}>
      <ScrollArea
        hoverBoundary="none"
        className={className}
        {...props}
      >
        <ScrollArea.Viewport className="pr-4 pb-16">
          <ScrollArea.Content className="w-full min-w-0">
            <List
              selection
              shouldShowReferenceLine
              size="large"
              className="overflow-visible py-0 pl-0"
            >
              <List.Content>
                <NavTree
                  items={items}
                  parentId={null}
                  activeHref={pathname}
                />
              </List.Content>
            </List>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    </ActiveRefContext.Provider>
  )
}
