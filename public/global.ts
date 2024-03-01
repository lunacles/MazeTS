interface FontConfig {
  family: string,
  style: string,
  size: number,
}

interface Global {
  canvas: object | undefined
  ctx: CanvasRenderingContext2D | undefined
  debug: boolean
  mobile: boolean
  fontConfig: FontConfig
  font: string
  fontFromSize: Function
}

const global: Global = {
  canvas: null,
  ctx: null,
  debug: true,
  mobile: 'ontouchstart' in document.body && /android|mobi/i.test(navigator.userAgent),
  fontConfig: {
    family: 'Ubuntu',
    style: 'bold',
    size: 16,
  },
  font: '',
  fontFromSize: (size: number): string => `${global.fontConfig.style} ${size}px ${global.fontConfig.family}`,
}
global.font = global.fontFromSize(global.fontConfig.size)

export default global
