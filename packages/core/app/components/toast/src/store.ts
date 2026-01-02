import type { ToastPosition, ToastType, ToastVariant } from "./types"

// Toast data stored in the global store
export interface ToastData {
  id: string
  type: ToastType
  variant?: ToastVariant
  /**
   * Title content. Supports:
   * - Plain string: rendered as text
   * - HTML string (containing tags like `<b>`, `<strong>`, etc.): rendered as HTML
   * - ReactNode: rendered as React component
   */
  title?: React.ReactNode
  /**
   * Description content. Supports:
   * - Plain string: rendered as text
   * - HTML string (containing tags like `<b>`, `<strong>`, etc.): rendered as HTML
   * - ReactNode: rendered as React component
   */
  description?: React.ReactNode
  duration?: number
  icon?: React.ReactNode
  action?: {
    label: React.ReactNode
    onClick: () => void
  }
  cancel?: {
    label: React.ReactNode
    onClick?: () => void
  }
  onClose?: () => void
  onAutoClose?: () => void
  dismissible?: boolean
  // Internal
  createdAt: number
  height?: number
  // For exit animation
  removing?: boolean
  swipeDirection?: "left" | "right" | "up" | "down"
}

export interface ToastOptions {
  id?: string
  variant?: ToastVariant
  /**
   * Description content. Supports:
   * - Plain string: rendered as text
   * - HTML string (containing tags like `<b>`, `<strong>`, etc.): rendered as HTML
   * - ReactNode: rendered as React component
   */
  description?: React.ReactNode
  duration?: number
  icon?: React.ReactNode
  action?: {
    label: React.ReactNode
    onClick: () => void
  }
  cancel?: {
    label: React.ReactNode
    onClick?: () => void
  }
  onClose?: () => void
  onAutoClose?: () => void
  dismissible?: boolean
}

export interface ToasterState {
  toasts: ToastData[]
  expanded: boolean
  position: ToastPosition
}

// Subscriber can be called with or without state (for useSyncExternalStore compatibility)
type Subscriber = (state?: ToasterState) => void

// Store for each toaster instance
const stores = new Map<string, ToasterState>()
const subscribers = new Map<string, Set<Subscriber>>()

// Default toaster ID
const DEFAULT_TOASTER_ID = "default"

// Maximum number of toasts per toaster to prevent memory issues
const MAX_TOASTS_PER_TOASTER = 100

// Safe counter for generating unique IDs
let toastCounter = 0
const MAX_COUNTER = Number.MAX_SAFE_INTEGER - 1

function generateId(): string {
  if (toastCounter >= MAX_COUNTER) {
    toastCounter = 0
  }
  return `toast-${++toastCounter}-${Date.now()}`
}

// Validate toaster ID to prevent injection
function validateToasterId(toasterId: string): string {
  if (typeof toasterId !== "string" || toasterId.length === 0) {
    return DEFAULT_TOASTER_ID
  }
  // Limit length to prevent memory issues
  return toasterId.slice(0, 64)
}

// Get or create store for a toaster
function getStore(toasterId: string = DEFAULT_TOASTER_ID): ToasterState {
  if (!stores.has(toasterId)) {
    stores.set(toasterId, {
      toasts: [],
      expanded: false,
      position: "bottom-right",
    })
  }
  return stores.get(toasterId)!
}

// Create a new state object to trigger React re-render
function updateStore(toasterId: string, updates: Partial<ToasterState>) {
  const current = getStore(toasterId)
  const newState = { ...current, ...updates }
  stores.set(toasterId, newState)
  return newState
}

// Notify subscribers of state change
function notify(toasterId: string = DEFAULT_TOASTER_ID) {
  const subs = subscribers.get(toasterId)
  if (subs) {
    subs.forEach((callback) => callback(getStore(toasterId)))
  }
}

