import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { Stackflow, useStackflowContext } from "."
import { Button } from "../button"
import { SearchInput } from "../search-input"

const meta: Meta<typeof Stackflow> = {
  title: "Navigation/Stackflow",
  component: Stackflow,
  tags: ["new"],
}

export default meta
type Story = StoryObj<typeof Stackflow>

// 导航控制组件
const NavigationControls = () => {
  const { push, back, clearHistory, canGoBack, history, current } = useStackflowContext()

  return (
    <div className="flex flex-col gap-4 border-b p-4">
      <div className="flex items-center gap-2">
        <span className="font-medium">Navigate to:</span>
        <Button
          variant="secondary"
          onClick={() => push("home")}
        >
          Home
        </Button>
        <Button
          variant="secondary"
          onClick={() => push("about")}
        >
          About
        </Button>
        <Button
          variant="secondary"
          onClick={() => push("contact")}
        >
          Contact
        </Button>
        <Button
          variant="secondary"
          onClick={() => push("settings")}
        >
          Settings
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          disabled={!canGoBack}
          onClick={back}
        >
          Back
        </Button>
        <Button
          variant="link-danger"
          onClick={clearHistory}
        >
          Clear History
        </Button>
      </div>
      <span className="text-secondary-foreground">
        Current: {current?.id || "None"} | History: [{history.join(" → ")}]
      </span>
    </div>
  )
}

// 页面内容组件
const PageContent = ({
  title,
  description,
  color = "blue",
}: {
  color?: string
  description: string
  title: string
}) => {
  const { push } = useStackflowContext()

  return (
    <div className="p-8">
      <h2 className={`text-2xl font-bold text-${color}-800 mb-4`}>{title}</h2>
      <p className={`text-${color}-600 mb-6`}>{description}</p>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => push("home")}
        >
          Go to Home
        </Button>
        <Button
          variant="secondary"
          onClick={() => push("about")}
        >
          Go to About
        </Button>
        <Button
          variant="secondary"
          onClick={() => push("contact")}
        >
          Go to Contact
        </Button>
        <Button
          variant="secondary"
          onClick={() => push("settings")}
        >
          Go to Settings
        </Button>
      </div>
    </div>
  )
}

// 多层嵌套的节点分类数据
type CategoryNode = {
  children?: (CategoryNode | NodeItem)[]
  color: string
  description: string
  id: string
  label: string
  type: "category"
}

type NodeItem = {
  color: string
  description: string
  id: string
  label: string
  type: "node"
}

const NODE_CATEGORIES: CategoryNode[] = [
  {
    id: "trigger",
    label: "触发器ABC",
    description: "用于启动工作流执行",
    color: "blue",
    type: "category",
    children: [
      {
        id: "webhook-category",
        label: "网络触发器EFG",
        description: "基于网络的触发方式",
        color: "blue",
        type: "category",
        children: [
          {
            id: "webhook",
            label: "Webhook节点A123",
            description: "HTTP webhook触发",
            color: "blue",
            type: "node",
          },
          {
            id: "api-trigger",
            label: "API触发器",
            description: "REST API触发",
            color: "blue",
            type: "node",
          },
        ],
      },
      {
        id: "timer-category",
        label: "时间触发器",
        description: "基于时间的触发方式",
        color: "blue",
        type: "category",
        children: [
          {
            id: "cron",
            label: "定时器A456",
            description: "Cron定时任务",
            color: "blue",
            type: "node",
          },
          {
            id: "interval",
            label: "间隔触发",
            description: "固定间隔触发",
            color: "blue",
            type: "node",
          },
        ],
      },
    ],
  },
  {
    id: "action",
    label: "操作",
    description: "执行具体的业务操作",
    color: "green",
    type: "category",
    children: [
      {
        id: "http-category",
        label: "网络操作",
        description: "HTTP相关操作",
        color: "green",
        type: "category",
        children: [
          {
            id: "http-request",
            label: "HTTP请求A789",
            description: "发送HTTP请求",
            color: "green",
            type: "node",
          },
          {
            id: "graphql",
            label: "GraphQL查询",
            description: "GraphQL API调用",
            color: "green",
            type: "node",
          },
        ],
      },
      { id: "email", label: "发送邮件", description: "邮件发送功能", color: "green", type: "node" },
    ],
  },
  {
    id: "ai",
    label: "AI智能",
    description: "人工智能相关操作",
    color: "pink",
    type: "category",
    children: [
      {
        id: "text-gen",
        label: "文本生成A999",
        description: "AI文本生成",
        color: "pink",
        type: "node",
      },
      {
        id: "image-rec",
        label: "图像识别",
        description: "AI图像识别",
        color: "pink",
        type: "node",
      },
    ],
  },
]

