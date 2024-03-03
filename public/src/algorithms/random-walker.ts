import {
  MazeInterface,
  Direction
} from '../maze.js'
import {
  RandomInterface,
} from '../random/random.js'

type Pair = [number, number]
type Coordinate = {
  x: number,
  y: number,
}

interface Config {
  seedAmount: number
  turnChance: number
  straightChance: number
}

export interface RandomWalkerInterface {
  maze: MazeInterface
  seedAmount: number
  turnChance: number
  straightChance: number
  ran: RandomInterface
  init: () => void
}

export const RandomWalker = class RandomWalkerInterface {
  public maze: MazeInterface
  public seedAmount: number
  public turnChance: number
  public straightChance: number

  public ran: RandomInterface
  private seeds: Array<Coordinate>
  constructor({ seedAmount = 1, turnChance, straightChance }: Config) {
    this.maze = null
    this.ran = null
    this.seedAmount = seedAmount
    this.turnChance = turnChance
    this.straightChance = straightChance

    this.seeds = []
  }
  public init(): void {
    this.place()
    this.walk()
  }
  private validateCell(position: Coordinate): boolean {
    //if (this.map.get(position.x, position.y) === (this.type + 0) % 2) return false
    if (!this.maze.has(position.x, position.y)) return false
    return true
  }
  private place(): void {
    let amount = 0
    for (let i = 0; i < 1e3; i++) {
      let loc: Coordinate = {
        x: this.ran.integer(this.maze.width) - 1,
        y: this.ran.integer(this.maze.height) - 1,
      }

      if (this.validateCell(loc)) {
        this.seeds.push(loc)
        this.maze.set(loc.x, loc.y, +!this.maze.inverse)
        amount++
        if (amount >= this.seedAmount) break
      }
    }
  }
  private walk(): void {
    let perpendicular = ([x, y]: Pair): Array<Pair> => [[y, -x], [-y, x]]
    for (let seed of this.seeds) {
      let dir = this.maze.randomDirection([
        Direction.Left,
        Direction.Right,
        Direction.Up,
        Direction.Down,
      ])
      for (let i = 0; i < 1e3; i++) {
        let [x, y] = dir
        if (this.ran.float() <= this.straightChance) {
          seed.x += x
          seed.y += y
        } else if (this.ran.float() <= this.turnChance) {
          let [xx, yy] = this.ran.fromArray(perpendicular(dir))
          seed.x += xx
          seed.y += yy
        } else {
          break
        }
        if (this.validateCell(seed)) {
          this.maze.set(seed.x, seed.y, +!this.maze.inverse)
        } else {
          break
        }
      }
    }
  }
}
