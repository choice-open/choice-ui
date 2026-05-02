/**
 * 组件发布脚本
 *
 * 功能：
 * 1. 构建指定组件或全部组件
 * 2. 发布时自动递增 patch 版本号
 * 3. 替换 workspace:* 为实际版本号
 * 4. 发布到 npm
 *
 * 用法：
 * - pnpm tsx scripts/publish-components.ts              # 发布所有组件
 * - pnpm tsx scripts/publish-components.ts button       # 发布单个组件
 * - pnpm tsx scripts/publish-components.ts --dry-run    # 干跑模式，不实际发布
 * - pnpm tsx scripts/publish-components.ts --build-only # 只构建，不发布
 */

import { execSync } from "child_process"
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs"
import { join, resolve } from "path"

// ============================================================================
// 类型定义
// ============================================================================

interface PackageJson {
  name: string
  version: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

interface ComponentInfo {
  name: string
  dir: string
  packageJson: PackageJson
  releaseVersion?: string
}

// ============================================================================
// 常量
// ============================================================================

const ROOT_DIR = resolve(__dirname, "..")
const COMPONENTS_DIR = resolve(ROOT_DIR, "packages/core/app/components")
const SHARED_PACKAGE_PATH = resolve(ROOT_DIR, "packages/shared/package.json")
const CORE_PACKAGE_PATH = resolve(ROOT_DIR, "packages/core/package.json")

// 解析命令行参数
const args = process.argv.slice(2)
const isDryRun = args.includes("--dry-run")
const isBuildOnly = args.includes("--build-only")
const targetComponents = args.filter((arg) => !arg.startsWith("--"))

// ============================================================================
// 工具函数
// ============================================================================

function log(message: string, type: "info" | "success" | "error" | "warn" = "info") {
  const prefix = {
    info: "ℹ️ ",
    success: "✅",
    error: "❌",
    warn: "⚠️ ",
  }
  console.log(`${prefix[type]} ${message}`)
}

function readPackageJson(path: string): PackageJson {
  return JSON.parse(readFileSync(path, "utf-8"))
}

function writePackageJson(path: string, content: PackageJson) {
  writeFileSync(path, JSON.stringify(content, null, 2) + "\n")
}

function exec(command: string, cwd?: string) {
  try {
    execSync(command, {
      cwd,
      stdio: "inherit",
      encoding: "utf-8",
    })
    return true
  } catch {
    return false
  }
}

function execSilent(command: string): string | null {
  try {
    return execSync(command, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }).trim()
  } catch {
    return null
  }
}

/**
 * 发布前确认 npm 已登录
 */
function verifyNpmAuth(): boolean {
  const npmUser = execSilent("npm whoami")
  if (!npmUser) {
    log("npm 未登录或当前 token 无效，请先运行 npm login 后再发布", "error")
    return false
  }

  log(`npm 登录账号: ${npmUser}`)
  return true
}

/**
 * 从 npm 获取包的已发布版本列表
 */
function getNpmVersions(packageName: string): string[] {
  const result = execSilent(`npm view ${packageName} versions --json`)
  if (!result) return []
  try {
    const versions = JSON.parse(result)
    return Array.isArray(versions) ? versions : [versions]
  } catch {
    return []
  }
}

/**
 * 递增 patch 版本号
 */
function incrementPatchVersion(version: string): string {
  const parts = version.split(".")
  if (parts.length !== 3) return version
  const [major, minor, patch] = parts
  const patchNumber = Number(patch)
  if (!Number.isInteger(patchNumber) || patchNumber < 0) return version
  return `${major}.${minor}.${patchNumber + 1}`
}

/**
 * 获取下一个发布版本号（每次发布默认递增 patch，并避开 npm 上已存在的版本）
 */
