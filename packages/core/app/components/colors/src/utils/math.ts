export const PI = Math.PI
export const RAD2DEG = 180 / PI

export function wrapAngle(angle: number, benchmark = 180): number {
  // ensures that deltaAngle is 0 .. 2 PI
  while (angle < benchmark - 180) angle += 360
  while (angle > benchmark + 180) angle -= 360

  return angle
}

/**
 * 将弧度转换为角度
 * @param radians 弧度值
 * @returns 对应的角度值
 */
export function radToDeg(radians: number): number {
  return radians * RAD2DEG
}
