#!/usr/bin/env tsx
/**
 * 脚本：自动重排 Storybook stories 的顺序
 *
 * 使用方法：
 *   pnpm tsx scripts/reorder-stories.ts <component-name>
 *
 * 例如：
 *   pnpm tsx scripts/reorder-stories.ts select
 */

import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

// 定义每个组件的 story 顺序规划
const STORY_ORDERS: Record<string, string[]> = {
  select: [
    "Basic",
    "Disabled",
    "DisabledOptions",
    "Large",
    "Light",
    "WithIcons",
    "WithLabels",
    "WithDivider",
    "LongList",
    "Placement",
    "MatchTriggerWidth",
    "CompoundComponent",
    "ItemActive",
    "CloseOnEscape",
    "Readonly",
    "MarginalConditions",
    "Multiple",
  ],
  dropdown: [
    "Basic",
    "Disabled",
    "Large",
    "Light",
    "WithPrefix",
    "WithShortcuts",
    "WithLabels",
    "LongList",
    "Placement",
    "MatchTriggerWidth",
    "Readonly",
    "TriggerAsChild",
    "Nested",
    "NestedInPopover",
    "Selection",
    "NestedSelection",
    "WithSearch",
    "ComplexMenu",
    "CoordinateMode",
    "MentionsWithCoordinateMode",
    "WithTriggerRef",
    "WithTriggerSelector",
    "MultipleDropdowns",
    "NestedMenuClickTest",
    "NestedSubmenuWithLongList",
  ],
  "multi-select": [
    "Basic",
    "Disabled",
    "DisabledItems",
    "Large",
    "Light",
    "WithIcons",
    "WithDividers",
    "LongList",
    "WithLimits",
    "ExclusiveOptions",
    "CloseOnSelect",
    "ValidationMessages",
    "MaxChips",
    "ChipVariant",
    "CustomChip",
    "Readonly",
  ],
  "context-menu": [
    "Basic",
    "WithDisabledItems",
    "WithDisabled",
    "Light",
    "WithDividers",
    "WithSelection",
    "SharedMenuContent",
    "NestedSubmenus",
    "ContextMenuNestedDropdown",
    "NestedSubmenuWithLongList",
    "WithTriggerRef",
    "WithTriggerSelector",
    "NestedContextMenuInPopover",
    "Readonly",
    "FileManagerExample",
    "SimpleDropdownNested",
  ],
  combobox: [
    "Basic",
    "Disabled",
    "Empty",
    "Large",
    "Light",
    "LongList",
    "CustomWidth",
    "Clearable",
    "Controlled",
    "CoordinateMode",
    "MentionsWithSlate",
    "Readonly",
  ],
}

interface StoryBlock {
  name: string
  fullText: string
}

/**
 * 提取 story 名称
 */
function extractStoryName(line: string): string | null {
  const match = line.match(/^export const (\w+):\s*Story\s*=/)
  return match ? match[1] : null
}

/**
 * 提取常量定义（在 header 中）
 */
function extractConstants(header: string): Map<string, string> {
  const constants = new Map<string, string>()
  const lines = header.split("\n")

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    // 匹配 const 或 export const 常量定义
    const constMatch = line.match(/^(?:export\s+)?const\s+(\w+)\s*[:=]/)
    if (constMatch) {
      const constName = constMatch[1]
      let braceCount = 0
      let bracketCount = 0
      const start = i
      let constContent = line

      // 检查是否有数组或对象
      if (line.includes("[")) bracketCount++
      if (line.includes("{")) braceCount++

      i++
      while (i < lines.length) {
        const currentLine = lines[i]
        constContent += "\n" + currentLine

        bracketCount += (currentLine.match(/\[/g) || []).length
        bracketCount -= (currentLine.match(/\]/g) || []).length
        braceCount += (currentLine.match(/{/g) || []).length
        braceCount -= (currentLine.match(/}/g) || []).length

        // 如果数组和对象都闭合了，且行末有分号或右括号
        if (
          bracketCount === 0 &&
          braceCount === 0 &&
          (currentLine.trim().endsWith("]") || currentLine.trim().endsWith(";"))
        ) {
          i++
          break
        }

        i++
      }

      constants.set(constName, constContent)
    } else {
      i++
    }
  }

  return constants
}

/**
 * 解析文件，提取所有 story 块（包括前面的注释）
 */
