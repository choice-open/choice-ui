# Choice UI — Bug-Catching Tests TODO

## 当前状态

- **108 个测试**，覆盖 **58 个组件**，其中 **83 个测试 FAIL（真实 bug）**，25 个 PASS（基线验证）
- PR: https://github.com/choice-open/choice-ui/pull/2
- 分支: `test/bug-catching-tests`

---

## 一、待修复的 83 个 Bug（按严重度排序）

### High（30 个）

| #   | 组件                | Bug                                                             | 文件位置                                                         |
| --- | ------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | Alert Dialog        | Enter 在 Cancel 上仍确认为 true                                 | `alert-dialog/src/__tests__/alert-dialog.test.tsx`               |
| 2   | Avatar              | anonymous+photo 永久脉冲动画                                    | `avatar/src/__tests__/avatar.test.tsx`                           |
| 3   | Button              | loading spinner 在 ReactElement children 下隐藏                 | `button/src/__tests__/button.test.tsx`                           |
| 4   | ChipsInput          | 重复 chip 时清空用户输入                                        | `chips-input/src/__tests__/chips-input.test.tsx`                 |
| 5   | Combobox            | trigger 只能开不能关（controlled 模式）                         | `combobox/src/__tests__/combobox.test.tsx`                       |
| 6   | Combobox            | onBlur 传 FocusEvent 非 string                                  | `combobox/src/__tests__/combobox.test.tsx`                       |
| 7   | Conditions          | MultiSelectInput 是单选缺少 multiple 属性                       | `conditions/src/__tests__/conditions.test.tsx`                   |
| 8   | Context Menu        | 键盘无法打开子菜单                                              | `context-menu/src/__tests__/context-menu.test.tsx`               |
| 9   | Context Input       | document.querySelector 定位到错误的 listbox（多实例）           | `context-input/src/__tests__/context-input.test.tsx`             |
| 10  | Context Input       | parseTextWithMentions 将多段落内容折叠为单段                    | `context-input/src/__tests__/context-input.test.tsx`             |
| 11  | Context Input       | useMentions.handleKeyDown 是死代码，键盘选择 mention 架构性损坏 | `context-input/src/__tests__/context-input.test.tsx`             |
| 12  | Command             | Group 排序 ID 不匹配永远不工作                                  | `command/src/__tests__/command.test.tsx`                         |
| 13  | Colors              | ColorSlider pointer release 时 onChange 不调用                  | `colors/src/__tests__/colors.test.tsx`                           |
| 14  | Colors              | GradientSlider 所有新 stops 共享同一 nanoid                     | `colors/src/__tests__/colors.test.tsx`                           |
| 15  | Colors              | 渐变旋转对 transform matrix 做无效数学运算                      | `colors/src/__tests__/colors.test.tsx`                           |
| 16  | Comments            | 点击任何 reaction 总是切换第一个 reaction                       | `comments/src/__tests__/comments.test.tsx`                       |
| 17  | MD Input            | Cmd+1-6 快捷键阻止浏览器标签页切换                              | `md-input/src/__tests__/md-input.test.tsx`                       |
| 18  | MD Render           | INITIAL_COMPONENTS 静默覆盖用户的自定义 code 组件               | `md-render/src/__tests__/md-render.test.tsx`                     |
| 19  | MD Render           | MarkdownBlock memo 只检查 content，忽略 components/policy 变化  | `md-render/src/__tests__/md-render.test.tsx`                     |
| 20  | Pagination          | 点击 prev/next 按钮同时编辑页码导致双重页面变更（×2 tests）     | `pagination/src/__tests__/pagination.test.tsx`                   |
| 21  | Radio               | Space/Enter 取消已选 radio (onChange(false))（×2 tests）        | `radio/src/__tests__/radio.test.tsx`                             |
| 22  | Range               | 键盘不移动 uncontrolled thumb（×2 tests）                       | `range/src/__tests__/range.test.tsx`                             |
| 23  | Tabs                | 右键/中键触发 tab 切换（×2 tests）                              | `tabs/src/__tests__/tabs.test.tsx`                               |
| 24  | Textarea            | allowNewline=false 不阻止 Shift+Enter                           | `textarea/src/__tests__/textarea.test.tsx`                       |
| 25  | Search Input        | uncontrolled clear 不显示                                       | `search-input/src/__tests__/search-input.test.tsx`               |
| 26  | Skeleton            | hasChildren 缺失 useMemo deps 导致样式陈旧                      | `skeleton/src/__tests__/skeleton.test.tsx`                       |
| 27  | Panel               | 可折叠标题 aria-hidden 使按钮无标签                             | `panel/src/__tests__/panel.test.tsx`                             |
| 28  | Panel               | 点击操作按钮触发折叠切换                                        | `panel/src/__tests__/panel.test.tsx`                             |
| 29  | Stackflow           | 无 initialId/defaultId 时不显示任何 item                        | `stackflow/src/__tests__/stackflow.test.tsx`                     |
| 30  | Picture Preview     | src 变化时 zoom/pan 不重置                                      | `picture-preview/src/__tests__/picture-preview.test.tsx`         |
| 31  | Bezier Curve Editor | 预览动画使用无效 8 值 cubic-bezier() CSS                        | `bezier-curve-editor/src/__tests__/bezier-curve-editor.test.tsx` |
| 32  | Dropdown            | focusManagerProps 部分覆盖丢失 coordinate 模式默认值            | `dropdown/src/__tests__/dropdown.test.tsx`                       |
| 33  | File Upload         | onValueChange 双次调用（controlled 模式）                       | `file-upload/src/__tests__/file-upload.test.tsx`                 |
| 34  | Form                | MultiSelect adapter 丢弃 onBlur                                 | `form/src/__tests__/form.test.tsx`                               |
| 35  | MultiSelect         | aria-expanded 硬编码 false                                      | `multi-select/src/__tests__/multi-select.test.tsx`               |

