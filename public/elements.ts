import Global from './global.js'
import Color from './color.js'
import { c, canvas } from './canvas.js'

type CacheType = 'bar' | 'text' | null
type Radii = Array<number> | number
type ClipType = 'circle' | 'rect'
type Pair = [number, number]

interface Cached {
  type: CacheType,
  run: Function,
}
interface Gradient {
  color: any
  pos: number
}
interface LinearGradient {
  x1: number
  y1: number
  x2: number
  y2: number
  gradient: Array<Gradient>
}
interface RadialGradient {
  x1: number
  y1: number
  r1: number
  x2: number
  y2: number
  r2: number
  gradient: Array<Gradient>
}

export const Element = class {
  public canvas: object
  public ctx: CanvasRenderingContext2D
  public cache: Cached
  constructor() {
    this.canvas = canvas
    Global.canvas = this.canvas
    this.ctx = c.ctx
    Global.ctx = this.ctx
    this.ctx.globalAlpha = 1
    this.cache = {
      type: null,
      run: () => {},
    }

    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
  }
  private resetCache(): void {
    this.cache = {
      type: null,
      run: () => {},
    }
  }
  public setCache({ type = null, run = () => {} }: Cached): void {
    this.cache = {
      type, run,
    }
  }
  public alpha(alpha: number): this {
    if (alpha != null) {
      this.ctx.globalAlpha = alpha
    }

    return this
  }
  public fill(fill: any, alphaReset: boolean = true): this {
    if (fill instanceof Color)
      fill = fill.hex

    if (fill != null) {
      this.ctx.fillStyle = fill as string

      if (this.cache.type) {
        this.cache.run({ fill })
      } else {
        this.ctx.fill()
      }
    }
    if (alphaReset)
      this.ctx.globalAlpha = 1

    this.resetCache()
    return this
  }
  public stroke(stroke: any, lineWidth: number, alphaReset: boolean = true): this {
    if (stroke instanceof Color)
      stroke = stroke.hex

    if (stroke != null) {
      this.ctx.lineWidth = lineWidth
      this.ctx.strokeStyle = stroke as string
      if (this.cache.type) {
        this.cache.run({ stroke, lineWidth })
      } else {
        this.ctx.stroke()
      }
    }
    if (alphaReset)
      this.ctx.globalAlpha = 1

    this.resetCache()
    return this
  }
  public both(fill: any, stroke: any, lineWidth: number): this {
    if (fill instanceof Color)
      fill = fill.hex
    if (stroke instanceof Color)
      stroke = stroke.hex

    if (this.cache.type) {
      this.cache.run({ fill, stroke, lineWidth })
    } else {
      this.stroke(stroke, lineWidth, false)
      this.fill(fill, false)
    }
    this.ctx.globalAlpha = 1

    this.resetCache()
    return this
  }
  public lineCap(cap: CanvasLineCap = 'round'): this {
    this.ctx.lineCap = cap
    return this
  }
  public lineJoin(cap: CanvasLineJoin = 'round'): this {
    this.ctx.lineJoin = cap
    return this
  }
  public fillLinearGradient({ x1 = 0, y1 = 0, x2 = 0, y2 = 0, gradient = [] }: LinearGradient): this {
    if (gradient.length > 0) {
      let fill: CanvasGradient = this.ctx.createLinearGradient(x1, y1, x2, y2)
      for (let stop of gradient) {
        if (stop.pos < 0 || stop.pos > 1) throw new Error('Invalid colorstop position.')
        if (stop.color instanceof Color)
          stop.color = stop.color.hex

        fill.addColorStop(stop.pos, stop.color as string)
      }

      this.ctx.fillStyle = fill
      this.ctx.fill()
    }

    return this
  }
  public fillRadialGradient({ x1 = 0, y1 = 0, r1 = 0, x2 = 0, y2 = 0, r2 = 0, gradient = [] }: RadialGradient): this {
    if (gradient.length > 0) {
      let fill: CanvasGradient = this.ctx.createRadialGradient(x1, y1, r1, x2, y2, r2)
      for (let stop of gradient) {
        if (stop.pos < 0 || stop.pos > 1) throw new Error('Invalid colorstop position.')
        if (stop.color instanceof Color)
          stop.color = stop.color.hex

        fill.addColorStop(stop.pos, stop.color as string)
      }

      this.ctx.fillStyle = fill
      this.ctx.fill()
    }

    return this
  }
  public strokeLinearGradient({ x1 = 0, y1 = 0, x2 = 0, y2 = 0, gradient = [] }: LinearGradient, lineWidth: number): this {
    if (gradient.length > 0) {
      let stroke: CanvasGradient = this.ctx.createLinearGradient(x1, y1, x2, y2)
      for (let stop of gradient) {
        if (stop.pos < 0 || stop.pos > 1) throw new Error('Invalid colorstop position.')
        if (stop.color instanceof Color)
          stop.color = stop.color.hex

        stroke.addColorStop(stop.pos, stop.color as string)
      }

      this.ctx.lineWidth = lineWidth
      this.ctx.strokeStyle = stroke
      this.ctx.stroke()
    }

    return this
  }
  public strokeRadialGradient({ x1 = 0, y1 = 0, r1 = 0, x2 = 0, y2 = 0, r2 = 0, gradient = [] }: RadialGradient, lineWidth: number): this {
    if (gradient.length > 0) {
      let stroke: CanvasGradient = this.ctx.createRadialGradient(x1, y1, r1, x2, y2, r2)
      for (let stop of gradient) {
        if (stop.pos < 0 || stop.pos > 1) throw new Error('Invalid colorstop position.')
        if (stop.color instanceof Color)
          stop.color = stop.color.hex

        stroke.addColorStop(stop.pos, stop.color as string)
      }

      this.ctx.lineWidth = lineWidth
      this.ctx.strokeStyle = stroke
      this.ctx.stroke()
    }

    return this
  }
  public measureText(text: string, size: number): TextMetrics {
    this.ctx.font = Global.fontFromSize(size)
    return this.ctx.measureText(text)
  }
}

interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

export const Rect = class extends Element {
  public static draw({ x = 0, y = 0, width = 0, height = 0 }: Rectangle) {
    return new Rect(x, y, width, height)
  }
  private x: number
  private y: number
  private width: number
  private height: number
  constructor(x: number, y: number, width: number, height: number) {
    super()

    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.draw()
  }
  private draw(): void {
    this.ctx.beginPath()
    this.ctx.rect(this.x, this.y, this.width, this.height)
  }
}

interface RoundRectangle {
  x: number
  y: number
  width: number
  height: number
  radii: Radii
}

export const RoundRect = class extends Element {
  public static draw({ x = 0, y = 0, width = 0, height = 0, radii = 0 }: RoundRectangle) {
    return new RoundRect(x, y, width, height, radii)
  }
  private x: number
  private y: number
  private width: number
  private height: number
  private radii: Radii
  constructor(x: number, y: number, width: number, height: number, radii: Radii) {
    super()

    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.radii = radii

    this.draw()
  }
  private draw(): void {
    this.ctx.beginPath()
    this.ctx.roundRect(this.x, this.y, this.width, this.height, this.radii)
  }
}

interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
}

export const Line = class extends Element {
  public static draw({ x1 = 0, y1 = 0, x2 = 0, y2 = 0 }: Line) {
    return new Line(x1, y1, x2, y2)
  }
  private x1: number
  private y1: number
  private x2: number
  private y2: number
  constructor(x1: number, y1: number, x2: number, y2: number) {
    super()

    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2

    this.draw()
  }
  private draw(): void {
    this.ctx.beginPath()
    this.ctx.moveTo(this.x1, this.y1)
    this.ctx.lineTo(this.x2, this.y2)
  }
}

interface Curve {
  x: number
  y: number
  radius: number
  startAngle?: number
  endAngle?: number
}

export const Arc = class extends Element {
  public static draw({ x = 0, y = 0, radius = 1, startAngle = 0, endAngle = 0 }: Curve) {
    return new Arc(x, y, radius, startAngle, endAngle)
  }
  private x: number
  private y: number
  private radius: number
  private startAngle: number
  private endAngle: number
  constructor(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    super()

    this.x = x
    this.y = y
    this.radius = radius
    this.startAngle = startAngle
    this.endAngle = endAngle

    this.draw()
  }
  private draw(): void {
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle)
  }
}

export const Circle = class extends Element {
  static draw({ x = 0, y = 0, radius = 1 }: Curve) {
    return new Circle(x, y, radius)
  }
  private x: number
  private y: number
  private radius: number
  constructor(x: number, y: number, radius: number) {
    super()

    this.x = x
    this.y = y
    this.radius = radius

    this.draw()
  }
  private draw(): void {
    this.ctx.beginPath()
    this.ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2)
  }
}

interface Text {
  x: number
  y: number
  size: number
  text: string
  align: CanvasTextAlign
  style: string
  family: string
}

