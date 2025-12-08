"use client"

import { useEffect, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { List } from "~/components"
import Link from "next/link"
import { tcx } from "~/index"

type Heading = {
  id: string
  text: string
  level: number
  element: HTMLElement
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const pathname = usePathname()

  // 计算当前应该高亮的标题
  const updateActiveHeading = useCallback((headingsList: Heading[]) => {
    if (headingsList.length === 0) return

    // 触发线位置：当 section 顶部进入视口上半部分时激活
    const triggerLine = window.innerHeight * 0.4

    // 遍历所有标题，找到最后一个在触发线上方的标题
    let activeHeading: Heading | null = null

    for (const heading of headingsList) {
      const rect = heading.element.getBoundingClientRect()
      const top = rect.top

      // 如果标题在触发线上方，记录它
      if (top <= triggerLine) {
        activeHeading = heading
      }
    }

    // 只有当 section 滚动到触发线时才高亮，否则不高亮任何项目
    setActiveId(activeHeading?.id ?? "")
  }, [])

  useEffect(() => {
    // 路由变化时重置状态
    setHeadings([])
    setActiveId("")

    // 等待 DOM 更新
    const timer = setTimeout(() => {
      // 查找所有标题和带有 id 的 section
      const mainContent = document.querySelector("main")
      if (!mainContent) return

      const headingElements: Heading[] = []
      const processedIds = new Set<string>()

      // 只查找带有 id 的 section
      const sections = mainContent.querySelectorAll("section[id]")
      sections.forEach((section) => {
        const id = section.id
        if (processedIds.has(id)) return

        // 查找 section 内的第一个标题
        const heading = section.querySelector("h1, h2, h3")
        if (heading) {
          const text = heading.textContent?.trim() || ""
          if (text) {
            processedIds.add(id)
            const level = parseInt(heading.tagName.charAt(1))
            headingElements.push({ id, text, level, element: section as HTMLElement })
          }
        }
      })

      // 按在 DOM 中的顺序排序
      const sortedHeadings = headingElements.sort((a, b) => {
        const position = a.element.compareDocumentPosition(b.element)
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
          return -1
        }
        if (position & Node.DOCUMENT_POSITION_PRECEDING) {
          return 1
        }
        return 0
      })

      setHeadings(sortedHeadings)

      // 初始更新一次
      updateActiveHeading(sortedHeadings)

      // 监听滚动事件
      const handleScroll = () => {
        updateActiveHeading(sortedHeadings)
      }

      window.addEventListener("scroll", handleScroll, { passive: true })

      // 保存清理函数
      ;(mainContent as any).__tocCleanup = () => {
        window.removeEventListener("scroll", handleScroll)
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      const mainContent = document.querySelector("main")
      if (mainContent && (mainContent as any).__tocCleanup) {
        ;(mainContent as any).__tocCleanup()
        ;(mainContent as any).__tocCleanup = null
      }
    }
  }, [pathname, updateActiveHeading])

  if (headings.length === 0) {
    return null
  }

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 space-y-3">
        <List className="p-0">
          <List.Label>On this page</List.Label>
          <List.Content className="before:bg-secondary-background relative ml-3 before:absolute before:inset-y-0 before:left-0 before:w-px before:content-['']">
            {headings.map((heading) => {
              const isActive = activeId === heading.id
              return (
                <Link
                  href={`#${heading.id}`}
                  key={heading.id}
                >
                  <List.Item
                    as="div"
                    className={tcx(
                      isActive ? "before:bg-accent-foreground" : "",
                      heading.level === 1 ? "font-semibold" : heading.level === 2 ? "" : "pl-4",
                      "ml-2 w-[calc(100%-0.5rem)] before:absolute before:-inset-y-0.5 before:-left-2 before:w-px before:content-['']",
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      const el = document.getElementById(heading.id)
                      if (el) {
                        // 计算目标位置，考虑固定头部的高度
                        const headerOffset = 100
                        const elementPosition = el.getBoundingClientRect().top
                        const offsetPosition = elementPosition + window.scrollY - headerOffset

                        window.scrollTo({
                          top: offsetPosition,
                          behavior: "smooth",
                        })
                      }
                    }}
                  >
                    <List.Value>{heading.text}</List.Value>
                  </List.Item>
                </Link>
              )
            })}
          </List.Content>
        </List>
      </div>
    </aside>
  )
}