function parseStories(content: string): {
  header: string
  stories: Map<string, StoryBlock>
  constants: Map<string, string>
} {
  const lines = content.split("\n")
  const stories = new Map<string, StoryBlock>()

  // 找到第一个 story 的位置
  let firstStoryIndex = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^export const \w+:\s*Story\s*=/)) {
      firstStoryIndex = i
      break
    }
  }

  if (firstStoryIndex === -1) {
    throw new Error("未找到任何 story 定义")
  }

  const header = lines.slice(0, firstStoryIndex).join("\n")
  const constants = extractConstants(header)

  // 逐行解析每个 story
  let i = firstStoryIndex
  while (i < lines.length) {
    const storyName = extractStoryName(lines[i])
    if (!storyName) {
      i++
      continue
    }

    // 向前查找注释（最多向前查找 20 行）
    let commentStart = i
    let commentEnd = i

    // 从 story 行向前查找，找到最近的注释块
    for (let j = i - 1; j >= Math.max(0, i - 20); j--) {
      const line = lines[j].trim()

      // 如果遇到注释结束标记
      if (line === "*/" || (line.includes("*/") && !line.startsWith("/**"))) {
        commentEnd = j
        continue
      }

      // 如果遇到注释开始
      if (line.startsWith("/**")) {
        commentStart = j
        break
      }

      // 如果遇到非空行且不是注释相关，停止查找
      if (line !== "" && !line.startsWith("*") && !line.startsWith("//")) {
        break
      }
    }

    // 如果找到了注释，从注释开始提取；否则从 story 开始提取
    const extractStart = commentStart < i ? commentStart : i

    // 找到 story 的结束位置（匹配大括号）
    let braceCount = 0
    let storyEnd = i
    let foundOpeningBrace = false

    for (let k = i; k < lines.length; k++) {
      const line = lines[k]

      // 计算大括号
      for (const char of line) {
        if (char === "{") {
          braceCount++
          foundOpeningBrace = true
        } else if (char === "}") {
          braceCount--
        }
      }

      // 如果找到了开括号且大括号匹配完成
      if (foundOpeningBrace && braceCount === 0) {
        storyEnd = k
        break
      }
    }

    // 提取完整的 story 块（包括注释）
    const storyLines = lines.slice(extractStart, storyEnd + 1)
    const fullText = storyLines.join("\n")

    stories.set(storyName, {
      name: storyName,
      fullText,
    })

    // 移动到下一个 story
    i = storyEnd + 1
  }

  return { header, stories, constants }
}

/**
 * 重新排列 stories
 */
function reorderStories(filePath: string, componentName: string): void {
  const order = STORY_ORDERS[componentName]
  if (!order) {
    throw new Error(`未找到组件 ${componentName} 的顺序规划`)
  }

  console.log(`📖 读取文件: ${filePath}`)
  const content = readFileSync(filePath, "utf-8")

  console.log(`🔍 解析 stories...`)
  const { header, stories, constants } = parseStories(content)

  console.log(`   找到 ${stories.size} 个 stories`)
  if (constants.size > 0) {
    console.log(`   找到 ${constants.size} 个常量: ${Array.from(constants.keys()).join(", ")}`)
  }

  // 按照顺序重新排列
  const orderedStories: string[] = []
  const foundStories = new Set<string>()
  const usedConstants = new Set<string>()

  // 添加规划中的 stories
  for (const storyName of order) {
    const story = stories.get(storyName)
    if (story) {
      // 检查 story 中使用的常量
      for (const [constName, constValue] of constants.entries()) {
        if (story.fullText.includes(constName) && !usedConstants.has(constName)) {
          // 在 story 之前插入常量定义
          orderedStories.push(constValue)
          usedConstants.add(constName)
          console.log(`   📌 在 ${storyName} 之前插入常量: ${constName}`)
        }
      }

      orderedStories.push(story.fullText)
      foundStories.add(storyName)
    } else {
      console.warn(`⚠️  未找到 story: ${storyName}`)
    }
  }

  // 添加未在规划中的 stories（放在最后）
  for (const [name, story] of stories.entries()) {
    if (!foundStories.has(name)) {
      console.warn(`⚠️  发现未规划的 story: ${name}，将放在最后`)
      orderedStories.push(story.fullText)
    }
  }

  // 组合最终内容
  const headerTrimmed = header.trimEnd()
  const newContent = [headerTrimmed, ...orderedStories].join("\n\n")

  // 写入文件
  console.log(`💾 写入文件...`)
  writeFileSync(filePath, newContent, "utf-8")
  console.log(`✅ 已重新排列 ${componentName} 的 stories`)
  console.log(`   共处理 ${foundStories.size} 个 stories`)
  if (stories.size > foundStories.size) {
    console.log(`   发现 ${stories.size - foundStories.size} 个未规划的 stories`)
  }
}

// 主函数
function main() {
  const componentName = process.argv[2]

  if (!componentName) {
    console.error("❌ 请提供组件名称")
    console.error("使用方法: pnpm tsx scripts/reorder-stories.ts <component-name>")
    console.error("支持的组件:", Object.keys(STORY_ORDERS).join(", "))
    process.exit(1)
  }

  if (!STORY_ORDERS[componentName]) {
    console.error(`❌ 未找到组件 ${componentName} 的顺序规划`)
    console.error("支持的组件:", Object.keys(STORY_ORDERS).join(", "))
    process.exit(1)
  }

  const fileName =
    componentName === "multi-select" ? "multi-select.stories.tsx" : `${componentName}.stories.tsx`
  const filePath = join(
    __dirname,
    "..",
    "packages",
    "storybook",
    "stories",
    componentName,
    fileName,
  )

  try {
    reorderStories(filePath, componentName)
  } catch (error) {
    console.error("❌ 错误:", error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

main()
