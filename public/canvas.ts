import Global from './global.js'

interface Size {
  width: number,
  height: number,
  scale: number,
}
interface Viewport {
  x: number,
  y: number,
  width: number,
  height: number,
}

const Canvas = class {
  public canvas: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D

  public width: number
  public height: number
  public scale: number
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.ctx.lineJoin = 'round'

    this.width = 1920
    this.height = 1080
    this.scale = 1
  }
  public setSize({ width = 1, height = 1, scale = 1 }: Size): number {
    if (this.width !== width || this.height !== height || this.scale !== scale) {
      this.width = width
      this.height = height
      this.scale = scale

      let cWidth: number = Math.ceil(width * scale)
      let cHeight: number = Math.ceil(height * scale)
      this.canvas.width = cWidth
      this.canvas.height = cHeight
      this.canvas.style.width = `${cWidth / scale}px`
      this.canvas.style.height = `${cHeight / scale}px`

      this.ctx.lineJoin = 'round'
    }
    return width / height
  }
  public setViewport({ x = 0, y = 0, width = 0, height = 0 }: Viewport): void {
    let sx: number = this.width * this.scale / width
    let sy: number = this.height * this.scale / height
    this.ctx.setTransform(sx, 0, 0, sy, -x * sx, -y * sy)
  }
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement
export const c = new Canvas(canvas)

Global.canvas = c
Global.ctx = c.ctx
