import { Sidebar } from "@/components/sidebar"
import components from "@/generated/components.json"

function slugifyPart(part: string): string {
  return part
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

type SidebarItem = {
  title: string
  href: string
}

type SidebarNode = {
  title: string
  href?: string
  items?: SidebarNode[]
}

const componentsNav: SidebarNode[] = (() => {
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

  components.forEach((doc) => {
    const groups = (doc.groups ?? []).length ? doc.groups : [doc.componentName]
    const href = `/docs/${doc.slug.map(slugifyPart).join("/")}`

    let current = root
    groups.forEach((part, idx) => {
      current = findOrCreate(current, part)
      if (idx === groups.length - 1) {
        current.href = href
      }
    })
  })

  const sortNodes = (nodes?: SidebarNode[]) => {
    if (!nodes) return
    nodes.sort((a, b) => a.title.localeCompare(b.title))
    nodes.forEach((n) => sortNodes(n.items))
  }

  sortNodes(root.items)
  return root.items ?? []
})()

const docsConfig = {
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        { title: "Introduction", href: "/docs" },
        { title: "Installation", href: "/docs/installation" },
      ],
    },
    ...componentsNav,
  ],
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
        <div className="h-full py-6 pr-6 lg:py-8">
          <Sidebar items={docsConfig.sidebarNav} />
        </div>
      </aside>
      <main className="relative min-w-0 py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
        {children}
      </main>
    </div>
  )
}