// 搜索结果类型
type SearchResultItem = {
  categoryId?: string
  categoryLabel?: string
  color: string
  description: string
  id: string
  label: string
  type: "category" | "node"
}

// 递归搜索嵌套结构
const searchInTree = (
  items: (CategoryNode | NodeItem)[],
  query: string,
): { categories: SearchResultItem[]; nodes: SearchResultItem[] } => {
  const categories: SearchResultItem[] = []
  const nodes: SearchResultItem[] = []

  const searchRecursive = (items: (CategoryNode | NodeItem)[], currentPath: string[]) => {
    items.forEach((item) => {
      const itemMatches =
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())

      if (item.type === "category") {
        // 只有分类本身匹配时才显示
        if (itemMatches) {
          categories.push({
            type: "category",
            id: item.id,
            label: item.label,
            description: item.description,
            color: item.color,
          })
        }

        // 继续递归搜索子项（无论当前分类是否匹配）
        if (item.children) {
          searchRecursive(item.children, [...currentPath, item.label])
        }
      } else {
        // 节点匹配
        if (itemMatches) {
          const pathStr = currentPath.length > 0 ? currentPath.join(" > ") : ""
          nodes.push({
            type: "node",
            id: item.id,
            label: item.label,
            description: pathStr ? `${pathStr} > ${item.label}` : item.description,
            color: item.color,
          })
        }
      }
    })
  }

  searchRecursive(items, [])

  // 去重（避免重复添加）
  const uniqueCategories = categories.filter(
    (cat, index, self) => index === self.findIndex((c) => c.id === cat.id),
  )

  return { categories: uniqueCategories, nodes }
}

// 搜索逻辑：返回分组的搜索结果
const getSearchResults = (
  query: string,
): { categories: SearchResultItem[]; nodes: SearchResultItem[] } => {
  if (!query.trim()) {
    return {
      categories: NODE_CATEGORIES.map((cat) => ({
        type: "category" as const,
        id: cat.id,
        label: cat.label,
        description: cat.description,
        color: cat.color,
      })),
      nodes: [],
    }
  }

  return searchInTree(NODE_CATEGORIES, query)
}

