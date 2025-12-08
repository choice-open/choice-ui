import { Sidebar } from "@/components/sidebar"
import { TableOfContents } from "@/components/table-of-contents"
import indexData from "@/generated/index.json"
import { componentsDetails } from "@/generated/components/components-details"

type IndexItem = {
  slug: string
  name: string
  title: string
  description: string
  version: string
  tags?: string[]
}

type SidebarNode = {
  title: string
  href?: string
  items?: SidebarNode[]
  tags?: string[]
}

function slugifyPart(part: string): string {
  return part
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

const componentsNav: { title: string; items: SidebarNode[] } = (() => {
  const root: SidebarNode = { title: "Components", items: [] }

  const findOrCreate = (parent: SidebarNode, title: string) => {
    const key = slugifyPart(title)
    if (!parent.items) parent.items = []
    const existing = parent.items.find((child) => slugifyPart(child.title) === key)
    if (existing) return existing
    const node: SidebarNode = { title, items: [] }
    parent.items.push(node)
    return node
  }

  ;(indexData.components as IndexItem[]).forEach((item) => {
    const slugParts = item.slug.split("/")
    const href = `/docs/components/${item.slug}`
    const detail = componentsDetails[item.slug]
    const tags = item.tags ?? detail?.tags

    let current = root
    slugParts.forEach((part: string, idx: number) => {
      const displayTitle = idx === slugParts.length - 1 ? item.title : part
      current = findOrCreate(current, displayTitle)
      if (idx === slugParts.length - 1) {
        current.href = href
        current.tags = tags
      }
    })
  })

  const sortNodes = (nodes?: SidebarNode[]) => {
    if (!nodes) return
    nodes.sort((a, b) => a.title.localeCompare(b.title))
    nodes.forEach((n) => sortNodes(n.items))
  }

  sortNodes(root.items)
  return {
    title: "Components",
    items: root.items ?? [],
  }
})()

const docsConfig = {
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        { title: "Introduction", href: "/docs/guide/introduction" },
        { title: "Installation", href: "/docs/guide/installation" },
        { title: "Tailwind V4", href: "/docs/guide/tailwind-v4" },
      ],
    },
    {
      title: "Tokens",
      items: [
        { title: "Colors", href: "/docs/tokens/colors" },
        { title: "Spacing", href: "/docs/tokens/spacing" },
        { title: "Shadows", href: "/docs/tokens/shadows" },
        { title: "Breakpoints", href: "/docs/tokens/breakpoints" },
        { title: "Typography", href: "/docs/tokens/typography" },
      ],
    },
    {
      title: componentsNav.title,
      items: componentsNav.items,
    },
  ],
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[90rem] flex-1 items-start px-4 md:grid md:grid-cols-[12rem_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
        <div className="h-full py-6 pr-6 lg:py-8">
          <Sidebar items={docsConfig.sidebarNav} />
        </div>
      </aside>
      <main className="relative min-w-0 py-6 lg:gap-8 lg:py-8 xl:grid xl:grid-cols-[1fr_12rem]">
        <div className="min-w-0">{children}</div>
        <TableOfContents />
      </main>
    </div>
  )
}