### Medium（38 个）

| #   | 组件            | Bug                                                         | 文件位置                                                 |
| --- | --------------- | ----------------------------------------------------------- | -------------------------------------------------------- |
| 1   | Avatar          | 无 name 时 img 缺 alt 属性                                  | `avatar/src/__tests__/avatar.test.tsx`                   |
| 2   | Calendar        | minDate 非午夜时间戳导致 off-by-one                         | `calendar/src/__tests__/calendar.test.tsx`               |
| 3   | ChipsInput      | 删除后选择索引错位                                          | `chips-input/src/__tests__/chips-input.test.tsx`         |
| 4   | Context Menu    | timeout 泄漏导致快速右键时过早关闭                          | `context-menu/src/__tests__/context-menu.test.tsx`       |
| 5   | Context Input   | renderSuggestion 总是收到 isSelected=false                  | `context-input/src/__tests__/context-input.test.tsx`     |
| 6   | Dialog          | draggable header 有 role="button" 但无键盘处理              | `dialog/src/__tests__/dialog.test.tsx`                   |
| 7   | Dialog          | resize handles 可聚焦但无键盘操作                           | `dialog/src/__tests__/dialog.test.tsx`                   |
| 8   | Dropdown        | hasFocusInside 关闭后不重置                                 | `dropdown/src/__tests__/dropdown.test.tsx`               |
| 9   | Dropdown        | disableKeyboardNavigation 不阻止 SubTrigger                 | `dropdown/src/__tests__/dropdown.test.tsx`               |
| 10  | Loader          | 空 stages 数组导致崩溃                                      | `loader/src/__tests__/loader.test.tsx`                   |
| 11  | Menubar         | Escape 后焦点丢失到 body                                    | `menubar/src/__tests__/menubar.test.tsx`                 |
| 12  | MultiSelect     | handleRemove 绕过 minSelection                              | `multi-select/src/__tests__/multi-select.test.tsx`       |
| 13  | Notifications   | 默认 position 被 undefined spread 覆盖                      | `notifications/src/__tests__/notifications.test.tsx`     |
| 14  | ProgressBar     | aria-valuenow 用百分比非实际值                              | `progress/src/__tests__/progress.test.tsx`               |
| 15  | ProgressCircle  | aria-valuenow 用百分比非实际值                              | `progress/src/__tests__/progress.test.tsx`               |
| 16  | Rich Input      | onFocus/onBlur 传空 {} 非 real event                        | `rich-input/src/__tests__/rich-input.test.tsx`           |
| 17  | Select          | controlled 模式冗余 setOpen                                 | `select/src/__tests__/select.test.tsx`                   |
| 18  | Separator       | children 时重复 separator role                              | `separator/src/__tests__/separator.test.tsx`             |
| 19  | Switch          | 数字 children 无 aria-label                                 | `switch/src/__tests__/switch.test.tsx`                   |
| 20  | Table           | getSelectedKeys 返回已删除行                                | `table/src/__tests__/table.test.tsx`                     |
| 21  | Textarea        | style prop 被静默丢弃                                       | `textarea/src/__tests__/textarea.test.tsx`               |
| 22  | Toast           | 更新后 timer 不重置                                         | `toast/src/__tests__/toast.test.tsx`                     |
| 23  | Toggle Button   | rest 覆盖 checked 状态（×2 tests）                          | `toggle-button/src/__tests__/toggle-button.test.tsx`     |
| 24  | TreeList        | 变异传入的 data prop                                        | `tree-list/src/__tests__/tree-list.test.tsx`             |
| 25  | Numeric Input   | ArrowUp/Down 缺 preventDefault cursor 跳动（×2 tests）      | `numeric-input/src/__tests__/numeric-input.test.tsx`     |
| 26  | Modal           | ModalSelect label htmlFor 不匹配 Select id                  | `modal/src/__tests__/modal.test.tsx`                     |
| 27  | Label           | required 星号缺少 aria-label                                | `label/src/__tests__/label.test.tsx`                     |
| 28  | Label           | as="legend" 仍接收无效 htmlFor                              | `label/src/__tests__/label.test.tsx`                     |
| 29  | Error Message   | TypeScript 类型说 `<p>` 但渲染 `<em>`                       | `error-message/src/__tests__/error-message.test.tsx`     |
| 30  | Text Field      | className 在有 Label 时双重应用                             | `text-field/src/__tests__/text-field.test.tsx`           |
| 31  | Spinner         | 硬编码 aria-label="Loading" 覆盖自定义 label                | `spinner/src/__tests__/spinner.test.tsx`                 |
| 32  | Icon Button     | asChild 非按钮元素强制 type="button"                        | `icon-button/src/__tests__/icon-button.test.tsx`         |
| 33  | Link Button     | disabled 链接仍触发 onClick                                 | `link-button/src/__tests__/link-button.test.tsx`         |
| 34  | MD Input        | 列表/引用按钮在光标位置插入前缀而非行首                     | `md-input/src/__tests__/md-input.test.tsx`               |
| 35  | Scroll Area     | Scrollbar track 点击不考虑 thumb 大小（×3 tests）           | `scroll-area/src/__tests__/scroll-area.test.tsx`         |
| 36  | Hint            | disabled 切换回 enabled 时 tooltip 自动重新出现             | `hint/src/__tests__/hint.test.tsx`                       |
| 37  | Code Block      | Footer 无 lineThreshold 时仍渲染，expand 按钮无效           | `code-block/src/__tests__/code-block.test.tsx`           |
| 38  | Picture Preview | onClose prop 被静默忽略                                     | `picture-preview/src/__tests__/picture-preview.test.tsx` |
| 39  | Pagination      | disabled 状态仍允许进入编辑模式                             | `pagination/src/__tests__/pagination.test.tsx`           |
| 40  | Bells           | 关闭按钮从不调用 sonnerToast.dismiss                        | `bells/src/__tests__/bells.test.tsx`                     |
| 41  | Badge           | isMultiElement 误判导致单包裹元素错误 padding               | `badge/src/__tests__/badge.test.tsx`                     |
| 42  | Input           | onIsEditingChange(false) 在未编辑时 unmount 仍触发          | `input/src/__tests__/input.test.tsx`                     |
| 43  | Menus           | MenuContextItem 每次 click 发射两次 tree click 事件         | `menus/src/__tests__/menus.test.tsx`                     |
| 44  | Code Block      | extractCodeFromChildren 对 fragment 包裹返回空串，copy 无效 | `code-block/src/__tests__/code-block.test.tsx`           |

