import type { Translation } from "../i18n-types"

const us = {
  common: {
    save: "Save",
    cancel: "Cancel",
    loading: "Loading...",
    search: "Search...",
  },
  menus: {
    searchEmpty: "No results found, please try another keyword",
    searchEmptyButton: "Clear",
  },
  numberInput: {
    addVariable: "Add variable",
    detachVariable: "Detach variable",
  },
  chip: {
    chip: "Chip",
    remove: "Remove chip: {chip}",
  },
  comments: {
    emoji: "Add emoji",
    mention: "Add mention",
    attachment: "Upload up to 5 images",
    submit: "Submit",
    removeImage: "Remove image",
    addComment: "Add a comment",
    actions: "Comment actions",
    edit: "Edit...",
    delete: "Delete comment",
    reactions: "Add reaction",
    loadMoreComments: "Load more comments",
  },
  picturePreview: {
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    zoomReset: "Reset zoom",
    fitToScreen: "Fit to screen",
    zoomTo50: "Zoom to 50%",
    zoomTo100: "Zoom to 100%",
    zoomTo200: "Zoom to 200%",
    error: "Image loading failed, please try again.",
  },
} satisfies Translation

export default us
