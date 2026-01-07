/**
 * 构建 Worker 脚本
 * 使用 esbuild 把 Worker 和所有依赖打包成一个自包含的 IIFE 字符串
 * 然后生成一个 TypeScript 文件导出这个字符串
 */
import * as esbuild from "esbuild"
import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")

async function buildWorker() {
  const workerEntry = path.resolve(
    rootDir,
    "src/workers/boundary-calculator.worker.ts",
  )
  const outputFile = path.resolve(
    rootDir,
    "src/workers/boundary-calculator.worker.bundled.ts",
  )

  // 使用 esbuild 打包 Worker
  // 使用 iife 格式，不设置 globalName - 这样 side effects (如 self.onmessage 赋值) 会直接执行
  const result = await esbuild.build({
    entryPoints: [workerEntry],
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "es2020",
    minify: true,
    write: false,
  })

  const workerCode = result.outputFiles[0].text

  // 在 Worker 代码前添加全局错误捕获
  const wrappedWorkerCode = `
self.onerror = function(message, source, lineno, colno, error) {
  self.postMessage({ id: -1, error: 'Worker global error: ' + message });
  return true;
};

try {
${workerCode}
} catch (e) {
  self.postMessage({ id: -1, error: 'Worker init error: ' + (e.message || e) });
}

// 发送初始化完成消息
self.postMessage({ id: 0, status: 'ready' });
`

  // 生成导出 Worker 代码的 TypeScript 文件
  const output = `// 此文件由 scripts/build-worker.ts 自动生成，请勿手动编辑
// 运行 pnpm build:worker 重新生成

export const BOUNDARY_WORKER_CODE = ${JSON.stringify(wrappedWorkerCode)};

// 创建 Worker 的函数
export const createBoundaryWorker = (): Worker | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const blob = new Blob([BOUNDARY_WORKER_CODE], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);

    // 延迟清理 URL，确保 Worker 有足够时间加载
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

    return worker;
  } catch {
    return null;
  }
};
`

  fs.writeFileSync(outputFile, output)
  console.log(`Worker bundled successfully: ${outputFile}`)
}

buildWorker().catch((err) => {
  console.error("Failed to build worker:", err)
  process.exit(1)
})
