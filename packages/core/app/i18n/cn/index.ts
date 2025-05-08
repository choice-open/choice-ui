import type { BaseTranslation } from "../i18n-types"

const cn = {
  common: {
    save: "保存",
    cancel: "取消",
    loading: "加载中...",
    search: "搜索...",
  },
  menus: {
    searchEmpty: "搜索结果为空，请尝试其他关键词",
    searchEmptyButton: "清空",
  },
  numberInput: {
    addVariable: "添加变量",
    detachVariable: "移除变量",
  },
  chip: {
    chip: "标签",
    remove: "移除标签：{chip}",
  },
  comments: {
    emoji: "添加表情",
    mention: "添加提及",
    attachment: "上传最多5张图片",
    submit: "提交",
    removeImage: "移除图片",
    addComment: "添加评论",
    actions: "评论操作",
    edit: "编辑...",
    delete: "删除评论",
    reactions: "添加表情",
    loadMoreComments: "加载更多评论",
  },
  picturePreview: {
    zoomIn: "放大",
    zoomOut: "缩小",
    zoomReset: "重置",
    fitToScreen: "适应屏幕",
    zoomTo50: "放大到50%",
    zoomTo100: "放大到100%",
    zoomTo200: "放大到200%",
    error: "图片加载失败，请稍后再试。",
  },
} satisfies BaseTranslation

export default cn
