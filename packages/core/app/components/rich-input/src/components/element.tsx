import { tcx } from "@choiceform/design-shared"
import { CheckboxBtn, CheckboxBtnChecked } from "@choiceform/icons-react"
import { memo } from "react"
import { Transforms } from "slate"
import { ReactEditor, useReadOnly, useSlate } from "slate-react"
import { match } from "ts-pattern"
import { elementTv } from "../tv"
import type { CustomElement, ElementRenderProps } from "../types"

export type { ElementRenderProps }

export const ElementRender = memo((props: ElementRenderProps) => {
  const { attributes, children, element } = props

  const tv = elementTv()

  return match(element.type)
    .with("paragraph", () => (
      <p
        className={tcx(tv.element({ type: "paragraph" }))}
        {...attributes}
      >
        {children}
      </p>
    ))
    .with("block_quote", () => (
      <blockquote
        className={tcx(tv.element({ type: "blockquote" }))}
        {...attributes}
      >
        {children}
      </blockquote>
    ))
    .with("code", () => (
      <pre
        className={tcx(tv.element({ type: "pre" }))}
        {...attributes}
      >
        {children}
      </pre>
    ))
    .with("check_list", () => (
      <ul
        className={tcx(tv.list({ type: "check" }))}
        {...attributes}
      >
        {children}
      </ul>
    ))
    .with("bulleted_list", () => (
      <ul
        className={tcx(tv.list({ type: "bulleted" }))}
        {...attributes}
      >
        {children}
      </ul>
    ))
    .with("h1", () => (
      <h1
        className={tcx(tv.element({ type: "heading" }), tv.element({ type: "h1" }))}
        {...attributes}
      >
        {children}
      </h1>
    ))
    .with("h2", () => (
      <h2
        className={tcx(tv.element({ type: "heading" }), tv.element({ type: "h2" }))}
        {...attributes}
      >
        {children}
      </h2>
    ))
    .with("h3", () => (
      <h3
        className={tcx(tv.element({ type: "heading" }), tv.element({ type: "h3" }))}
        {...attributes}
      >
        {children}
      </h3>
    ))
    .with("h4", () => (
      <h4
        className={tcx(tv.element({ type: "heading" }), tv.element({ type: "h4" }))}
        {...attributes}
      >
        {children}
      </h4>
    ))
    .with("h5", () => (
      <h5
        className={tcx(tv.element({ type: "heading" }), tv.element({ type: "h5" }))}
        {...attributes}
      >
        {children}
      </h5>
    ))
    .with("h6", () => (
      <h6
        className={tcx(tv.element({ type: "heading" }), tv.element({ type: "h6" }))}
        {...attributes}
      >
        {children}
      </h6>
    ))
    .with("numbered_list", () => (
      <ol
        className={tcx(tv.list({ type: "numbered" }))}
        {...attributes}
      >
        {children}
      </ol>
    ))
    .with("list_item", () => (
      <li
        className={tcx(tv.element({ type: "listItem" }))}
        {...attributes}
      >
        {children}
      </li>
    ))
    .with("check_item", () => (
      <CheckListItemElement
        attributes={attributes}
        element={element}
      >
        {children}
      </CheckListItemElement>
    ))
    .with("ref_user", () => <span>ref_user</span>)
    .otherwise(() => (
      <p
        className={tcx(tv.element({ type: "paragraph" }))}
        {...attributes}
      >
        {children}
      </p>
    ))
})

ElementRender.displayName = "ElementRender"

const CheckListItemElement = memo(function CheckListItemElement(props: ElementRenderProps) {
  const { attributes, children, element } = props

  const editor = useSlate()
  const readOnly = useReadOnly()
  const checked = element.checked ?? false

  const tv = elementTv()

  return (
    <li
      className={tcx(tv.checkbox())}
      {...attributes}
    >
      <div
        contentEditable={false}
        className={tcx(tv.checkboxIcon({ checked }))}
      >
        <input
          className={tcx(tv.checkboxInput())}
          type="checkbox"
          checked={checked}
          onChange={(event) => {
            const path = ReactEditor.findPath(
              editor as ReactEditor,
              element as import("slate").Node,
            )
            const newProperties: Partial<CustomElement> = {
              checked: event.target.checked,
            }
            Transforms.setNodes(editor, newProperties, { at: path })
          }}
        />
        {checked ? <CheckboxBtnChecked /> : <CheckboxBtn />}
      </div>
      <span
        contentEditable={!readOnly}
        suppressContentEditableWarning
      >
        {children}
      </span>
    </li>
  )
})
