import {
  MazeInterface,
} from '../src/maze.js'
import MazeWall from './maze-wall.js'
import Color from '../color.js'
import Colors from '../colors.js'
import {
  Rect
} from '../elements.js'

interface Map {
  maze: MazeInterface
}

interface MapDimensions {
  x: number,
  y: number,
  width: number,
  height: number,
}

const Map = class {
  private maze: MazeInterface
  constructor(maze: MazeInterface) {
    this.maze = maze
  }
  public draw({ x, y, width, height }: MapDimensions): void {
    let border = 5
    Rect.draw({
      x, y,
      width, height
    }).alpha(0.5).fill(Colors.white)
    Rect.draw({
      x, y,
      width, height
    }).stroke(Colors.black, border)

    let wallWidth = (width - border * 0.5) / this.maze.width
    let wallHeight = (height - border * 0.5) / this.maze.height

    for (let wall of this.maze.walls) {
      MazeWall.draw({
        x: x + wall.x * wallWidth, y: y + wall.y * wallHeight,
        width: wall.width * wallWidth, height: wall.height * wallHeight
      }).both(Colors.wall, Color.blend(Colors.wall, Colors.black, 0.2), 1)
    }
  }
}

export default Map
