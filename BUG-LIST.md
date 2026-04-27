# Choice UI — 全量测试错误列表

> 生成时间：2026-04-13
> 分支：`test/bug-catching-tests`

---

## 总览

| 指标         | 数量          |
| ------------ | ------------- |
| 有测试的组件 | 66            |
| 测试总数     | 260           |
| PASS         | 61 (23%)      |
| **FAIL**     | **199 (77%)** |

---

## 按组件统计

| 组件                | PASS | FAIL | Bug 描述                                                                                                                                              |
| ------------------- | ---- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| alert-dialog        | 0    | 2    | Enter on Cancel 确认为 true；closeAll 不 resolve pending promise                                                                                      |
| avatar              | 1    | 2    | anonymous+photo 永久脉冲；img 缺 alt                                                                                                                  |
| badge               | 1    | 1    | isMultiElement 误判导致错误 padding                                                                                                                   |
| bells               | 1    | 1    | close button 不调用 sonnerToast.dismiss                                                                                                               |
| bezier-curve-editor | 0    | 1    | 预览动画用无效 8 值 cubic-bezier()                                                                                                                    |
| button              | 1    | 1    | loading spinner 在 ReactElement children 下隐藏                                                                                                       |
| calendar            | 0    | 1    | minDate 非午夜导致 off-by-one                                                                                                                         |
| checkbox            | 3    | 4    | aria-checked 缺失；Enter 不应 toggle；mixed state data-active；aria-describedby 指向 label                                                            |
| chip                | 1    | 2    | disabled onClick 仍触发 + 缺 aria-disabled                                                                                                            |
| chips-input         | 1    | 3    | 重复 chip 清空输入；Backspace 直接删除而非选中；onKeyDown preventDefault 不阻止                                                                       |
| code-block          | 0    | 3    | 无 lineThreshold 的 footer；fragment copy 空；string array children 未拼接                                                                            |
| colors              | 1    | 7    | Slider pointer release 无 onChange；nanoid 重复；rotation math 错；ColorArea pointer release；HSLA alpha 丢失；modern HSL 解析失败                    |
| combobox            | 0    | 3    | trigger 不能关；onBlur 传 FocusEvent；focus 有 value 不开 dropdown                                                                                    |
| command             | 0    | 2    | Group 排序不工作；forceMount items 不注册                                                                                                             |
| comments            | 0    | 1    | 点击任何 reaction 总是切换第一个                                                                                                                      |
| conditions          | 0    | 3    | MultiSelectInput 缺 multiple；内部状态不同步 value 变化；mount 时触发 onChange                                                                        |
| context-input       | 0    | 4    | querySelector 定位错误 listbox；多段落折叠；keyboard selection 损坏；isSelected 永远 false                                                            |
| context-menu        | 0    | 2    | Enter 不能开子菜单；快速右键过早关闭                                                                                                                  |
| description         | 1    | 1    | disabled 缺 aria-disabled                                                                                                                             |
| dialog              | 0    | 5    | draggable header 无键盘；resize handles 无键盘；partial resizable 折叠维度；isClosing 卡住                                                            |
| dropdown            | 2    | 4    | focusManagerProps 覆盖丢失默认值；hasFocusInside 不重置；loop wrap-around；disableKeyboardNavigation 不阻止 SubTrigger                                |
| emoji-picker        | 0    | 2    | emoji buttons 缺 aria-label（×2）                                                                                                                     |
| error-message       | 0    | 2    | 渲染为 `<em>` 非 `<p>`；role=alert 可被覆盖                                                                                                           |
| file-upload         | 0    | 2    | onValueChange 双次调用；大写扩展名拒绝                                                                                                                |
| form                | 0    | 3    | MultiSelect 丢弃 onBlur；Range 丢弃 onBlur/onFocus                                                                                                    |
| hint                | 0    | 2    | disabled→enabled tooltip 自动重现；嵌套 Trigger 重复渲染                                                                                              |
| icon-button         | 0    | 4    | asChild 强制 type="button"；缺 aria-disabled；缺 aria-busy；anchor disabled 无 aria-disabled                                                          |
| input               | 1    | 1    | unmount 时无条件触发 onIsEditingChange(false)                                                                                                         |
| kbd                 | 1    | 2    | 缺 aria-label；children 被多余 span 包裹                                                                                                              |
| label               | 0    | 2    | required 星号缺 aria-label；as=legend 仍有 htmlFor                                                                                                    |
| link-button         | 0    | 3    | disabled onClick 仍触发；大写协议不检测外部；href='' 渲染为 button                                                                                    |
| list                | 1    | 1    | user onKeyDown 被静默覆盖                                                                                                                             |
| loader              | 0    | 1    | 空 stages 数组崩溃                                                                                                                                    |
| md-input            | 1    | 1    | 列表前缀在光标位置而非行首                                                                                                                            |
| md-render           | 1    | 2    | INITIAL_COMPONENTS 覆盖自定义组件；memo 忽略 components 变化                                                                                          |
| menubar             | 0    | 1    | Escape 后焦点丢失到 body                                                                                                                              |
| menus               | 2    | 2    | click 事件发射两次；indeterminate prop 被忽略                                                                                                         |
| modal               | 1    | 5    | label htmlFor 不匹配；缺 role=dialog；缺 aria-modal；close 缺 aria-label；Escape 不关闭；input 缺 aria-describedby                                    |
| multi-select        | 3    | 2    | aria-expanded 硬编码 false；chip 删除绕过 minSelection                                                                                                |
| notifications       | 0    | 1    | 默认 position 被 undefined spread 覆盖                                                                                                                |
| numeric-input       | 20   | 31   | ArrowUp/Down 缺 preventDefault；onPressStart 重复调用；expression evaluator 负数/空串/非法输入；pattern parser 丢空格；useNumericInput hooks 全部失败 |
| otp-input           | 0    | 5    | 缺 forwardRef（×2）；slot div 缺 aria-hidden；缺 aria-invalid；placeholder 不渲染                                                                     |
| pagination          | 0    | 3    | 双重 page change（×2）；disabled 允许编辑                                                                                                             |
| panel               | 0    | 3    | aria-hidden 使按钮无标签；action 触发折叠；非 collapsible 有 aria-expanded                                                                            |
| picture-preview     | 0    | 2    | src 变化 zoom/pan 不重置；onClose 被忽略                                                                                                              |
| popover             | 0    | 3    | interactions=none 仍被 Escape 关闭；aria-modal 矛盾；useDrag 不检测 remount                                                                           |
| progress            | 0    | 4    | aria-valuenow 用百分比（×2）；Connects style 覆盖颜色；strokeWidth > size/2 崩溃                                                                      |
| radio               | 0    | 3    | Space/Enter 取消已选（×2）；aria-describedby 指向 label                                                                                               |
| range               | 0    | 4    | 键盘不移动 uncontrolled thumb（×2）；step snapping 不考虑 min offset（×2）                                                                            |
| rich-input          | 1    | 3    | onFocus/onBlur 传空 {}（×2）；ref_user 缺 Slate 属性                                                                                                  |
| scroll-area         | 2    | 5    | track 点击不考虑 thumb 大小（×3）；useThumbDrag listener 泄漏；setTimeout 泄漏                                                                        |
| search-input        | 0    | 3    | uncontrolled clear 不显示；clear 不回焦；i18n.placeholder 不生效                                                                                      |
| segmented           | 2    | 2    | 无 uncontrolled 模式；value 含空格产生无效 ID                                                                                                         |
| select              | 3    | 2    | value=null 选中第一项；controlled 冗余 setOpen                                                                                                        |
| separator           | 0    | 1    | children 时重复 separator role                                                                                                                        |
| skeleton            | 0    | 2    | useMemo 缺 hasChildren deps；variant 泄漏为 DOM attribute                                                                                             |
| slot                | 1    | 1    | mergeProps 丢弃 data-testid                                                                                                                           |
| spinner             | 0    | 2    | 自定义 label 被覆盖（Bounce + Spin）                                                                                                                  |
| spring-visualizer   | 0    | 1    | 多实例共享 gradient ID                                                                                                                                |
| stackflow           | 0    | 2    | 无 initialId 不显示；exit animation 被 return null 阻断                                                                                               |
| switch              | 1    | 4    | numeric children 无 aria-label；缺 role=switch；sr-only 覆盖 aria-label；readOnly 设 disabled                                                         |
| table               | 0    | 3    | getSelectedKeys 返回已删行；aria-rowcount 不含 header；window scroll 模式 onScroll 被忽略                                                             |
| tabs                | 1    | 5    | 右键/中键触发切换（×2）；点击不移动焦点；icon-only 缺 aria-label；readOnly 不触发事件                                                                 |
| text-field          | 0    | 1    | className 双重应用                                                                                                                                    |
| textarea            | 2    | 3    | Shift+Enter 不阻止；style 被丢弃；compound pattern 丢弃 child onChange                                                                                |
| toast               | 1    | 1    | cancel button onClick 不触发                                                                                                                          |
| toggle-button       | 1    | 5    | rest 覆盖 checked（×2）；sr-only 文本重复；keyboard navigation 被覆盖；缺 aria-multiselectable                                                        |
| tooltip             | 2    | 1    | content={0} 不渲染                                                                                                                                    |
| tree-list           | 0    | 1    | 变异传入的 data prop                                                                                                                                  |
| virtualized-grid    | 0    | 1    | rootMargin 假设每行 100px                                                                                                                             |

