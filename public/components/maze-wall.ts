import {
  Element,
  Rect
} from '../elements.js'

interface Wall {
  x: number
  y: number
  width: number
  height: number
}

const MazeWall = class extends Element {
  public static draw({ x = 0, y = 0, width = 0, height = 0 }: Wall) {
    return new MazeWall(x, y, width, height)
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
    this.setCache({
      type: 'rect',
      run: ({ fill = null, stroke = null, lineWidth = null, }) => {
        Rect.draw({
          x: this.x, y: this.y,
          width: this.width, height: this.height
        }).fill(stroke)

        let innerX = this.x + lineWidth * 0.5
        let innerY = this.y + lineWidth * 0.5
        let innerWidth = this.width - lineWidth
        let innerHeight = this.height - lineWidth

        Rect.draw({
          x: innerX, y: innerY,
          width: innerWidth, height: innerHeight
        }).fill(fill)
      }
    })
  }
}

export default MazeWall
