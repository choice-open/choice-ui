import type { ArgTypes, Parameters } from "@storybook/types"

/** 索引项 - 用于侧边栏导航 */
export interface IndexItem {
  slug: string
  name: string
  title: string
  description: string
  version: string
  tags?: string[]
}

/** 包信息 */
export interface PackageInfo {
  name: string
  version: string
  description: string
  dependencies: Record<string, string>
  peerDependencies?: Record<string, string>
}

/** Props 文档 */
export interface PropDoc {
  name: string
  type: string
  required: boolean
  defaultValue?: string
  description: string
}

/** Props 组 */
export interface PropsGroup {
  displayName: string
  description: string
  props: PropDoc[]
}

/** Story 项 */
export interface StoryItem {
  id: string
  name: string
  exportName: string
  description: string
  source?: string
}

/** 组件详情 - 每个组件的完整数据 */
export interface ComponentDetail {
  slug: string
  title: string
  package: PackageInfo
  exports: string[]
  props: PropsGroup[]
  stories: StoryItem[]
  tags?: string[]
}

/** 缓存条目 */
export interface CacheEntry {
  hash: string
  index: IndexItem
  detail: ComponentDetail
}

/** 缓存数据 */
export interface CacheData {
  version: number
  entries: Record<string, CacheEntry>
}

export type MetaLike = {
  argTypes?: ArgTypes
  parameters?: Parameters
  component?: unknown
  title?: string
  tags?: string[]
}

export type StoryLike = {
  id: string
  name?: string
  parameters?: Parameters
  exportName?: string
}
