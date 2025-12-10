#!/usr/bin/env node

import { program } from "commander"
import inquirer from "inquirer"
import { fileURLToPath } from "url"
import { dirname, join, resolve } from "path"
import { execSync } from "child_process"
import fs from "fs"
import { createRequire } from "module"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

const PRESETS = ["figma", "custom"]
const TOKEN_FORMATS = ["scss", "tailwind", "TypeScript"]

program
  .name("design-tokens-cli")
  .description("Design Tokens CLI - 生成设计令牌文件")
  .version(require("../package.json").version)

program
  .command("generate")
  .alias("gen")
  .description("交互式生成设计令牌文件")
  .action(async () => {
    try {
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "preset",
          message: "选择预设 (preset):",
          choices: PRESETS,
          default: "figma",
        },
        {
          type: "checkbox",
          name: "formats",
          message: "选择输出格式 (token):",
          choices: TOKEN_FORMATS,
          default: [],
          validate: (input) => {
            if (input.length === 0) {
              return "至少选择一个输出格式"
            }
            return true
          },
        },
        {
          type: "input",
          name: "outputDir",
          message: "输出目录 (默认: ./tokens-output):",
          default: "./tokens-output",
        },
      ])

      await generateTokens(answers)
    } catch (error) {
      console.error("❌ 生成失败:", error.message)
      process.exit(1)
    }
  })

program
  .command("generate:quick")
  .alias("gen:quick")
  .description("快速生成（使用命令行参数）")
  .option("-p, --preset <preset>", "预设 (figma|custom)", "figma")
  .option("-f, --formats <formats...>", "输出格式 (scss|tailwind|TypeScript)", TOKEN_FORMATS)
  .option("-o, --output <dir>", "输出目录", "./tokens-output")
  .action(async (options) => {
    try {
      const answers = {
        preset: options.preset,
        formats: Array.isArray(options.formats) ? options.formats : [options.formats],
        outputDir: options.output,
      }

      await generateTokens(answers)
    } catch (error) {
      console.error("❌ 生成失败:", error.message)
      process.exit(1)
    }
  })

async function generateTokens(options) {
  const { preset, formats, outputDir } = options

  console.log("\n🚀 开始生成设计令牌...\n")
  console.log(`📦 预设: ${preset}`)
  console.log(`📄 格式: ${formats.join(", ")}`)
  console.log(`📁 输出目录: ${outputDir}\n`)

  const rootDir = resolve(__dirname, "..")
  const outputPath = resolve(process.cwd(), outputDir)

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  try {
    if (preset === "custom") {
      console.log("ℹ️  自定义预设：请确保已配置 tokens/primitives/colors.cjs\n")
    }

    console.log("⏳ 步骤 1/3: 生成 W3C JSON 文件...")
    execSync("node scripts/build.cjs", {
      cwd: rootDir,
      stdio: "inherit",
    })
    console.log("✅ W3C JSON 文件生成完成\n")

    console.log("⏳ 步骤 2/3: 使用 Terrazzo 生成基础文件...")
    execSync("pnpm terrazzo", {
      cwd: rootDir,
      stdio: "inherit",
    })
    console.log("✅ Terrazzo 生成完成\n")

    console.log("⏳ 步骤 3/3: 复制指定格式的文件...")
    await copyFormatFiles(rootDir, outputPath, formats)

    console.log("\n🎉 生成完成！")
    console.log(`📁 输出目录: ${outputPath}\n`)

    console.log("📋 生成的文件:")
    const files = fs.readdirSync(outputPath)
    files.forEach((file) => {
      const filePath = join(outputPath, file)
      const stats = fs.statSync(filePath)
      if (stats.isFile()) {
        console.log(`   📄 ${file} (${(stats.size / 1024).toFixed(1)}KB)`)
      }
    })
  } catch (error) {
    console.error("❌ 生成过程中出错:", error.message)
    throw error
  }
}

async function copyFormatFiles(rootDir, outputDir, formats) {
  const distDir = join(rootDir, "dist")

  const formatMap = {
    scss: ["tokens.scss", "functions.scss", "mixins.scss"],
    tailwind: ["tailwind.css", "tailwind-theme.js"],
    TypeScript: ["tokens.js", "tokens.d.ts"],
  }

  // 收集所有需要保留的文件
  const filesToKeep = new Set()
  for (const format of formats) {
    const files = formatMap[format] || []
    files.forEach((file) => filesToKeep.add(file))
  }

  // 清理输出目录中不属于当前选择格式的文件
  if (fs.existsSync(outputDir)) {
    const existingFiles = fs.readdirSync(outputDir)
    for (const file of existingFiles) {
      const filePath = join(outputDir, file)
      const stats = fs.statSync(filePath)
      if (stats.isFile() && !filesToKeep.has(file)) {
        fs.unlinkSync(filePath)
        console.log(`   🗑️  已删除: ${file}`)
      }
    }
  }

  // 复制新文件
  for (const format of formats) {
    const files = formatMap[format] || []

    if (files.length === 0) {
      console.warn(`⚠️  未找到格式 "${format}" 的映射文件`)
      continue
    }

    for (const file of files) {
      const sourcePath = join(distDir, file)
      const targetPath = join(outputDir, file)

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath)
        console.log(`   ✅ 已复制: ${file}`)
      } else {
        console.warn(`   ⚠️  文件不存在: ${file}`)
      }
    }
  }
}

if (process.argv.length === 2) {
  program.help()
}

program.parse(process.argv)



