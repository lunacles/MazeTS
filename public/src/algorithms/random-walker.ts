import {
  MazeInterface,
} from '../maze.js'
import {
  RandomInterface,
} from '../random/random.js'
import {
  Walker,
} from '../walker.js'

type Coordinate = {
  x: number,
  y: number,
}

export interface RandomWalkerInterface {
  maze: MazeInterface
  seedAmount: number
  type: number
  turnChance: number
  straightChance: number
  ran: RandomInterface
  init: () => void
}

export const RandomWalker = class RandomWalkerInterface {
  public maze: MazeInterface
  public seedAmount: number
  public type: number
  public turnChance: number
  public straightChance: number

  public ran: RandomInterface
  private seeds: Array<Coordinate>
  constructor(seedAmount: number = 1, inverse: boolean) {
    this.maze = null
    this.ran = null
    this.seedAmount = seedAmount
    this.turnChance = 0
    this.straightChance = 0
    this.type = +inverse

    this.seeds = []
  }
  public init(): void {
    this.place()
    //this.walk()
    for (let seed of this.seeds) {
      let walker = new Walker({
        setup: {
          x: seed.x,
          y: seed.y,
          maze: this.maze,
          ran: this.ran,
        },
        chances: this.maze.walkerChances,
        instructions: this.maze.walkerInstructions,
        settings: this.maze.walkerSettings,
        limits: this.maze.walkerLimits
      })
      for (let { x, y } of walker.walk()) {
        this.maze.set(x, y, this.type)
      }
    }
  }
  private validateCell(position: Coordinate): boolean {
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
        this.maze.set(loc.x, loc.y, this.type)
        amount++
        if (amount >= this.seedAmount) break
      }
    }
  }
}