// Subscribe to store changes
export function subscribe(
  callback: Subscriber,
  toasterId: string = DEFAULT_TOASTER_ID,
): () => void {
  const validatedId = validateToasterId(toasterId)
  if (!subscribers.has(validatedId)) {
    subscribers.set(validatedId, new Set())
  }
  subscribers.get(validatedId)!.add(callback)

  // Return unsubscribe function
  return () => {
    const subs = subscribers.get(validatedId)
    subs?.delete(callback)
    // Clean up empty subscriber sets and unused stores
    if (subs?.size === 0) {
      subscribers.delete(validatedId)
      // Only delete store if it has no toasts
      const store = stores.get(validatedId)
      if (store?.toasts.length === 0) {
        stores.delete(validatedId)
      }
    }
  }
}

// Get current state (for useSyncExternalStore)
export function getSnapshot(toasterId: string = DEFAULT_TOASTER_ID): ToasterState {
  return getStore(toasterId)
}

// Update toaster config
export function setToasterConfig(
  config: Partial<Pick<ToasterState, "position" | "expanded">>,
  toasterId: string = DEFAULT_TOASTER_ID,
) {
  updateStore(toasterId, config)
  notify(toasterId)
}

// Core toast functions
function addToast(
  title: React.ReactNode,
  type: ToastType,
  options: ToastOptions = {},
  toasterId: string = DEFAULT_TOASTER_ID,
): string {
  const validatedId = validateToasterId(toasterId)
  const store = getStore(validatedId)
  const id = options.id ?? generateId()

  // Check if toast with same id exists
  const existingIndex = store.toasts.findIndex((t) => t.id === id)

  const toastData: ToastData = {
    id,
    type,
    variant: options.variant,
    title,
    description: options.description,
    duration: options.duration,
    icon: options.icon,
    action: options.action,
    cancel: options.cancel,
    onClose: options.onClose,
    onAutoClose: options.onAutoClose,
    dismissible: options.dismissible ?? true,
    createdAt: Date.now(),
  }

  let newToasts: ToastData[]
  if (existingIndex !== -1) {
    // Update existing toast
    newToasts = [...store.toasts]
    newToasts[existingIndex] = toastData
  } else {
    // Add new toast at the beginning
    newToasts = [toastData, ...store.toasts]
    // Prevent memory overflow by limiting max toasts
    if (newToasts.length > MAX_TOASTS_PER_TOASTER) {
      // Remove oldest toasts, call their onClose callbacks
      const removed = newToasts.splice(MAX_TOASTS_PER_TOASTER)
      removed.forEach((t) => t.onClose?.())
    }
  }

  updateStore(validatedId, { toasts: newToasts })
  notify(validatedId)
  return id
}

// Dismiss a toast
export function dismiss(id: string, toasterId: string = DEFAULT_TOASTER_ID) {
  const store = getStore(toasterId)
  const toast = store.toasts.find((t) => t.id === id)

  if (toast) {
    // Call onClose callback
    toast.onClose?.()
    // Remove from store with new array reference
    const newToasts = store.toasts.filter((t) => t.id !== id)
    updateStore(toasterId, { toasts: newToasts })
    notify(toasterId)
  }
}

// Dismiss all toasts
export function dismissAll(toasterId?: string) {
  if (toasterId) {
    const store = getStore(toasterId)
    store.toasts.forEach((t) => t.onClose?.())
    updateStore(toasterId, { toasts: [] })
    notify(toasterId)
  } else {
    // Dismiss all toasts in all toasters
    stores.forEach((store, id) => {
      store.toasts.forEach((t) => t.onClose?.())
      updateStore(id, { toasts: [] })
      notify(id)
    })
  }
}

// Update toast height (called from ToastItem)
export function updateHeight(id: string, height: number, toasterId: string = DEFAULT_TOASTER_ID) {
  const store = getStore(toasterId)
  const toastIndex = store.toasts.findIndex((t) => t.id === id)
  if (toastIndex !== -1 && store.toasts[toastIndex].height !== height) {
    const newToasts = [...store.toasts]
    newToasts[toastIndex] = { ...newToasts[toastIndex], height }
    updateStore(toasterId, { toasts: newToasts })
    notify(toasterId)
  }
}

// Set expanded state
export function setExpanded(expanded: boolean, toasterId: string = DEFAULT_TOASTER_ID) {
  updateStore(toasterId, { expanded })
  notify(toasterId)
}