export const Text = class extends Element {
  public static draw({ x = 0, y = 0, size = 0, text = '', align = 'center' as CanvasTextAlign, style = global.font.style, family = global.font.family }: Text) {
    return new Text(x, y, size, text, align, style, family)
  }
  private x: number
  private y: number
  private size: number
  private text: string
  private align: CanvasTextAlign
  private style: string
  private family: string
  constructor(x: number, y: number, size: number, text: string, align: CanvasTextAlign, style: string, family: string) {
    super()

    this.x = x
    this.y = y
    this.size = size
    this.text = text
    this.align = align
    this.style = style
    this.family = family

    this.draw()
  }
  private draw(): void {
    this.ctx.font = `${this.style} ${this.size}px ${this.family}`
    Global.fontConfig.size = this.size
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
    this.ctx.textAlign = this.align
    this.ctx.beginPath()
    this.setCache({
      type: 'text',
      run: ({ fill = null, stroke = null, lineWidth = null, }) => {
        if (stroke != null) {
          this.ctx.strokeStyle = stroke
          this.ctx.lineWidth = lineWidth
          this.ctx.strokeText(this.text, this.x, this.y)
        }
        if (fill != null) {
          this.ctx.fillStyle = fill
          this.ctx.fillText(this.text, this.x, this.y)
        }
      }
    })
  }
}

export const Bar = class extends Element {
  public static draw({ x = 0, y = 0, width = 0, height = 0 }: Rectangle) {
    return new Bar(x, y, width, height)
  }
  private x: number
  private y: number
  private width: number
  private height: number
  constructor(x: number, y: number, width: number, height: number) {
    super()

    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.draw()
  }
  private draw(): void {
    this.ctx.beginPath()
    this.setCache({
      type: 'bar',
      run: ({ fill, stroke, lineWidth }) => {
        this.ctx.lineCap = 'round'
        Line.draw({
          x1: this.x + this.height * 0.5, y1: this.y + this.height * 0.5,
          x2: this.x + this.width - this.height * 0.5, y2: this.y + this.height * 0.5
        }).stroke(stroke, this.height + lineWidth)
        Line.draw({
          x1: this.x + this.height * 0.5, y1: this.y + this.height * 0.5,
          x2: this.x + this.width - this.height * 0.5, y2: this.y + this.height * 0.5
        }).stroke(fill, this.height)
      }
    })
  }
}

export const Clip = class extends Element {
  public static rect({ x = 0, y = 0, width = 0, height = 0 }: Rectangle) {
    return new Clip('rect', { x, y, width, height })
  }
  public static circle({ x = 0, y = 0, radius = 0 }: Curve) {
    return new Clip('circle', { x, y, radius })
  }
  public static end() {
    let clip = Clip.instances.pop()
    clip.ctx.restore()
  }
  public static instances: Array<any>

  private type: ClipType
  private x: number
  private y: number
  private width: number
  private height: number
  private radius: number
  constructor(type: ClipType, { x = 0, y = 0, width = 0, height = 0, radius = 0 }) {
    super()
    Clip.instances.push(this)

    this.type = type

    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.radius = radius

    this.ctx.save()
    this.ctx.beginPath()
    this.clip()
    this.ctx.clip()
  }
  private clip(): void {
    if (this.type === 'circle') {
      this.ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2)
    } else {
      this.ctx.rect(this.x, this.y, this.width, this.height)
    }
  }
}

interface Poly {
  x: number
  y: number
  width: number
  height: number
  path: Array<Pair>
}

export const Poly = class extends Element {
  static draw({ x = 0, y = 0, width = 0, height = 0, path = [] }: Poly) {
    return new Poly(x, y, width, height, path)
  }

  private x: number
  private y: number
  private width: number
  private height: number
  private path: Array<Pair>
  private normalizedPath: Array<Pair>
  constructor(x: number, y: number, width: number, height: number, path: Array<Pair>) {
    super()

    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.path = path

    this.normalizedPath = this.normalize()

    this.draw()
  }
  private normalize(): Array<Pair> {
    let minX = Math.min(...this.path.map(p => p[0]))
    let maxX = Math.max(...this.path.map(p => p[0]))
    let minY = Math.min(...this.path.map(p => p[1]))
    let maxY = Math.max(...this.path.map(p => p[1]))

    return this.path.map(([x, y]): Pair => [
      (x - minX) / (maxX - minX),
      (y - minY) / (maxY - minY)
    ]) as Pair[]
  }
  private draw(): void {
    this.ctx.beginPath()
    let first: boolean = true
    for (let [nx, ny] of this.normalizedPath) {
      let x: number = this.x + nx * this.width
      let y: number = this.y + ny * this.height

      if (first) {
        this.ctx.moveTo(x, y)
        first = false
      } else {
        this.ctx.lineTo(x, y)
      }
    }
  }
}