### Low（15 个）

| #   | 组件             | Bug                                         | 文件位置                                                   |
| --- | ---------------- | ------------------------------------------- | ---------------------------------------------------------- |
| 1   | Chip             | aria-label 缺少空格分隔符                   | `chip/src/__tests__/chip.test.tsx`                         |
| 2   | File Upload      | 拖拽时扩展名大小写敏感                      | `file-upload/src/__tests__/file-upload.test.tsx`           |
| 3   | Popover          | interactions="none" 仍被 Escape 关闭        | `popover/src/__tests__/popover.test.tsx`                   |
| 4   | Segmented        | 无 uncontrolled 模式（类型误导）            | `segmented/src/__tests__/segmented.test.tsx`               |
| 5   | Virtualized Grid | rootMargin 假设每行 100px                   | `virtualized-grid/src/__tests__/virtualized-grid.test.tsx` |
| 6   | Tooltip          | content={0} 不渲染                          | `tooltip/src/__tests__/tooltip.test.tsx`                   |
| 7   | Search Input     | clear 不回焦                                | `search-input/src/__tests__/search-input.test.tsx`         |
| 8   | Emoji Picker     | emoji buttons 缺少 aria-label（×2 tests）   | `emoji-picker/src/__tests__/emoji-picker.test.tsx`         |
| 9   | OTP Input        | 缺少 forwardRef，ref 被静默丢弃（×2 tests） | `otp-input/src/__tests__/otp-input.test.tsx`               |
| 10  | Menus            | MenuCheckbox 忽略 indeterminate prop        | `menus/src/__tests__/menus.test.tsx`                       |
| 11  | Panel            | 非可折叠面板错误设置 aria-expanded          | `panel/src/__tests__/panel.test.tsx`                       |
| 12  | Select           | value=null 选中第一项                       | `select/src/__tests__/select.test.tsx`                     |

