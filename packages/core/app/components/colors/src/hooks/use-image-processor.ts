import { useState } from "react"
import { useEventCallback } from "usehooks-ts"
import type { ImageSizes } from "../types"

/**
 * 图片处理钩子，用于处理上传的图片并生成多个不同尺寸的版本
 * @returns 图片处理相关函数和状态
 */
export const useImageProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedUrls, setProcessedUrls] = useState<ImageSizes | null>(null)

  /**
   * 测量图片尺寸
   * @param imageUrl 图片URL或Data URL
   * @returns Promise，解析为包含width和height的对象
   */
  const measureImageSize = useEventCallback(
    (imageUrl: string): Promise<{ height: number; width: number }> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height,
          })
        }
        img.onerror = () => {
          reject(new Error("Failed to load image for measuring size"))
        }
        img.src = imageUrl
      })
    },
  )

  /**
   * 基于最大边长缩放图片
   * @param imageUrl 原始图片URL或Data URL
   * @param maxDimension 最大边长
   * @returns 处理后的图片Data URL
   */
  const resizeImage = useEventCallback(
    async (imageUrl: string, maxDimension: number): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = () => {
          const { width, height } = img
          const isLandscape = width > height

          // 计算缩放比例
          let newWidth, newHeight
          if (isLandscape) {
            // 宽度是长边
            if (width <= maxDimension) {
              // 原始尺寸就小于目标尺寸，不需要缩放
              resolve(imageUrl)
              return
            }
            newWidth = maxDimension
            newHeight = Math.round((height * maxDimension) / width)
          } else {
            // 高度是长边
            if (height <= maxDimension) {
              // 原始尺寸就小于目标尺寸，不需要缩放
              resolve(imageUrl)
              return
            }
            newHeight = maxDimension
            newWidth = Math.round((width * maxDimension) / height)
          }

          // 使用canvas缩放图片
          const canvas = document.createElement("canvas")
          canvas.width = newWidth
          canvas.height = newHeight

          const ctx = canvas.getContext("2d")
          if (!ctx) {
            reject(new Error("Failed to create Canvas context"))
            return
          }

          // 绘制缩放后的图片
          ctx.drawImage(img, 0, 0, newWidth, newHeight)

          // 转换为Data URL (JPEG格式，90%质量)
          const quality = maxDimension <= 64 ? 0.8 : 0.9 // 缩略图使用较低质量
          const dataUrl = canvas.toDataURL("image/jpeg", quality)
          resolve(dataUrl)
        }

        img.onerror = () => {
          reject(new Error("Image loading failed"))
        }

        img.src = imageUrl
      })
    },
  )

  /**
   * 将文件读取为Data URL
   * @param file 图片文件
   * @returns 图片Data URL
   */
  const readFileAsDataURL = useEventCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string)
        } else {
          reject(new Error("File reading failed"))
        }
      }

      reader.onerror = () => {
        reject(new Error("File reading error"))
      }

      reader.readAsDataURL(file)
    })
  })

  /**
   * 处理图片文件并生成多个不同尺寸的版本
   * @param file 图片文件
   * @returns 包含不同尺寸图片链接的对象
   */
  const processImage = useEventCallback(async (file: File): Promise<ImageSizes> => {
    setIsProcessing(true)

    try {
      // 读取原始图片
      const rawImageUrl = await readFileAsDataURL(file)

      // 测量原始图片尺寸
      const sourceSize = await measureImageSize(rawImageUrl)

      // 生成不同尺寸的图片
      const [thumbUrl, smallUrl, regularUrl] = await Promise.all([
        resizeImage(rawImageUrl, 64), // 缩略图 (64px)
        resizeImage(rawImageUrl, 512), // 小图 (512px)
        resizeImage(rawImageUrl, 3840), // 常规图 (3840px)
      ])

      const urls: ImageSizes = {
        thumb: thumbUrl,
        small: smallUrl,
        regular: regularUrl,
        raw: rawImageUrl,
        sourceSize, // 添加原始尺寸信息
      }

      setProcessedUrls(urls)
      return urls
    } catch (error) {
      console.error("Image processing failed:", error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  })

  return {
    processImage,
    isProcessing,
    processedUrls,
  }
}