function getNextReleaseVersion(packageName: string, currentVersion: string): string {
  const npmVersions = getNpmVersions(packageName)
  let version = incrementPatchVersion(currentVersion)

  if (version === currentVersion) {
    log(`${packageName}@${currentVersion} 不是标准 x.y.z 版本号，无法自动递增`, "warn")
  }

  while (npmVersions.includes(version)) {
    const newVersion = incrementPatchVersion(version)
    log(`${packageName}@${version} 已存在，递增到 ${newVersion}`, "warn")
    if (newVersion === version) break
    version = newVersion
  }

  return version
}

// ============================================================================
// 版本解析
// ============================================================================

/**
 * 获取所有内部包的版本映射
 */
function getInternalVersions(): Map<string, string> {
  const versions = new Map<string, string>()

  // @choice-ui/shared 版本
  const sharedPkg = readPackageJson(SHARED_PACKAGE_PATH)
  versions.set("@choice-ui/shared", sharedPkg.version)

  // @choice-ui/react 版本
  const corePkg = readPackageJson(CORE_PACKAGE_PATH)
  versions.set("@choice-ui/react", corePkg.version)

  // 所有组件版本
  const componentDirs = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  for (const componentName of componentDirs) {
    const pkgPath = join(COMPONENTS_DIR, componentName, "package.json")
    if (existsSync(pkgPath)) {
      const pkg = readPackageJson(pkgPath)
      versions.set(pkg.name, pkg.version)
    }
  }

  return versions
}

/**
 * 替换 workspace:* 为实际版本号
 */
function resolveWorkspaceVersions(
  deps: Record<string, string> | undefined,
  versions: Map<string, string>,
): Record<string, string> | undefined {
  if (!deps) return undefined

  const resolved: Record<string, string> = {}
  for (const [name, version] of Object.entries(deps)) {
    if (version.startsWith("workspace:")) {
      const actualVersion = versions.get(name)
      if (actualVersion) {
        // workspace:* -> ^x.x.x, workspace:^ -> ^x.x.x
        resolved[name] = `^${actualVersion}`
      } else {
        log(`找不到包 ${name} 的版本`, "warn")
        resolved[name] = version
      }
    } else {
      resolved[name] = version
    }
  }
  return resolved
}

// ============================================================================
// 组件处理
// ============================================================================

/**
 * 获取所有组件信息
 */
function getAllComponents(): ComponentInfo[] {
  const componentDirs = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()

  const components: ComponentInfo[] = []

  for (const name of componentDirs) {
    const dir = join(COMPONENTS_DIR, name)
    const pkgPath = join(dir, "package.json")

    if (existsSync(pkgPath)) {
      components.push({
        name,
        dir,
        packageJson: readPackageJson(pkgPath),
      })
    }
  }

  return components
}

/**
 * 规划本次发布版本，并先更新版本映射供组件间依赖解析使用
 */
function planReleaseVersions(components: ComponentInfo[], versions: Map<string, string>) {
  for (const component of components) {
    const currentVersion = component.packageJson.version
    const releaseVersion = getNextReleaseVersion(component.packageJson.name, currentVersion)
    component.releaseVersion = releaseVersion
    versions.set(component.packageJson.name, releaseVersion)

    if (releaseVersion !== currentVersion) {
      log(`${component.packageJson.name} 计划发布 ${currentVersion} -> ${releaseVersion}`, "info")
    }
  }
}

/**
 * 写入本轮发布版本，让后续构建和发布都使用同一个新版本号
 */
function prepareComponentForRelease(component: ComponentInfo): string {
  const pkgPath = join(component.dir, "package.json")
  const originalContent = readFileSync(pkgPath, "utf-8")

  if (component.releaseVersion) {
    const pkg = readPackageJson(pkgPath)
    pkg.version = component.releaseVersion
    writePackageJson(pkgPath, pkg)
  }

  return originalContent
}

/**
 * 构建组件
 */
function buildComponent(component: ComponentInfo): boolean {
  log(`构建 ${component.packageJson.name}...`)
  return exec("pnpm run build", component.dir)
}