---

## 全部 199 个 FAIL 测试明细

```
app/components/alert-dialog/src/__tests__/alert-dialog.test.tsx
  × BUG 1: Enter on Cancel button must resolve false, not true
  × BUG 2: closeAll must resolve pending dialog promises, not leak them

app/components/avatar/src/__tests__/avatar.test.tsx
  × BUG 4: anonymous state must not pulse forever when photo is provided
  × BUG 5: img must have alt attribute even when name is not provided

app/components/badge/src/__tests__/badge.test.tsx
  × BUG 1: single wrapping element with array children should not get multi-element padding

app/components/bells/src/__tests__/bells.test.tsx
  × BUG 2: close button click must call sonnerToast.dismiss

app/components/bezier-curve-editor/src/__tests__/bezier-curve-editor.test.tsx
  × BUG 1: Preview animation must use valid 4-value cubic-bezier()

app/components/button/src/__tests__/button.test.tsx
  × BUG 1.1: loading spinner must show even when children is a React element

app/components/calendar/src/__tests__/calendar.test.tsx
  × BUG 4: minDate with non-midnight time must not disable the minDate day itself

app/components/checkbox/src/__tests__/checkbox.test.tsx
  × BUG 2.3: aria-checked must always be present on role=checkbox
  × BUG 4: Enter key must not toggle checkbox (only Space should)
  × BUG 5: CheckboxIcon data-active must be true for mixed/indeterminate state
  × BUG 6: aria-describedby must not point to the same element as the label

app/components/chip/src/__tests__/chip.test.tsx
  × BUG 1: onClick must NOT fire when chip is disabled (×2: click + aria-disabled)

app/components/chips-input/src/__tests__/chips-input.test.tsx
  × BUG 2: input must NOT be cleared when duplicate chip is rejected on Enter
  × BUG 4: external onKeyDown with preventDefault must block chip behavior
  × BUG: Backspace on empty input deletes last chip immediately

app/components/code-block/src/__tests__/code-block.test.tsx
  × BUG 1: footer must not render without lineThreshold for short code
  × BUG 2: copy must extract code from fragment-wrapped content
  × BUG 3: extractCodeFromChildren must handle string array children

app/components/colors/src/__tests__/colors.test.tsx
  × BUG 1: ColorSlider onChange not called on pointer release
  × BUG 2: GradientSlider new stops share the same nanoid
  × BUG 3: Gradient rotation produces invalid transform matrix
  × BUG 4: ColorArea onChange not called on pointer release

app/components/colors/src/__tests__/color-parser.test.ts
  × BUG 5: HSLA comma-separated alpha must be preserved (×2)
  × BUG 6: Modern HSL syntax with / alpha must parse correctly

app/components/combobox/src/__tests__/combobox.test.tsx
  × BUG 1: trigger click must toggle open state in controlled mode
  × BUG 2: onBlur must receive a string, not a FocusEvent
  × BUG 3: focusing input with value must open dropdown in uncontrolled mode

app/components/command/src/__tests__/command.test.tsx
  × BUG 1: groups must be reordered by search relevance
  × BUG 2: forceMount items must be registered in the ids map

app/components/comments/src/__tests__/comments.test.tsx
  × BUG 1: clicking any reaction always toggles the first reaction

app/components/conditions/src/__tests__/conditions.test.tsx
  × BUG 1: MultiSelectInput must render a multi-select element
  × BUG 2: Conditions must sync internal state when value prop changes
  × BUG 3: Conditions must not fire onChange on mount

app/components/context-input/src/__tests__/context-input.test.tsx
  × BUG 1: MentionMenu handleKeyDown dispatches to wrong listbox with multiple instances
  × BUG 2: parseTextWithMentions must preserve paragraph structure
  × BUG 3: keyboard selection of mentions must work
  × BUG 4: renderSuggestion must receive isSelected=true for highlighted item

app/components/context-menu/src/__tests__/context-menu.test.tsx
  × BUG 1: Enter on SubTrigger must open the submenu via keyboard
  × BUG 2: rapid right-click must not cause premature close

app/components/description/src/__tests__/description.test.tsx
  × BUG 1: disabled description must set aria-disabled

app/components/dialog/src/__tests__/dialog.test.tsx
  × BUG 1: draggable header must respond to keyboard
  × BUG 2: resize handles must respond to keyboard
  × BUG: partial resizable config must not collapse non-resizable dimension (×2)
  × BUG: isClosing stuck true when rememberPosition && rememberSize

app/components/dropdown/src/__tests__/dropdown.test.tsx
  × BUG 1: focusManagerProps partial override must not lose coordinate-mode defaults
  × BUG 2: hasFocusInside must be reset when dropdown closes
  × BUG 3: disableKeyboardNavigation must prevent SubTrigger from opening on Enter
  × BUG 5: loop:true on useListNavigation causes unexpected wrap-around

app/components/emoji-picker/src/__tests__/emoji-picker.test.tsx
  × BUG 1: emoji buttons must have aria-label for screen reader accessibility (×2)

app/components/error-message/src/__tests__/error-message.test.tsx
  × BUG 1: must render as a <p> element matching its TypeScript type
  × BUG 9: role=alert must not be overridable by rest props

app/components/file-upload/src/__tests__/file-upload.test.tsx
  × BUG 2: onValueChange must be called exactly once per file addition
  × BUG 8: drag-and-drop must accept files with uppercase extensions

app/components/form/src/__tests__/form.test.tsx
  × BUG 1: MultiSelect adapter must forward onBlur to a child element
  × BUG 2: RangeAdapter must forward onBlur and onFocus to Range (×2)

app/components/hint/src/__tests__/hint.test.tsx
  × BUG 1: tooltip must not reappear when disabled toggles back to false
  × BUG 6: must detect Hint.Trigger even when wrapped in another element

app/components/icon-button/src/__tests__/icon-button.test.tsx
  × BUG 6: type=button must not be forced on non-button asChild elements
  × BUG 7: must set aria-disabled and aria-busy for accessibility (×3)

app/components/input/src/__tests__/input.test.tsx
  × BUG 1: onIsEditingChange must not fire on unmount if editing was never started

app/components/kbd/src/__tests__/kbd.test.tsx
  × BUG 1: kbd must have an accessible name for keyboard shortcuts
  × BUG 2: children must render as direct text, not wrapped in extra span

app/components/label/src/__tests__/label.test.tsx
  × BUG 1: required asterisk must have an accessible label
  × BUG 2: as=legend must not receive htmlFor attribute

app/components/link-button/src/__tests__/link-button.test.tsx
  × BUG 1: onClick must NOT fire when disabled link is clicked
  × BUG 9: uppercase protocol URLs must be detected as external
  × BUG 10: href='' must render as anchor, not button

app/components/list/src/__tests__/list.test.tsx
  × BUG 5: user onKeyDown must not be silently overridden

app/components/loader/src/__tests__/loader.test.tsx
  × BUG 8: must not crash with empty stages array

app/components/md-input/src/__tests__/md-input.test.tsx
  × BUG 2: List/quote prefix inserted at cursor instead of line start

app/components/md-render/src/__tests__/md-render.test.tsx
  × BUG 1: custom code component is overridden by INITIAL_COMPONENTS
  × BUG 2: MarkdownBlock memo ignores components prop changes

app/components/menubar/src/__tests__/menubar.test.tsx
  × BUG 3: focus must return to trigger after Escape closes dropdown

app/components/menus/src/__tests__/menus.test.tsx
  × BUG 1: MenuContextItem must emit click tree event exactly once per click
  × BUG 2: MenuCheckbox must render an indeterminate indicator

app/components/modal/src/__tests__/modal.test.tsx
  × BUG 1: ModalSelect label must focus the select on click
  × BUG 2: Modal root must have role=dialog and aria-modal=true (×2)
  × BUG 3: Close button must have an aria-label
  × BUG 5: Modal backdrop must close on Escape key
  × BUG 6: ModalInput description must be linked via aria-describedby

app/components/multi-select/src/__tests__/multi-select.test.tsx
  × BUG 1: aria-expanded must reflect actual open state
  × BUG 6: chip removal must enforce minSelection

app/components/notifications/src/__tests__/notifications.test.tsx
  × BUG 1: default position must not be overridden by undefined spread

app/components/numeric-input/src/__tests__/numeric-input.test.tsx
  × BUG 1: ArrowUp/ArrowDown must call preventDefault (×2)
  × BUG 2: onPressStart and onPressEnd must be called exactly once per press

app/components/numeric-input/src/__tests__/hooks/use-numeric-input.test.tsx (×24)
  × 全部 24 个 hooks 测试失败

app/components/numeric-input/src/__tests__/utils/expression-evaluator.test.ts
  × handles negative numbers
  × returns NaN for unbalanced parentheses
  × returns NaN for non-numeric input
  × handles empty expression

app/components/numeric-input/src/__tests__/utils/pattern-parser.test.ts
  × handles pattern with text before, between, and after variables

app/components/otp-input/src/__tests__/otp-input.test.tsx
  × BUG 1: ref must be forwarded to the underlying input element (×2)
  × BUG 2: OTP slot divs must have aria-hidden
  × BUG 3: aria-invalid must be set when isInvalid is true
  × BUG 4: placeholder must render in empty slots when provided

app/components/pagination/src/__tests__/pagination.test.tsx
  × BUG 1: double page change when clicking prev/next while editing spinner (×2)
  × BUG 2: disabled pagination spinner still allows entering edit mode

app/components/panel/src/__tests__/panel.test.tsx
  × BUG 1: collapsible title button must have an accessible name
  × BUG 2: clicking action buttons must NOT trigger collapse
  × BUG 3: non-collapsible panel must NOT have aria-expanded

app/components/picture-preview/src/__tests__/picture-preview.test.tsx
  × BUG 1: Zoom and pan position not reset when src changes
  × BUG 2: onClose prop is silently ignored

app/components/popover/src/__tests__/popover.test.tsx
  × BUG 5: interactions=none must not close on Escape
  × BUG: aria-modal contradicts actual modal behavior
  × BUG: useDrag does not detect floatingRef.current changes

app/components/progress/src/__tests__/progress.test.tsx
  × BUG 4: ProgressBar aria-valuenow must use actual value, not percentage
  × BUG 5: ProgressCircle aria-valuenow must use actual value, not percentage
  × BUG 6: Connects style must not override based-on-value backgroundColor
  × BUG 7: ProgressCircle must handle strokeWidth larger than size/2

app/components/radio/src/__tests__/radio.test.tsx
  × BUG 1: Space on checked radio must NOT uncheck it (×2)
  × BUG 2: aria-describedby must not point to the label element itself

app/components/range/src/__tests__/range.test.tsx
  × BUG 1: keyboard must move thumb in uncontrolled mode (×2)
  × BUG 2: step snapping must account for min offset (×2)

app/components/rich-input/src/__tests__/rich-input.test.tsx
  × BUG 6: onFocus must receive an event with a target property
  × BUG 7: onBlur must receive an event with a target property
  × BUG: ref_user element missing Slate attributes

app/components/scroll-area/src/__tests__/scroll-area.test.tsx
  × BUG 1: track click must center thumb on click point (×3)
  × BUG 5: useThumbDrag cleans up listeners on re-entry
  × BUG 7: delayedUpdateScrollState timer leak

app/components/search-input/src/__tests__/search-input.test.tsx
  × BUG 4: clear button must appear in uncontrolled mode after typing
  × BUG 5: clear button must refocus the input after clearing
  × BUG 8: i18n.placeholder must override default placeholder text

app/components/segmented/src/__tests__/segmented.test.tsx
  × BUG 7: value with spaces must not produce invalid HTML IDs
  × BUG 9: must work in uncontrolled mode without value prop

app/components/select/src/__tests__/select.test.tsx
  × BUG 7.2: selecting an item must call onOpenChange(false) exactly once
  × BUG 7.3: value={null} must not visually select the first item

app/components/separator/src/__tests__/separator.test.tsx
  × BUG 7: only one separator role when children are provided

app/components/skeleton/src/__tests__/skeleton.test.tsx
  × BUG 1: useMemo must include hasChildren in dependency array
  × BUG 2: variant prop must not leak as DOM attribute

app/components/slot/src/__tests__/slot.test.tsx
  × BUG 1: mergeProps must not silently drop slot data-testid

app/components/spinner/src/__tests__/spinner.test.tsx
  × BUG 1: custom label must override default aria-label (SpinnerBounce)
  × BUG 5: custom label must override default aria-label (SpinnerSpin)

app/components/spring-visualizer/src/__tests__/spring-visualizer.test.tsx
  × BUG 1: multiple instances must not share gradient ID

app/components/stackflow/src/__tests__/stackflow.test.tsx
  × BUG 1: No item displayed when initialId/defaultId are omitted
  × BUG: StackflowItem return null prevents exit animation

app/components/switch/src/__tests__/switch.test.tsx
  × BUG 3.1: numeric children must produce a valid aria-label
  × BUG 3.2: Switch must have role=switch for screen readers
  × BUG 3.3: sr-only text must not override custom aria-label
  × BUG 3.4: readOnly must not set disabled on the input element

app/components/table/src/__tests__/table.test.tsx
  × BUG 4: getSelectedKeys must not return keys for removed rows
  × BUG 5: aria-rowcount must include header row
  × BUG: onScroll ignored in window scroll mode

app/components/tabs/src/__tests__/tabs.test.tsx
  × BUG 5.1: right-click must NOT change the active tab (×2)
  × BUG 5.2: clicking a tab must move focus to it
  × BUG 6: icon-only tabs must have accessible name via aria-label
  × BUG 7: user event handlers must fire in readOnly mode

app/components/text-field/src/__tests__/text-field.test.tsx
  × BUG 1: className must be applied only once when a Label is present

app/components/textarea/src/__tests__/textarea.test.tsx
  × BUG 4: compound pattern must not silently drop child onChange
  × BUG 6.1: allowNewline=false must block Shift+Enter
  × BUG 6.3: style prop must be applied to the container

app/components/toast/src/__tests__/toast.test.tsx
  × BUG 2: cancel button onClick must be called

app/components/toggle-button/src/__tests__/toggle-button.test.tsx
  × BUG 2: rest props must not override checked state (×2)
  × BUG 11: sr-only text must be properly associated with the input

app/components/toggle-button/src/__tests__/toggle-group.test.tsx
  × BUG 14: rest onKeyDown must not replace built-in keyboard navigation
  × BUG 15: must set aria-multiselectable when multiple is true

app/components/tooltip/src/__tests__/tooltip.test.tsx
  × BUG 10: content={0} must render the tooltip

app/components/tree-list/src/__tests__/tree-list.test.tsx
  × BUG 6: must not mutate input data by adding parentId

app/components/virtualized-grid/src/__tests__/virtualized-grid.test.tsx
  × BUG 7: rootMargin must account for actual row height, not assume 100px
```

