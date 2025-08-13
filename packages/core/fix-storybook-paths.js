import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 修复 Storybook 9 静态部署路径问题
function fixStorybookPaths() {
  const storybookStaticDir = path.join(__dirname, "storybook-static")

  // 修复 index.html
  const indexPath = path.join(storybookStaticDir, "index.html")
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, "utf8")

    // 修复所有绝对路径为相对路径
    indexContent = indexContent.replace(/src="\/sb-/g, 'src="./sb-')
    indexContent = indexContent.replace(/href="\/sb-/g, 'href="./sb-')

    fs.writeFileSync(indexPath, indexContent)
  }

  // 修复 iframe.html
  const iframePath = path.join(storybookStaticDir, "iframe.html")
  if (fs.existsSync(iframePath)) {
    let iframeContent = fs.readFileSync(iframePath, "utf8")

    // 移除开发模式注入的脚本
    iframeContent = iframeContent.replace(
      /<script type="module" src="\/vite-inject-mocker-entry\.js"><\/script>/g,
      "",
    )

    // 修复所有绝对路径为相对路径
    iframeContent = iframeContent.replace(/src="\/sb-/g, 'src="./sb-')
    iframeContent = iframeContent.replace(/href="\/sb-/g, 'href="./sb-')
    iframeContent = iframeContent.replace(/src="\/assets\//g, 'src="./assets/')
    iframeContent = iframeContent.replace(/href="\/assets\//g, 'href="./assets/')

    fs.writeFileSync(iframePath, iframeContent)
  }

  // 修复 project.json 中的路径
  const projectPath = path.join(storybookStaticDir, "project.json")
  if (fs.existsSync(projectPath)) {
    let projectContent = fs.readFileSync(projectPath, "utf8")
    projectContent = projectContent.replace(/\/sb-/g, "./sb-")
    projectContent = projectContent.replace(/\/assets\//g, "./assets/")

    fs.writeFileSync(projectPath, projectContent)
  }
}

fixStorybookPaths()
