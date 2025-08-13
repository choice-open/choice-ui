import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import fs from "fs"
import path from "path"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  process.env = { ...process.env, ...env }
  
  const isProd = mode === 'production'
  
  return {
    base: isProd ? "./" : "/",
    plugins: [
      tsconfigPaths(),
      tailwindcss(),
      {
        name: "fix-storybook-modules",
        enforce: "pre",
      },
      {
        name: "copy-readme-files",
        closeBundle() {
          const componentsDir = path.resolve(__dirname, "app/components")
          const hooksDir = path.resolve(__dirname, "app/hooks")
          const utilsDir = path.resolve(__dirname, "app/utils")
          const llmsFile = path.resolve(__dirname, "llms.txt")
          const outputDir = path.resolve(__dirname, "storybook-static")
          
          // 递归查找并复制所有README.md文件
          function copyReadmeFiles(dir: string, relativePath = "") {
            const items = fs.readdirSync(dir)
            
            for (const item of items) {
              const fullPath = path.join(dir, item)
              const stat = fs.statSync(fullPath)
              
              if (stat.isDirectory()) {
                copyReadmeFiles(fullPath, path.join(relativePath, item))
              } else if (item === "README.md") {
                const targetDir = path.join(outputDir, relativePath)
                const targetPath = path.join(targetDir, item)
                
                // 创建目标目录
                fs.mkdirSync(targetDir, { recursive: true })
                
                // 复制文件
                fs.copyFileSync(fullPath, targetPath)
                console.log(`Copied: ${relativePath}/${item}`)
              }
            }
          }
          
          // 复制组件README文件
          copyReadmeFiles(componentsDir, "components")
          
          // 复制hooks README文件
          copyReadmeFiles(hooksDir, "hooks")
          
          // 复制utils README文件
          copyReadmeFiles(utilsDir, "utils")
          
          // 复制styles README文件
          const stylesDir = path.resolve(__dirname, "app/styles")
          copyReadmeFiles(stylesDir, "styles")
          
          // 复制llms.txt文件
          if (fs.existsSync(llmsFile)) {
            const targetPath = path.join(outputDir, "llms.txt")
            fs.copyFileSync(llmsFile, targetPath)
            console.log("Copied: llms.txt")
          }
          
          // 复制静态文件配置
          const headersFile = path.resolve(__dirname, "public/_headers")
          if (fs.existsSync(headersFile)) {
            const targetPath = path.join(outputDir, "_headers")
            fs.copyFileSync(headersFile, targetPath)
            console.log("Copied: _headers")
          }
          
          // 复制重定向配置
          const redirectsFile = path.resolve(__dirname, "public/_redirects")
          if (fs.existsSync(redirectsFile)) {
            const targetPath = path.join(outputDir, "_redirects")
            fs.copyFileSync(redirectsFile, targetPath)
            console.log("Copied: _redirects")
          }
          
          // 修复 Storybook 9 路径问题
          const fixStorybookPaths = () => {
            // 修复 index.html
            const indexPath = path.join(outputDir, 'index.html')
            if (fs.existsSync(indexPath)) {
              let indexContent = fs.readFileSync(indexPath, 'utf8')
              indexContent = indexContent.replace(/src="\/sb-/g, 'src="./sb-')
              indexContent = indexContent.replace(/href="\/sb-/g, 'href="./sb-')
              fs.writeFileSync(indexPath, indexContent)
              console.log('Fixed: index.html paths')
            }
            
            // 修复 iframe.html
            const iframePath = path.join(outputDir, 'iframe.html')
            if (fs.existsSync(iframePath)) {
              let iframeContent = fs.readFileSync(iframePath, 'utf8')
              // 移除开发模式注入的脚本
              iframeContent = iframeContent.replace(/<script type="module" src="\/vite-inject-mocker-entry\.js"><\/script>/g, '')
              // 修复路径
              iframeContent = iframeContent.replace(/src="\/sb-/g, 'src="./sb-')
              iframeContent = iframeContent.replace(/href="\/sb-/g, 'href="./sb-')
              iframeContent = iframeContent.replace(/src="\/assets\//g, 'src="./assets/')
              iframeContent = iframeContent.replace(/href="\/assets\//g, 'href="./assets/')
              fs.writeFileSync(iframePath, iframeContent)
              console.log('Fixed: iframe.html paths')
            }
          }
          
          // 执行路径修复
          fixStorybookPaths()
        },
      },
    ],
    build: {
      target: ["esnext"], // 设置为 esnext 以支持顶层 await
      rollupOptions: {
        // 忽略 eval 警告
        onwarn(warning, warn) {
          if (warning.code === "EVAL" || warning.message?.includes("Use of eval")) {
            return
          }
          warn(warning)
        },
        // 优化构建内存使用
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            storybook: ['@storybook/react']
          }
        }
      },
    },
    resolve: {
      alias: {
        "@storybook/addons": "@storybook/manager-api",
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext", // 设置 esbuild 目标也为 esnext
        loader: {
          ".mjs": "js",
        },
      },
    },
  }
})
