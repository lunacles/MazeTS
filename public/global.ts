interface FontConfig {
  family: string,
  style: string,
  size: number,
}

namespace Global {
  export let canvas: object
  export let ctx: CanvasRenderingContext2D
  export const debug = true
  export const mobile = 'ontouchstart' in document.body && /android|mobi/i.test(navigator.userAgent)
  export const fontConfig: FontConfig = {
    family: 'Ubuntu',
    style: 'bold',
    size: 16,
  }
  export const font = `${fontConfig.style} ${fontConfig.size}px ${fontConfig.family}`
  export const fontFromSize = (size: number): string => `${fontConfig.style} ${size}px ${fontConfig.family}`
}

export default Global
