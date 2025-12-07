# Choice UI 自定义主题生成工作流设计文档

本文档详细描述了 Choice UI 的自定义主题系统架构。该系统允许用户通过 Web 界面可视化配置品牌色，利用 AI/算法自动生成完整的 Design Tokens，并通过 CLI 工具将配置应用到代码库中。

## 1. 架构概览

整体流程采用 **"配置与构建分离"** 的模式：

1.  **Web Theme Builder (前端)**: 负责交互、计算、预览和导出配置。
2.  **Configuration (协议)**: 通过 JSON 文件传递数据，实现解耦。
3.  **CLI Tool (后端)**: 负责读取配置、修改源码并触发标准构建流程。

```mermaid
graph TD
    User[用户输入 Brand Color] -->|Web UI| Builder[Web Theme Builder]
    Builder -->|Web Worker| Algo[色彩生成算法]
    Algo -->|1. 生成色阶| Base[Base Colors]
    Algo -->|2. 自动映射| Semantic[Semantic Config]
    Base & Semantic -->|3. 实时预览| Preview[Inject CSS Vars]
    Builder -->|Schema 验证 & 导出| JSON[choice-theme.json]

    JSON -->|输入 & Schema 验证| CLI[Choice Token CLI]
    CLI -->|解析 & 写入| Source[tokens/primitives/colors.cjs]
    Source -->|npm run build| Terrazzo[Terrazzo Build]
    Terrazzo -->|产出| Dist[dist/ (CSS/SCSS/TS)]
```

---

## 2. Web Theme Builder (Docs 页面)

位于文档站的一个独立页面，提供所见即所得的配置体验。

### 2.1 核心功能

- **输入**: 用户选择主色 (Primary Color)，可选配置成功/警告/危险色及中性色倾向。
- **计算**: 使用 OKLCH 或 HCT 色彩空间进行插值计算，确保色阶的感官均匀性和可访问性。
- **预览**: 实时生成 CSS 变量并注入当前页面，预览组件在不同主题下的效果。
- **导出**: 生成标准化的 `choice-theme.json` 文件。

### 2.2 技术实现 (Web Worker)

为了避免阻塞 UI 线程并实现逻辑复用，核心计算逻辑运行在 Web Worker 中。

**Worker 职责**:

1.  **Generate Base Colors**:
    - 输入: Hex Color
    - 输出: 10 级色阶 RGB 数组 (e.g., `[50, 100, ..., 950]`)
    - 算法: 保持 Hue 不变，调整 Lightness 和 Chroma。
2.  **Generate Pale Colors**:
    - 基于 Base Colors，大幅降低饱和度，生成背景用色。
3.  **Semantic Mapping**:
    - 根据预设规则，将 Semantic Keys 映射到生成的 Base Colors 色阶上。
4.  **Validation**:
    - 使用 `theme-config.schema.json` 验证生成的数据结构是否合规。
5.  **Stringify**:
    - 生成用于预览的 CSS 字符串。
    - 生成用于下载的 JSON 对象。

### 2.3 语义映射规则 (自动分配)

Web 端维护一套映射表，确保生成的 Token 符合组件库规范。

| Semantic Token        | Light Mode 映射 | Dark Mode 映射   |
| :-------------------- | :-------------- | :--------------- |
| `text-accent`         | `brand-600`     | `brand-400`      |
| `background-selected` | `brand-200`     | `brand-pale-700` |
| `background-accent`   | `brand-500`     | `brand-500`      |
| ...                   | ...             | ...              |

---

## 3. 数据协议与验证 (JSON Schema)

`choice-theme.json` 是连接 Web 和 CLI 的桥梁。为了确保数据的安全性和一致性，我们定义了严格的 JSON Schema。

**Schema 文件**: `packages/design-tokens/schemas/theme-config.schema.json`

### 3.1 核心约束

1.  **Base Colors**:
    - Keys 必须符合 `^[a-z]+-\d+$` 格式 (如 `brand-500`)。
    - Values 必须是长度为 3 的 RGB 整数数组 (如 `[255, 0, 0]`)。