// 分类列表组件
const CategoryList = ({ searchQuery = "" }: { searchQuery?: string }) => {
  const { push } = useStackflowContext()
  const { categories, nodes } = getSearchResults(searchQuery)

  if (categories.length === 0 && nodes.length === 0) {
    return (
      <div className="p-6">
        <h2 className="mb-6 text-xl font-bold text-gray-800">搜索结果</h2>
        <div className="py-8 text-center text-gray-500">
          <p>未找到匹配 &ldquo;{searchQuery}&rdquo; 的结果</p>
          <p className="mt-2 text-sm">请尝试其他关键词</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-bold text-gray-800">
        {searchQuery ? `搜索结果 (${categories.length + nodes.length})` : "节点分类"}
      </h2>

      {/* 分类结果 */}
      {categories.length > 0 && (
        <div className="mb-6 space-y-3">
          {searchQuery && (
            <h3 className="mb-3 text-sm font-medium text-gray-600">分类 ({categories.length})</h3>
          )}
          {categories.map((item) => (
            <div
              key={item.id}
              className={`p-4 bg-${item.color}-50 border border-${item.color}-200 cursor-pointer rounded-lg hover:bg-${item.color}-100 transition-colors`}
              onClick={() => push(item.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-semibold text-${item.color}-800`}>{item.label}</h3>
                  <p className={`text-sm text-${item.color}-600 mt-1`}>{item.description}</p>
                  {!searchQuery && <span className={`text-xs text-${item.color}-500`}>分类</span>}
                </div>
                <div className={`text-${item.color}-400`}>→</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 节点结果 */}
      {nodes.length > 0 && (
        <div className="space-y-3">
          <h3 className="mb-3 text-sm font-medium text-gray-600">节点 ({nodes.length})</h3>
          {nodes.map((item) => (
            <div
              key={item.id}
              className={`p-4 bg-${item.color}-50 border border-${item.color}-200 cursor-pointer rounded-lg hover:bg-${item.color}-100 transition-colors`}
              onClick={() => {
                // 节点点击后的行为 - 可以是选择节点或其他操作
                alert(`选择了节点: ${item.label}`)
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-semibold text-${item.color}-800`}>{item.label}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// 分类详情组件
const CategoryDetail = ({ categoryId }: { categoryId: string }) => {
  const { push, back } = useStackflowContext()
  const category = findCategoryById(NODE_CATEGORIES, categoryId)

  if (!category) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">分类不存在</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={back}
          className="text-gray-500 hover:text-gray-700"
        >
          ← 返回
        </button>
        <div>
          <h2 className={`text-xl font-bold text-${category.color}-800`}>{category.label}</h2>
          <p className={`text-sm text-${category.color}-600`}>{category.description}</p>
        </div>
      </div>

      <div className="space-y-2">
        {category.children?.map((item, index) => (
          <div
            key={item.id || index}
            className={`p-3 bg-${category.color}-50 border border-${category.color}-200 rounded-lg hover:bg-${category.color}-100 cursor-pointer transition-colors`}
            onClick={() => {
              if (item.type === "category") {
                // 导航到子分类
                push(item.id)
              } else {
                // 选择节点
                alert(`选择了节点: ${item.label}`)
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className={`font-medium text-${category.color}-800`}>{item.label}</span>
                {item.type === "category" && (
                  <span className={`ml-2 text-xs text-${category.color}-500`}>分类</span>
                )}
              </div>
              <span className={`text-${category.color}-400 text-sm`}>
                {item.type === "category" ? "→" : "选择"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 带搜索功能的节点列表组件
const NodesListWithSearch = () => {
  const [searchValue, setSearchValue] = useState("")

  return (
    <>
      <Stackflow.Prefix className="border-b bg-white p-4">
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          placeholder="搜索分类或节点..."
          className="w-full"
        />
      </Stackflow.Prefix>

      <Stackflow.Item id="categories">
        <CategoryList searchQuery={searchValue} />
      </Stackflow.Item>

      {NODE_CATEGORIES.map((category) => (
        <Stackflow.Item
          key={category.id}
          id={category.id}
        >
          <CategoryDetail categoryId={category.id} />
        </Stackflow.Item>
      ))}
    </>
  )
}

// 递归收集所有分类ID
const getAllCategoryIds = (items: (CategoryNode | NodeItem)[]): string[] => {
  const ids: string[] = []

  items.forEach((item) => {
    if (item.type === "category") {
      ids.push(item.id)
      if (item.children) {
        ids.push(...getAllCategoryIds(item.children))
      }
    }
  })

  return ids
}

// 递归查找分类
const findCategoryById = (
  items: (CategoryNode | NodeItem)[],
  id: string,
): CategoryNode | undefined => {
  for (const item of items) {
    if (item.type === "category" && item.id === id) {
      return item
    }
    if (item.type === "category" && item.children) {
      const found = findCategoryById(item.children, id)
      if (found) return found
    }
  }
  return undefined
}

// 完整的节点列表示例组件
const CompleteNodesListExample = () => {
  const [searchValue, setSearchValue] = useState("")
  const allCategoryIds = getAllCategoryIds(NODE_CATEGORIES)

  return (
    <Stackflow
      className="w-80 overflow-y-auto rounded-lg border shadow-lg"
      defaultId="categories"
    >
      <Stackflow.Prefix className="border-b bg-white p-4">
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Search..."
          className="w-full"
        />
      </Stackflow.Prefix>

      <Stackflow.Item id="categories">
        <CategoryList searchQuery={searchValue} />
      </Stackflow.Item>

      {allCategoryIds.map((categoryId) => (
        <Stackflow.Item
          key={categoryId}
          id={categoryId}
        >
          <CategoryDetail categoryId={categoryId} />
        </Stackflow.Item>
      ))}
    </Stackflow>
  )
}

export const NodesListExample: Story = {
  render: () => <CompleteNodesListExample />,
}

export const Basic: Story = {
  render: () => (
    <Stackflow
      className="w-96 rounded-lg border shadow-lg"
      defaultId="about"
    >
      <Stackflow.Prefix>
        <NavigationControls />
      </Stackflow.Prefix>

      <Stackflow.Item id="home">
        <PageContent
          title="Home"
          description="Welcome to the home page! This is a non-linear navigation demo. You can click any button to go to other pages."
          color="blue"
        />
      </Stackflow.Item>

      <Stackflow.Item id="about">
        <PageContent
          title="About"
          description="This is the about page. From here you can jump to any other page, and the system will record your visit history."
          color="green"
        />
      </Stackflow.Item>

      <Stackflow.Item id="contact">
        <PageContent
          title="Contact"
          description="This is the contact page. Observe the top history record, you can see the complete access path."
          color="yellow"
        />
      </Stackflow.Item>

      <Stackflow.Item id="settings">
        <PageContent
          title="Settings"
          description="This is the settings page. Try clicking the 'Back' button, and you will return step by step according to the access history."
          color="purple"
        />
      </Stackflow.Item>

      <Stackflow.Suffix>
        <div className="text-secondary-foreground bg-secondary-background border-t p-4">
          Tip: This is a non-linear navigation - you can jump from any page to any page
        </div>
      </Stackflow.Suffix>
    </Stackflow>
  ),
}
