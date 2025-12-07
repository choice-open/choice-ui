import { Descendant } from "slate"

export interface User {
  color: string | null
  email: string | null
  id: string
  name: string
  photo_url: string | null
}

export interface Reaction {
  created_at: Date
  deleted_at: Date | null
  emoji: string
  user: User
  uuid: string
}

export interface SubmittedCommentData {
  author: User
  created_at: Date
  deleted_at: Date | null
  is_deleted: boolean
  message: string
  message_meta: Descendant[]
  order_id: string | null
  page_id: string | null
  reactions: Reaction[] | null
  resolved_at: Date | null
  updated_at: Date
  uuid: string
}

export interface InputDefaultText {
  ADD_EMOJI: string
  ADD_MENTION: string
  CANCEL: string
  REMOVE_IMAGE: string
  SAVE: string
  SUBMIT: string
  UPLOAD_ATTACHMENT: string
}

export interface ItemDefaultText {
  ACTIONS: string
  ADD_REACTIONS: string
  DELETE: string
  EDIT: string
}

export interface DefaultText extends InputDefaultText, ItemDefaultText {
  LOADING: string
  LOAD_MORE: string
}
