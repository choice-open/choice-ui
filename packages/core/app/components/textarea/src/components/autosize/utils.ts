// SSR 安全的环境检测
export const isBrowser = typeof window !== "undefined" && typeof document !== "undefined"

export const noop = () => {}

// 改进的 pick 函数，更好的类型安全
export const pick = <Obj extends Record<string, unknown>, Key extends keyof Obj>(
  props: readonly Key[],
  obj: Obj,
): Pick<Obj, Key> =>
  props.reduce(
    (acc, prop) => {
      if (prop in obj) {
        acc[prop] = obj[prop]
      }
      return acc
    },
    {} as Pick<Obj, Key>,
  )
