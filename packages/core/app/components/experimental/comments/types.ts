import { extend } from "dayjs"
import { Descendant } from "slate"

export interface User {
  id: string
  name: string
  photo_url: string | null
  email: string | null
  color: string | null
}

export interface Reaction {
  uuid: string
  created_at: Date
  deleted_at: Date | null
  emoji: string
  user: User
}

export interface SubmittedCommentData {
  uuid: string
  author: User
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  resolved_at: Date | null
  is_deleted: boolean
  message: string
  message_meta: Descendant[]
  reactions: Reaction[] | null
  order_id: string | null
  page_id: string | null
}

export interface InputDefaultText {
  SAVE: string
  CANCEL: string
  SUBMIT: string
  ADD_MENTION: string
  ADD_EMOJI: string
  UPLOAD_ATTACHMENT: string
  REMOVE_IMAGE: string
}

export interface ItemDefaultText {
  ACTIONS: string
  EDIT: string
  DELETE: string
  ADD_REACTIONS: string
}

export interface DefaultText extends InputDefaultText, ItemDefaultText {
  LOAD_MORE: string
  LOADING: string
}