2.  **Semantic Config**:
    - Keys 必须在允许的白名单内 (一个不能多，一个不能少)。
    - Values 必须是字符串引用 (如 `"brand-600"`)。
3.  **Meta Info**: 必须包含版本号和创建时间。

### 3.2 示例数据

```json
{
  "meta": {
    "version": "1.0.0",
    "themeName": "Custom Brand",
    "createdAt": "2023-10-27T10:00:00Z"
  },
  "baseColors": {
    "light": {
      "brand-100": [224, 231, 255],
      "brand-500": [79, 70, 229],
      "brand-600": [67, 56, 202],
      "brand-950": [30, 27, 75],
      // ... 包含 success, warning, danger 等所有基础色阶
      "gray-100": [243, 244, 246]
    },
    "dark": {
      // ... 暗色模式基础色阶
    },
    "pale": {
      "brand-pale-100": [240, 242, 255]
      // ... Pale 色阶
    }
  },
  "semanticConfig": {
    "light": {
      "text-accent": "brand-600",
      "background-selected": "brand-200"
      // ...
    },
    "dark": {
      "text-accent": "brand-400",
      "background-selected": "brand-pale-700"
      // ...
    }
  }
}
```

---

## 4. CLI Tool 设计

CLI 工具负责将 JSON 配置落地为项目源码。

### 4.1 命令

```bash
# 在项目根目录运行
pnpm choice-tokens apply --config ./choice-theme.json
```

### 4.2 执行逻辑

1.  **读取**: 解析 `choice-theme.json`。
2.  **验证**: **使用 JSON Schema 严格校验配置文件的合法性。如果不通过，直接报错退出，不进行任何文件写入。**
3.  **生成源码**:
    - 读取 `packages/design-tokens/tokens/primitives/colors.cjs` 的AST或模板。
    - 替换 `baseColorsLight`, `baseColorsDark`, `paleColors` 的内容。
    - 替换 `semanticColorsLight`, `semanticColorsDark` 的映射关系。
    - **关键约束**: 保持文件原有的 `exports` 结构不变。
4.  **构建**: 自动执行 `pnpm run build` (在 `design-tokens` 包内)。
    - 这将触发 Terrazzo 流程，重新生成 `dist/tokens.css`, `dist/tailwind.css` 等所有产物。

---

## 5. 开发路线图

### Phase 1: Core Algorithm (Web Worker)

- [ ] 实现 `ColorGenerator` 类：Hex -> Scale (RGB Array)。
- [ ] 实现 `SemanticMapper` 类：Base -> Semantic Config。
- [ ] **创建并集成 JSON Schema 验证逻辑。**
- [ ] 编写单元测试验证生成数据的格式正确性。

### Phase 2: Web UI (Docs)

- [ ] 创建 Theme Builder 页面。
- [ ] 实现颜色选择器和实时预览区域。
- [ ] 集成 Web Worker。
- [ ] 实现 "Export JSON" 功能 (导出前先自检)。

### Phase 3: CLI Implementation

- [ ] 在 `packages/design-tokens/bin/` 下添加 `apply` 命令。
- [ ] 实现 `config-parser.js` 读取 JSON 并进行 Schema 校验。
- [ ] 实现 `code-generator.js` 生成 `colors.cjs`。
- [ ] 联调测试：Web 导出 -> CLI 应用 -> 构建成功。

## 6. 维护指南

- **新增 Token**: 如果组件库需要新的 Semantic Token（如 `text-super-highlight`），必须同时更新：
  1.  `tokens/primitives/colors.cjs` (源码定义)
  2.  Web Theme Builder 的映射规则 (保证生成器知道如何处理这个新 Key)。
  3.  **Schema 文件** (`packages/design-tokens/schemas/theme-config.schema.json`)，将其加入白名单。
- **修改算法**: 调整色阶生成算法时，只需更新 Web 端代码，CLI 无需变更。