---

## 二、待补充测试的组件

以下组件已研究但**未写测试**（bug 已确认）：

无。所有已研究的组件均已完成测试。

以下组件**未研究也未写测试**（无有价值的 bug 或过于简单）：

- **Splitter** — thin re-export wrapper，无自定义逻辑
- **Description** — 简单 `<p>` 元素，无有意义的行为 bug
- **KBD** — 简单渲染器，无用户可观察的 bug
- **Slot** — 遵循 Radix UI Slot 模式，无 bug
- **Spring Visualizer** — 物理计算正确，无 bug

---

## 三、遗留的旧测试失败（非本次新增）

以下测试在本次工作之前就已存在并失败，不属于我们新增的 bug-catching 测试：

- `emoji-picker/__tests__/emoji-picker.test.tsx` — 旧的低质量渲染验证测试（14 个）
- `emoji-picker/__tests__/use-emoji-data.test.tsx`
- `list/__tests__/list-enter.test.tsx`
- `list/__tests__/list-toggle.test.tsx`
- `calendar/src/date-input/__tests__/date-input.test.tsx`
- `calendar/src/time-calendar/__tests__/time-calendar.test.tsx`
- `calendar/src/time-input/__tests__/time-input.test.tsx`
- `calendar/src/quarter-calendar/__tests__/quarter-calendar.test.tsx`（多个）
- `calendar/src/year-calendar/__tests__/year-calendar.test.tsx`（多个）
- `calendar/src/month-calendar/__tests__/month-calendar.test.tsx`（多个）
- `calendar/src/date-range-input/__tests__/date-range-input.test.tsx`（多个）
- `calendar/src/time-range-input/__tests__/time-range-input.test.tsx`（多个）
- `calendar/src/date-input/__tests__/date-input.extended.test.tsx`（多个）
- `calendar/src/time-input/__tests__/time-input.extended.test.tsx`（多个）
- `numeric-input/src/__tests__/hooks/use-numeric-input.test.tsx`（多个）
- `numeric-input/src/__tests__/utils/expression-evaluator.test.tsx`（多个）
- `numeric-input/src/__tests__/utils/pattern-parser.test.tsx`
- `pagination/__tests__/pagination.test.tsx`（旧测试）

**建议：** 清理或重写这些旧测试，使其符合 Frontend Test Rule。

---

## 四、后续工作建议

### 优先级 P0：修复 High 级别 Bug

1. 按组件分组修复，每个组件一个 commit
2. 每修一个 bug，对应测试从 FAIL 变为 PASS，作为验证
3. 建议从影响最大的组件开始：Combobox、Select、MultiSelect、Tabs、Range

### 优先级 P1：修复 Medium 级别 Bug

1. 按 a11y（aria 属性）、键盘交互、状态管理分类修复
2. a11y 问题影响面广，建议优先

### 优先级 P2：清理旧测试

1. 删除或重写 `emoji-picker/__tests__/` 下的旧渲染验证测试
2. 清理 `calendar/` 下的旧测试（大部分是测试实现细节而非用户行为）
3. 清理 `numeric-input/` 下的旧 hooks/utils 测试

### 优先级 P3：补充测试覆盖

1. 为修复 bug 时发现的新 edge case 补充回归测试
2. 考虑为复杂组件（Dropdown、Calendar、Table）增加集成测试
