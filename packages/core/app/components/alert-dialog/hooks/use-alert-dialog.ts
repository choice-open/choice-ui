import { useCallback, useReducer } from "react"
import { useAlertDialogContext } from "../alert-dialog-context"
import {
  AlertDialogAlertConfig,
  AlertDialogConfirmConfig,
  AlertDialogCustomConfig,
  AlertDialogResult,
  UseAlertDialogReturn,
} from "../types"
import {
  alertDialogReducer,
  initialState,
  normalizeAlertConfig,
  normalizeConfirmConfig,
} from "../utils"

// 主要的 Alert Dialog hook
export const useAlertDialog = (): UseAlertDialogReturn => {
  const context = useAlertDialogContext()
  return context
}

// 内部使用的 Alert Dialog provider hook
export const useAlertDialogProvider = () => {
  const [state, dispatch] = useReducer(alertDialogReducer, initialState)

  const handleAction = useCallback((action: Parameters<typeof alertDialogReducer>[1]) => {
    dispatch(action)
  }, [])

  const confirm = useCallback(
    (config: string | AlertDialogConfirmConfig): Promise<boolean> => {
      return new Promise((resolve) => {
        const normalizedConfig = normalizeConfirmConfig(config)
        handleAction({
          type: "SHOW",
          payload: {
            dialogType: "confirm",
            config: normalizedConfig,
            resolve: resolve as (value: AlertDialogResult) => void,
          },
        })
      })
    },
    [handleAction],
  )

  const alert = useCallback(
    (config: string | AlertDialogAlertConfig): Promise<void> => {
      return new Promise((resolve) => {
        const normalizedConfig = normalizeAlertConfig(config)
        handleAction({
          type: "SHOW",
          payload: {
            dialogType: "alert",
            config: normalizedConfig,
            resolve: resolve as (value: AlertDialogResult) => void,
          },
        })
      })
    },
    [handleAction],
  )

  const show = useCallback(
    (config: AlertDialogCustomConfig): Promise<string> => {
      return new Promise((resolve) => {
        handleAction({
          type: "SHOW",
          payload: {
            dialogType: "custom",
            config,
            resolve: resolve as (value: AlertDialogResult) => void,
          },
        })
      })
    },
    [handleAction],
  )

  const closeAll = useCallback(() => {
    handleAction({ type: "CLEAR_QUEUE" })
  }, [handleAction])

  return {
    state,
    confirm,
    alert,
    show,
    closeAll,
    _handleAction: handleAction,
  }
}
