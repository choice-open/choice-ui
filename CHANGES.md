# Choice UI — Bug-Catching 测试与修复总结

> 分支：`test/bug-catching-tests` | PR：[#2](https://github.com/choice-open/choice-ui/pull/2)
>
> **93 个测试套件 · 817 个测试用例 · 全部通过**
>
> 修改了 ~130 个源文件，覆盖 74 个组件/模块，发现并修复了 **60+ 个 bug**。

---

## 统计总览

| 维度              | 数据                       |
| ----------------- | -------------------------- |
| 修改组件数        | 74                         |
| 源文件修改数      | ~130                       |
| 新增测试用例      | 817                        |
| Bug 修复          | 60+                        |
| PR Review Threads | 57（全部已回复并 resolve） |

---

## 组件修改详情

### Alert Dialog — 对话框

| 文件               | 修改说明                                                    |
| ------------------ | ----------------------------------------------------------- |
| `alert-dialog.tsx` | 修复按钮已获焦时按 Enter 重复触发确认操作，增加焦点检测守卫 |
| `utils/index.ts`   | 修复 `CLEAR_QUEUE` 时未 resolve 待处理 Promise 导致内存泄漏 |

### Avatar — 头像

| 文件         | 修改说明                                                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `avatar.tsx` | 修复 photo/states 变化时加载和错误状态未重置；anonymous 模式不再显示 loading；添加 `role="img"`；增加 alt 文本 fallback |

### Badge — 徽章

| 文件        | 修改说明                                                     |
| ----------- | ------------------------------------------------------------ |
| `badge.tsx` | 简化多元素检测逻辑，仅检查顶层 children 是否为数组，修复误判 |

### Bells — 通知铃铛

| 文件        | 修改说明                                                             |
| ----------- | -------------------------------------------------------------------- |
| `bells.tsx` | 修复关闭通知时未调用 `sonnerToast.dismiss()` 导致 toast 无法正确关闭 |

### Bézier Curve Editor — 贝塞尔曲线编辑器

| 文件                            | 修改说明                                                                      |
| ------------------------------- | ----------------------------------------------------------------------------- |
| `bezier-curve-editor-curve.tsx` | 修复 `animationTimingFunction` 错误使用全部 6 个值，改为仅使用 2 个控制点坐标 |

### Button — 按钮

| 文件         | 修改说明                                                                   |
| ------------ | -------------------------------------------------------------------------- |
| `button.tsx` | 修复 loading 状态被 `cloneElement` 覆盖导致 spinner 不显示，调整渲染优先级 |

### Calendar — 日历（月历）

| 文件                           | 修改说明                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| `month-calendar-date-cell.tsx` | 添加 `role="gridcell"` 提升无障碍性；修复 `data-disabled` 在非禁用时渲染为字符串 `"false"` |
| `month-calendar.tsx`           | 修复 minDate/maxDate 日期比较精度问题，改用 `startOfDay`/`endOfDay`                        |
| `utils/month.ts`               | 新增 `startOfDay`/`endOfDay` 工具函数                                                      |

### Calendar — 日历（季度历）

| 文件                          | 修改说明                                            |
| ----------------------------- | --------------------------------------------------- |
| `quarter-calendar-header.tsx` | 新增中文 locale 支持（"2024年"格式）                |
| `quarter-calendar.tsx`        | 修复 disabled/readOnly 状态下仍可通过"今天"按钮导航 |

### Calendar — 日历（时间历）

| 文件                | 修改说明                                                         |
| ------------------- | ---------------------------------------------------------------- |
| `time-calendar.tsx` | 修复 `requestAnimationFrame` 泄漏，effect 清理时取消未执行的 rAF |

### Calendar — 日历（年历）

| 文件                     | 修改说明                                            |
| ------------------------ | --------------------------------------------------- |
| `year-calendar-cell.tsx` | 添加键盘导航支持（Enter/Space）及 `role="button"`   |
| `year-calendar.tsx`      | 修复 disabled/readOnly 状态下仍可通过"今天"按钮导航 |

### Checkbox — 复选框

| 文件                 | 修改说明                                                                                           |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| `checkbox-icon.tsx`  | 修复 `data-active` 未反映 mixed（半选）状态                                                        |
| `checkbox-label.tsx` | 修复 label 使用了 `descriptionId` 而非 `labelId` 导致 ID 冲突                                      |
| `checkbox.tsx`       | 移除 Enter 键触发变更（仅保留 Space）；新增 `labelId` 到 context；修复 `aria-checked` 未转为布尔值 |
| `context.ts`         | 新增 `labelId` 字段到 context 类型                                                                 |

### Chip — 标签

| 文件       | 修改说明                                                                           |
| ---------- | ---------------------------------------------------------------------------------- |
| `chip.tsx` | 添加 `aria-disabled`；修复禁用时点击仍触发回调；修复移除按钮 `aria-label` 缺少空格 |

### Chips Input — 标签输入

| 文件              | 修改说明                                                                     |
| ----------------- | ---------------------------------------------------------------------------- |
| `chips-input.tsx` | 添加 `defaultPrevented` 检查；修复 Backspace 先选中而非立即删除最后一个 chip |

### Code Block — 代码块

| 文件                    | 修改说明                                               |
| ----------------------- | ------------------------------------------------------ |
| `code-block-footer.tsx` | 修复 footer 可见性逻辑在展开/折叠状态下判断不正确      |
| `use-code-block.ts`     | 移除冗余注释                                           |
| `extract-code.ts`       | 修复代码提取不支持字符串子节点和嵌套 children 递归解析 |

### Colors — 颜色选择器

| 文件                        | 修改说明                                                                                      |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| `color-area.tsx`            | 修复拖拽结束时未触发 onChange 回调                                                            |
| `color-gradient-slider.tsx` | 修复 nanoid 在组件顶层生成导致所有新增 stop 共享同一 ID                                       |
| `color-gradients-paint.tsx` | 修复旋转使用错误的模运算，改为正确的矩阵旋转乘法                                              |
| `color-slider.tsx`          | 修复拖拽结束时未触发 onChange 回调                                                            |
| `use-color-parser.ts`       | 修复 HSLA 解析不支持斜杠格式；修复逗号分隔 alpha 不支持百分比值（`hsla(120, 50%, 50%, 50%)`） |

### Combobox — 组合框

| 文件                   | 修改说明                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `combobox-trigger.tsx` | 修复 `onBlur` 回调签名缺失 event 参数                                                |
| `combobox.tsx`         | 修复 `onBlur` 类型签名；修复 `onOpenChange` 传递错误布尔值；修复有值时聚焦不打开菜单 |

### Command — 命令面板

| 文件               | 修改说明                                                                |
| ------------------ | ----------------------------------------------------------------------- |
| `command.tsx`      | 修复分组排序方向和 DOM 插入顺序；修复分组值查找                         |
| `command-item.tsx` | 修复 `forceMount` 时跳过 item 注册导致列表不完整；正确返回 cleanup 函数 |

### Comments — 评论

| 文件           | 修改说明                                                             |
| -------------- | -------------------------------------------------------------------- |
| `comments.tsx` | 修复点击反应按钮始终使用第一个 reaction 的 emoji，改为使用实际点击的 |

### Conditions — 条件组合

| 文件                     | 修改说明                                                            |
| ------------------------ | ------------------------------------------------------------------- |
| `multi-select-input.tsx` | 将单选 select 改为真正的多选，支持数组值                            |
| `text-input.tsx`         | 添加 sr-only span 提升屏幕阅读器可访问性                            |
| `conditions.tsx`         | 添加字段 key 规范化；添加受控 value 同步；防止首次渲染触发 onChange |

### Context Input — 上下文输入（@提及）

| 文件                 | 修改说明                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| `mention-menu.tsx`   | 添加 `portalId` 隔离 DOM 查询；移除 Enter/Tab/Escape 处理避免双重触发；改用 `activeIndex` prop 同步高亮      |
| `slate-editor.tsx`   | 新增 `onKeyUp` prop 支持                                                                                     |
| `context-input.tsx`  | 修复 mention Enter/Tab 键被双重处理导致潜在重复插入；移除 position fallback `(0,0)` 防止菜单出现在视口左上角 |
| `use-mentions.ts`    | 添加 `activeIndexRef` 避免闭包陈旧值导致 Enter 选错项                                                        |
| `text-extraction.ts` | 修复不含 mention 的文本未正确处理换行符                                                                      |

### Context Menu — 右键菜单

| 文件               | 修改说明                                                                               |
| ------------------ | -------------------------------------------------------------------------------------- |
| `context-menu.tsx` | 移除 `useRole` 减少不必要的 ARIA 覆写；修复 mouseUp timeout 未清理；添加子菜单键盘触发 |

### Description — 描述文本

| 文件              | 修改说明                  |
| ----------------- | ------------------------- |
| `description.tsx` | 添加 `aria-disabled` 属性 |

### Dialog — 对话框

| 文件                     | 修改说明                                                                         |
| ------------------------ | -------------------------------------------------------------------------------- |
| `dialog.tsx`             | 修复 resizable 初始化尺寸计算；添加方向键拖拽和调整大小的键盘交互                |
| `use-drag.ts`            | 新增 `moveByKeyboard` 方法支持键盘拖拽；添加 `e.target !== e.currentTarget` 守卫 |
| `use-floating-dialog.ts` | 修复关闭时 `isClosing` 未重置；使用 `prevOpenRef` 增强回调可靠性                 |
| `use-resize.ts`          | 新增 `resizeByKeyboard` 方法支持键盘调整大小                                     |

### Dropdown — 下拉菜单

| 文件           | 修改说明                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `dropdown.tsx` | 缓存 `focusManagerProps` 避免重渲染；关闭时重置内部状态；添加 disabled 模式键盘拦截；移除 capture handler 的 `stopPropagation` |

### Emoji Picker — Emoji 选择器

| 文件             | 修改说明                       |
| ---------------- | ------------------------------ |
| `emoji-item.tsx` | 添加 `aria-label` 提升无障碍性 |

### Error Message — 错误消息

| 文件                | 修改说明                         |
| ------------------- | -------------------------------- |
| `error-message.tsx` | 将语义化标签从 `<em>` 改为 `<p>` |

### File Upload — 文件上传

| 文件                       | 修改说明                                                           |
| -------------------------- | ------------------------------------------------------------------ |
| `file-upload-dropzone.tsx` | 添加 DataTransfer API 失败时的 fallback（`Object.defineProperty`） |
| `file-upload.tsx`          | 修复文件扩展名匹配区分大小写；移除重复的 `onValueChange` 调用      |

### Form — 表单适配器

| 文件                       | 修改说明                                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| `multi-select-adapter.tsx` | 修复 blur 检测不准确，改用 `focusout` + `relatedTarget` 容器包含检查，避免内部焦点移动误触 blur |
| `range-adapter.tsx`        | 添加 DOM 级 `focusin`/`focusout` 事件监听（替代不冒泡的 `focus`/`blur`）修复回调未触发          |

### Hint — 提示

| 文件          | 修改说明                                                       |
| ------------- | -------------------------------------------------------------- |
| `hint.tsx`    | 将 Trigger 查找改为递归搜索，修复嵌套子组件中 Trigger 未被识别 |
| `use-hint.ts` | 修复 disabled 变为 true 时弹出框未自动关闭                     |

### Icon Button — 图标按钮

| 文件              | 修改说明                                                                                |
| ----------------- | --------------------------------------------------------------------------------------- |
| `icon-button.tsx` | 修复 asChild 模式下设置 `type` 属性导致 React 警告；添加 `aria-disabled` 和 `aria-busy` |

### Input — 输入框

| 文件        | 修改说明                                                              |
| ----------- | --------------------------------------------------------------------- |
| `input.tsx` | 修复未聚焦过的 Input 在 unmount 时错误触发 `onIsEditingChange(false)` |

### Kbd — 键盘快捷键标签

| 文件      | 修改说明                                        |
| --------- | ----------------------------------------------- |
| `kbd.tsx` | 添加 `role="text"` 和 `aria-label` 提升无障碍性 |

### Label — 标签

| 文件        | 修改说明                                                             |
| ----------- | -------------------------------------------------------------------- |
| `label.tsx` | 修复 `as="legend"` 时错误传递 `htmlFor`；为必填星号添加 `aria-label` |

### Link Button — 链接按钮

| 文件              | 修改说明                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| `link-button.tsx` | 修复空字符串 href 误判为链接模式；修复外部链接检测区分大小写；disabled 时阻止 onClick；守卫 undefined href 防止崩溃 |

### List — 列表

| 文件                    | 修改说明                                        |
| ----------------------- | ----------------------------------------------- |
| `list-item.tsx`         | 清理键盘处理逻辑，新增用户 `onKeyDown` 回调透传 |
| `use-list-keyboard.tsx` | 修复 ArrowRight 键对无子列表的项也触发展开      |

### Loader — 加载器

| 文件         | 修改说明                               |
| ------------ | -------------------------------------- |
| `loader.tsx` | 添加空 stages 数组保护，防止定时器崩溃 |

### Markdown Input — Markdown 输入

| 文件                         | 修改说明                                     |
| ---------------------------- | -------------------------------------------- |
| `use-markdown-formatting.ts` | 修复块级前缀（如 `#`）插入在光标位置而非行首 |

### Markdown Render — Markdown 渲染

| 文件                 | 修改说明                                                        |
| -------------------- | --------------------------------------------------------------- |
| `markdown-block.tsx` | 修复 memo 比较函数未包含 components 导致自定义组件不更新        |
| `md-render.tsx`      | 修复组件合并顺序使 `customComponents` 覆盖 `INITIAL_COMPONENTS` |

### Menubar — 菜单栏

| 文件               | 修改说明                                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `menubar-item.tsx` | 新增 `label` prop 支持简化用法；label 模式下 spread child props 保留 disabled 等；修复 label 模式下 `Dropdown.Content` 缺少 `getFloatingProps` 和 `setContentRef` 导致点击菜单项失效 |

### Menus — 菜单

| 文件                    | 修改说明                                            |
| ----------------------- | --------------------------------------------------- |
| `menu-checkbox.tsx`     | 新增 indeterminate（半选）状态渲染                  |
| `menu-item.tsx`         | 使 role 可被外部覆写                                |
| `menu-context-item.tsx` | 移除 mouseUp 时的 tree click 事件发射，修复重复触发 |

### Modal — 模态框

| 文件                 | 修改说明                                                                     |
| -------------------- | ---------------------------------------------------------------------------- |
| `modal-backdrop.tsx` | 添加 Escape 键关闭支持                                                       |
| `modal-header.tsx`   | 为关闭按钮添加 `aria-label="Close"`                                          |
| `modal-input.tsx`    | 为 description 添加 `aria-describedby` 关联                                  |
| `modal-select.tsx`   | 为 description 添加 `aria-describedby` 关联；保留 `htmlFor` 指向 wrapper div |
| `modal-textarea.tsx` | 为 description 添加 `aria-describedby` 关联                                  |
| `modal.tsx`          | 添加 `role="dialog"` 和 `aria-modal="true"`                                  |

### Multi Select — 多选

| 文件                            | 修改说明                                                |
| ------------------------------- | ------------------------------------------------------- |
| `multi-select-trigger.tsx`      | 修复 `aria-expanded` 始终为 false，改为反映实际展开状态 |
| `use-multi-select-selection.ts` | 新增 minSelection 验证                                  |

### Notifications — 通知

| 文件                | 修改说明                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| `notifications.tsx` | 添加 `role="status"` 和 `aria-live="polite"`；关闭时调用 `sonnerToast.dismiss`；为按钮添加 `type="button"` |

### Numeric Input — 数字输入

| 文件                        | 修改说明                                                              |
| --------------------------- | --------------------------------------------------------------------- |
| `use-input-interactions.ts` | 为 ArrowUp/Down 添加 `preventDefault` 防止光标移动                    |
| `use-numeric-input.ts`      | 修复 onPressStart/onPressEnd 在非原生事件时不被调用                   |
| `expression-evaluator.ts`   | 重写表达式求值器：支持子表达式中的负数、无效表达式返回 NaN 而非抛异常 |
| `pattern-parser.ts`         | 修复正则表达式移除变量周围空白导致匹配失败                            |

### OTP Input — 验证码输入

| 文件            | 修改说明                                                                     |
| --------------- | ---------------------------------------------------------------------------- |
| `otp-input.tsx` | 转为 `forwardRef` 支持 ref 转发；添加 `aria-invalid`；支持 `placeholderChar` |

### Pagination — 分页

| 文件                     | 修改说明                                                          |
| ------------------------ | ----------------------------------------------------------------- |
| `pagination-spinner.tsx` | 修复前后翻页按钮与输入框 blur 的竞态条件；disabled 时禁止点击编辑 |

### Panel — 面板

| 文件              | 修改说明                                                             |
| ----------------- | -------------------------------------------------------------------- |
| `panel-title.tsx` | 移除标题上错误的 `aria-hidden`；为 action 容器添加 `stopPropagation` |
| `panel.tsx`       | 修复非折叠面板错误显示 `aria-expanded` 属性                          |

### Picture Preview — 图片预览

| 文件                  | 修改说明                                         |
| --------------------- | ------------------------------------------------ |
| `picture-preview.tsx` | 添加 Escape 键关闭支持；切换图片时重置缩放和位置 |

### Popover — 弹出层

| 文件                      | 修改说明                                                  |
| ------------------------- | --------------------------------------------------------- |
| `use-drag.ts`             | 修复拖拽状态重置时序问题，改用 state 追踪 floatingElement |
| `use-floating-popover.ts` | 添加 `forceDismiss` 机制防止关闭动画期间重新打开          |
| `popover.tsx`             | 接入 `setFloatingElement`；修复 `aria-modal` 动态设置     |

### Progress — 进度条

| 文件                  | 修改说明                                                                      |
| --------------------- | ----------------------------------------------------------------------------- |
| `progress-bar.tsx`    | 修复 `aria-valuenow` 使用百分比而非实际值；修复 striped 样式 transform 被覆盖 |
| `progress-circle.tsx` | 修复 strokeWidth 过大时 radius 为负数；修复 `aria-valuenow`                   |
| `tv.ts`               | 为 connects 添加 progress-connects 类名                                       |

### Radio — 单选

| 文件        | 修改说明                                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| `radio.tsx` | 修复已选中时按 Space/Enter 仍触发 onChange；移除 readOnly 传入 disabled（保持可聚焦）；修复 `aria-describedby` |

### Range — 滑块

| 文件        | 修改说明                                                                   |
| ----------- | -------------------------------------------------------------------------- |
| `thumb.tsx` | 添加 `role="slider"` 及 `aria-valuenow`/`min`/`max`                        |
| `range.tsx` | 修复步长计算未考虑 min 偏移；修复键盘操作未更新内部状态；支持 defaultValue |

### Rich Input — 富文本输入

| 文件                                | 修改说明                                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `element.tsx`                       | 修复 `ref_user` 元素未传递 attributes 导致 Slate 渲染异常                                               |
| `rich-input-editable-component.tsx` | 添加 `editorRef` 用于 placeholder 设置；添加 `aria-placeholder`；移除重复的 focus/blur native listeners |
| `rich-input-base.tsx`               | 修复 focus/blur 事件的 mockEvent 缺少 target 引用                                                       |

### Scroll Area — 滚动区域

| 文件                                 | 修改说明                                                       |
| ------------------------------------ | -------------------------------------------------------------- |
| `use-scroll-state-and-visibility.ts` | 添加延迟更新定时器清理，防止内存泄漏                           |
| `use-thumb.ts`                       | 添加拖拽 cleanup 函数清理事件监听器                            |
| `utils/index.ts`                     | 修复点击轨道时滑块跳跃到点击位置，改为将滑块中心对齐到点击位置 |

### Search Input — 搜索输入

| 文件               | 修改说明                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `search-input.tsx` | 添加非受控模式支持（仅 controlled 时传 `value`）；从 `defaultValue` 初始化内部值；修复清除后焦点丢失 |

### Segmented — 分段控制器

| 文件                 | 修改说明                                                   |
| -------------------- | ---------------------------------------------------------- |
| `segmented-item.tsx` | 修复特殊字符值生成的 ID 包含非法字符；添加 `data-selected` |
| `segmented.tsx`      | 添加非受控模式支持                                         |

### Select — 选择器

| 文件         | 修改说明                                                          |
| ------------ | ----------------------------------------------------------------- |
| `select.tsx` | 修复 null 值处理；移除重复的 `setOpen` 调用；添加 `role="option"` |

### Separator — 分隔线

| 文件            | 修改说明                                                           |
| --------------- | ------------------------------------------------------------------ |
| `separator.tsx` | 将 ARIA 语义属性移至外层 div；内部分隔线添加 `role="presentation"` |

### Skeleton — 骨架屏

| 文件           | 修改说明                                                      |
| -------------- | ------------------------------------------------------------- |
| `skeleton.tsx` | 解构 variant 防止传递到 DOM；修复 memo 依赖缺少 `hasChildren` |

### Slot — 插槽

| 文件       | 修改说明                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------- |
| `slot.tsx` | 重写 `mergeProps` 确保所有属性类型正确合并；修复 slot prop 为 undefined 时保留 child prop 值 |

### Spinner — 旋转加载

| 文件                 | 修改说明                                |
| -------------------- | --------------------------------------- |
| `spinner-bounce.tsx` | 修复 `aria-label` 忽略自定义 label prop |
| `spinner-spin.tsx`   | 同上                                    |

### Spring Visualizer — 弹簧可视化

| 文件                    | 修改说明                                                  |
| ----------------------- | --------------------------------------------------------- |
| `spring-visualizer.tsx` | 修复多实例共享固定 gradient ID 导致样式冲突，改用 `useId` |

### Stackflow — 堆栈导航

| 文件                 | 修改说明                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `stackflow-item.tsx` | 添加退出动画支持（`isTransitioningOut` 状态）；用 `useRef` 同步检测 active→inactive 转换，修复组件在退出动画前被卸载 |
| `use-stackflow.ts`   | 添加 `currentIndex` 跟踪修复回退导航逻辑；push 时截断前向历史                                                        |

### Switch — 开关

| 文件         | 修改说明                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| `switch.tsx` | 添加 `role="switch"`；修复 `aria-label` 不支持数字 children；修复 `aria-describedby` 不再指向 label 文本 |

### Table — 表格

| 文件             | 修改说明                                                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `table-body.tsx` | 为 window scroll 模式添加 `onScroll` 回调                                                                                                          |
| `table-root.tsx` | 新增 `columns` prop 支持声明式用法；传递完整列配置（width/minWidth/maxWidth/flex/sortable/resizable/className）；传递 `col.className` 到 TableCell |
| `use-table.ts`   | 添加 columns prop 同步；修复 `getSelectedKeys` 返回已删除行的 key                                                                                  |
| `types.ts`       | 新增 `accessorKey` 字段和 `columns` prop                                                                                                           |

### Tabs — 选项卡

| 文件           | 修改说明                                                                        |
| -------------- | ------------------------------------------------------------------------------- |
| `tab-item.tsx` | 修复事件处理器顺序（用户回调优先）；mousedown 时聚焦当前元素；添加 `aria-label` |

### Text Field — 文本字段

| 文件             | 修改说明                                     |
| ---------------- | -------------------------------------------- |
| `text-field.tsx` | 移除错误传递到 TextFieldContent 的 className |

### Textarea — 文本域

| 文件           | 修改说明                                                                  |
| -------------- | ------------------------------------------------------------------------- |
| `textarea.tsx` | 添加 `editingStartedRef` 防止 unmount 时误触发 `onIsEditingChange(false)` |

### Toast — 提示消息

| 文件               | 修改说明                                       |
| ------------------ | ---------------------------------------------- |
| `toaster-item.tsx` | 修复点击关闭按钮时未调用 `cancel.onClick` 回调 |

### Toggle Button — 切换按钮

| 文件                | 修改说明                                     |
| ------------------- | -------------------------------------------- |
| `toggle-button.tsx` | 移除不必要的 sr-only 文本；解构未使用的 prop |

### Toggle Group — 切换按钮组

| 文件               | 修改说明                                                   |
| ------------------ | ---------------------------------------------------------- |
| `toggle-group.tsx` | 添加用户 `onKeyDown` 回调透传；添加 `aria-multiselectable` |

### Tooltip — 工具提示

| 文件             | 修改说明                                                                  |
| ---------------- | ------------------------------------------------------------------------- |
| `use-tooltip.ts` | 调整默认 offset 从 5 到 8                                                 |
| `tooltip.tsx`    | 修复 content 为 0 或空字符串时 tooltip 不渲染（仅 null/undefined 不渲染） |

### Tree List — 树形列表

| 文件            | 修改说明                                         |
| --------------- | ------------------------------------------------ |
| `tree-list.tsx` | 为 `selectedNodeIds` 添加默认空 Set 防止崩溃     |
| `utils/tree.ts` | 修复 `flattenTree` 直接修改输入节点的 `parentId` |

---

## 共享模块

### Shared Hooks

| 文件                  | 修改说明                                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| `use-merged-value.ts` | 重构值合并逻辑，移除冗余注释                                                                             |
| `use-press.ts`        | 添加 `pointercancel` 事件监听修复触摸取消时 pressed 状态未重置；`handleUp`/`handleCancel` 清理自身监听器 |

### 测试基础设施

| 文件               | 修改说明                                                      |
| ------------------ | ------------------------------------------------------------- |
| `setup-tests.ts`   | 添加 `requestPointerLock`、`DataTransfer`、`FileList` 等 mock |
| `vitest.config.ts` | 添加测试配置调整                                              |

---

## Bug 修复分类统计

| 类别            | 数量 | 典型示例                                   |
| --------------- | ---- | ------------------------------------------ |
| 事件处理        | 15+  | 双重触发、事件冒泡、竞态条件、内存泄漏     |
| 状态管理        | 12+  | 闭包陈旧值、未重置状态、受控/非受控模式    |
| 无障碍性 (A11y) | 12+  | 缺失 ARIA 属性、错误 role、缺少 aria-label |
| 键盘交互        | 8+   | Enter/Space 处理、方向键导航、焦点管理     |
| DOM/渲染        | 6+   | 错误属性传递、ID 冲突、样式覆盖            |
| 数值/解析       | 5+   | 表达式求值、HSLA 解析、日期比较精度        |
| 动画/过渡       | 3+   | 退出动画、rAF 泄漏、过渡状态管理           |

---

## PR Review 处理

共处理 **57 个 Codex 自动评审线程**：

- **代码修复**：48 个线程（发现真实 bug 并修复）
- **原理解释**：9 个线程（解释现有设计的合理性）

所有线程均已回复并 resolve，0 未解决。