/**
 * 发布组件
 */
function publishComponent(
  component: ComponentInfo,
  versions: Map<string, string>,
  originalContent: string,
): boolean {
  const pkgPath = join(component.dir, "package.json")

  try {
    // 替换 workspace:* 版本
    const pkg = readPackageJson(pkgPath)
    pkg.dependencies = resolveWorkspaceVersions(pkg.dependencies, versions)
    pkg.devDependencies = resolveWorkspaceVersions(pkg.devDependencies, versions)
    pkg.peerDependencies = resolveWorkspaceVersions(pkg.peerDependencies, versions)

    // 写入修改后的 package.json
    writePackageJson(pkgPath, pkg)

    if (isDryRun) {
      log(`[DRY-RUN] 将发布 ${pkg.name}@${pkg.version}`, "info")
      // 恢复原始 package.json
      writeFileSync(pkgPath, originalContent)
      return true
    }

    // 发布
    log(`发布 ${pkg.name}@${pkg.version}...`)
    const success = exec("pnpm publish --access public --no-git-checks", component.dir)

    if (success) {
      log(`${pkg.name}@${pkg.version} 发布成功`, "success")
      // 发布成功后，更新本地 package.json 的版本号
      const localPkg = JSON.parse(originalContent) as PackageJson
      localPkg.version = pkg.version
      writeFileSync(pkgPath, JSON.stringify(localPkg, null, 2) + "\n")
      return true
    } else {
      log(`${pkg.name} 发布失败`, "error")
      // 发布失败时恢复原始内容
      writeFileSync(pkgPath, originalContent)
      return false
    }
  } catch (error) {
    // 出错时恢复原始 package.json
    writeFileSync(pkgPath, originalContent)
    throw error
  }
}

// ============================================================================
// 主流程
// ============================================================================

async function main() {
  console.log("\n🚀 Choice UI 组件发布工具\n")

  if (isDryRun) {
    log("干跑模式 - 不会实际发布", "warn")
  }

  if (isBuildOnly) {
    log("仅构建模式 - 不会发布", "warn")
  }

  // 获取版本映射
  const versions = getInternalVersions()
  log(`已加载 ${versions.size} 个内部包版本`)

  // 获取组件列表
  let components = getAllComponents()
  log(`找到 ${components.length} 个组件`)

  // 过滤目标组件
  if (targetComponents.length > 0) {
    components = components.filter((c) => targetComponents.includes(c.name))
    log(`过滤后: ${components.length} 个组件`)
  }

  if (components.length === 0) {
    log("没有找到要发布的组件", "warn")
    return
  }

  if (!isDryRun && !isBuildOnly && !verifyNpmAuth()) {
    return
  }

  if (!isBuildOnly) {
    planReleaseVersions(components, versions)
  }

  console.log("")

  // 构建和发布
  let successCount = 0
  let failCount = 0

  for (const component of components) {
    const originalContent = !isBuildOnly ? prepareComponentForRelease(component) : ""
    const buildSuccess = buildComponent(component)
    if (!buildSuccess) {
      if (!isBuildOnly) {
        writeFileSync(join(component.dir, "package.json"), originalContent)
      }
      log(`${component.name} 构建失败，跳过发布`, "error")
      failCount++
      continue
    }

    if (isBuildOnly) {
      log(`[BUILD-ONLY] 跳过发布 ${component.packageJson.name}`, "info")
      successCount++
      console.log("")
      continue
    }

    const publishSuccess = publishComponent(component, versions, originalContent)
    if (publishSuccess) {
      successCount++
    } else {
      failCount++
      log("发布失败，停止后续组件发布", "error")
      break
    }

    console.log("")
  }

  // 结果汇总
  console.log("━".repeat(50))
  log(`完成: ${successCount} 成功, ${failCount} 失败`, successCount > 0 ? "success" : "error")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