---

## 按类别分类

### 键盘交互 Bug（38 个）

Enter/Space 在不该触发时触发、Arrow 键不移动焦点、快捷键被拦截、readOnly 不生效

### A11y Bug（45 个）

aria-label 缺失、aria-expanded/aria-checked/aria-modal 值错误、aria-describedby 指向错误、role 不正确、aria-hidden 使元素不可访问

### 状态管理 Bug（32 个）

controlled/uncontrolled 不同步、state 在 close 后不重置、props 变化不反映、unmount 时触发错误回调

### 事件处理 Bug（28 个）

onClick 不触发或重复触发、onBlur/onFocus 传错误参数、preventDefault 被忽略、事件冒泡被错误阻止

### 渲染/逻辑 Bug（34 个）

条件渲染错误、props 被静默忽略、数学计算错误、ID 重复、DOM attribute 泄漏

### 工具函数 Bug（11 个）

expression evaluator 边界 case、pattern parser 精度丢失、color parser 格式不支持

---

## 建议修复顺序

1. **P0 — A11y（45 个）**：影响所有用户，包括屏幕阅读器用户
2. **P1 — 键盘交互（38 个）**：影响键盘用户和可访问性合规
3. **P2 — 状态管理（32 个）**：影响数据完整性和受控组件行为
4. **P3 — 事件处理（28 个）**：影响回调可靠性和集成
5. **P4 — 渲染/逻辑（34 个）**：影响视觉正确性和功能
6. **P5 — 工具函数（11 个）**：影响边界 case 和格式兼容