// Promise-based toast
interface PromiseOptions<T> {
  loading: string | (ToastOptions & { title: string })
  success:
    | string
    | (ToastOptions & { title: string })
    | ((data: T) => string | (ToastOptions & { title: string }))
  error:
    | string
    | (ToastOptions & { title: string })
    | ((err: unknown) => string | (ToastOptions & { title: string }))
}

function promiseToast<T>(
  promise: Promise<T>,
  options: PromiseOptions<T>,
  toasterId: string = DEFAULT_TOASTER_ID,
): Promise<T> {
  const loadingOpts =
    typeof options.loading === "string" ? { title: options.loading } : options.loading
  const id = addToast(
    loadingOpts.title,
    "loading",
    { ...loadingOpts, duration: Infinity },
    toasterId,
  )

  promise
    .then((data) => {
      const successOpts =
        typeof options.success === "function" ? options.success(data) : options.success
      const opts = typeof successOpts === "string" ? { title: successOpts } : successOpts
      addToast(opts.title, "success", { ...opts, id }, toasterId)
    })
    .catch((err) => {
      const errorOpts = typeof options.error === "function" ? options.error(err) : options.error
      const opts = typeof errorOpts === "string" ? { title: errorOpts } : errorOpts
      addToast(opts.title, "error", { ...opts, id }, toasterId)
    })

  return promise
}

// Main toast function and its variants
type ToastFunction = {
  (title: string, options?: ToastOptions): string
  success: (title: string, options?: ToastOptions) => string
  error: (title: string, options?: ToastOptions) => string
  warning: (title: string, options?: ToastOptions) => string
  info: (title: string, options?: ToastOptions) => string
  loading: (title: string, options?: ToastOptions) => string
  promise: <T>(promise: Promise<T>, options: PromiseOptions<T>) => Promise<T>
  dismiss: (id: string) => void
  dismissAll: () => void
  // For targeting specific toaster
  use: (toasterId: string) => {
    (title: string, options?: ToastOptions): string
    success: (title: string, options?: ToastOptions) => string
    error: (title: string, options?: ToastOptions) => string
    warning: (title: string, options?: ToastOptions) => string
    info: (title: string, options?: ToastOptions) => string
    loading: (title: string, options?: ToastOptions) => string
    promise: <T>(promise: Promise<T>, options: PromiseOptions<T>) => Promise<T>
    dismiss: (id: string) => void
    dismissAll: () => void
  }
}

function createToastApi(toasterId: string = DEFAULT_TOASTER_ID) {
  const validatedId = validateToasterId(toasterId)

  const api = (title: string, options?: ToastOptions) =>
    addToast(title, "default", options, validatedId)

  api.success = (title: string, options?: ToastOptions) =>
    addToast(title, "success", options, validatedId)
  api.error = (title: string, options?: ToastOptions) =>
    addToast(title, "error", options, validatedId)
  api.warning = (title: string, options?: ToastOptions) =>
    addToast(title, "warning", options, validatedId)
  api.info = (title: string, options?: ToastOptions) =>
    addToast(title, "info", options, validatedId)
  api.loading = (title: string, options?: ToastOptions) =>
    addToast(title, "loading", options, validatedId)
  api.promise = <T>(promise: Promise<T>, options: PromiseOptions<T>) =>
    promiseToast(promise, options, validatedId)
  api.dismiss = (id: string) => dismiss(id, validatedId)
  api.dismissAll = () => dismissAll(validatedId)

  return api
}

// Cache for toast.use() APIs to avoid creating new objects on each call
const toastApiCache = new Map<string, ReturnType<typeof createToastApi>>()

function getOrCreateToastApi(toasterId: string): ReturnType<typeof createToastApi> {
  const validatedId = validateToasterId(toasterId)
  let api = toastApiCache.get(validatedId)
  if (!api) {
    api = createToastApi(validatedId)
    toastApiCache.set(validatedId, api)
  }
  return api
}

// Create the main toast API
const baseToast = createToastApi()

export const toast: ToastFunction = Object.assign(baseToast, {
  use: (toasterId: string) => getOrCreateToastApi(toasterId),
})
