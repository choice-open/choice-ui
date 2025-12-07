import { Children, ComponentType, ReactElement, ReactNode } from "react"

import { isValidElement } from "react"

export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

export function assertNever(value: never, message = "Unreachable"): never {
  throw new Error(message)
}

export type Dict<T = unknown> = Record<string, T>

export function isArray<T>(value: unknown): value is Array<T> {
  return Array.isArray(value)
}

export function isEmptyArray(value: unknown): boolean {
  return isArray(value) && value.length === 0
}

export function isObject(value: unknown): value is Dict {
  const type = typeof value

  return value != null && (type === "object" || type === "function") && !isArray(value)
}

export function isEmptyObject(value: unknown): boolean {
  return isObject(value) && Object.keys(value).length === 0
}

// Empty assertions
export function isEmpty(value: unknown): boolean {
  if (isArray(value)) return isEmptyArray(value)
  if (isObject(value)) return isEmptyObject(value)
  if (value == null || value === "") return true

  return false
}

// Function assertions
export function isFunction<
  T extends (...args: unknown[]) => unknown = (...args: unknown[]) => unknown,
>(value: unknown): value is T {
  return typeof value === "function"
}

type Booleanish = boolean | "true" | "false"
export const dataAttr = (condition: boolean | undefined) =>
  (condition ? "true" : undefined) as Booleanish

export const isNumeric = (value?: string | number): boolean =>
  value != null && parseInt(value.toString(), 10) > 0

export const isMultiElement = (children: ReactNode): boolean => {
  return (
    (isValidElement(children) && Array.isArray((children as ReactElement).props.children)) ||
    (Array.isArray(children) && children.length > 1)
  )
}

export const findChildByType = (
  children: ReactNode,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentType: ComponentType<any>,
): ReactElement | null => {
  let result: ReactElement | null = null

  Children.forEach(children, (child) => {
    if (!result && isValidElement(child) && child.type === componentType) {
      result = child
    }
  })

  return result
}
