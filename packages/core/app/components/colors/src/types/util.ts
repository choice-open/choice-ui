/**
 * 用于「展平」对象类型
 *
 *  @example
 *
 *  type A = Flatten<{ a: number; b: string }>;
 *
 *  A 的类型是 { a: number; b: string }
 */
export type Flatten<T> = T extends object ? { [K in keyof T]: T[K] } : T

export type FlattenWithType<T, N> = T extends object ? { [K in keyof T]: T[K] | N } : T

export type FlattenToType<T, N> = T extends object ? { [K in keyof T]: N } : N

export type FlattenWithPrefixAndType<
  T,
  U,
  Prefix extends string,
  ExcludedKey extends keyof T = never,
> = T extends object
  ? {
      [P in keyof T as P extends ExcludedKey ? never : `${Prefix}${Capitalize<string & P>}`]:
        | T[P]
        | U
    }
  : T

// 定义一个新的类型，使得 T 类型中的所有属性都是可选的，除了 K 中的属性
export type PartialExceptId<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>

export type ValueOf<T> = T[keyof T]

// expands object types one level deep
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
