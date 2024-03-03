import {
  Random,
  RandomInterface,
} from './random/random.js'
import {
  PRNG,
} from './random/prng.js'
import {
  RandomWalkerInterface,
} from './algorithms/random-walker.js'

export type Seed = string | number
type Pair = [number, number]

export enum Direction {
  None = 0,  // 0000
  Left = 1,  // 0001
  Right = 2, // 0010
  Up = 4,    // 0100
  Down = 8,  // 1000
}

type Algorithm = RandomWalkerInterface

export interface Wall {
  x: number
  y: number
  width: number
  height: number
}

interface MazeConfig {
  width: number
  height: number
  //mazeSeed: Seed
  prng: Function
  inverse?: boolean
}

export interface MazeInterface {
  width: number
  height: number
  mazeSeed: Seed
  inverse: boolean
  array: Array<any>
  seed: number
  walls: Array<Wall>
  alreadyPlaced: Array<any>
  ran: RandomInterface

  get: (x: number, y: number) => any
  set: (x: number, y: number, value: any) => any
  entries: () => Array<any>
  has: (x: number, y: number) => boolean
  findPockets: () => void
  combineWalls: () => void
  mergeWalls: () => void
  randomDirection: (directions: Array<Direction>) => Pair
}

export const Maze = class MazeInterface {
  public width: number
  public height: number
  public mazeSeed: Seed
  public inverse: boolean
  public array: Array<any>
  public seed: number
  public walls: Array<Wall>
  public alreadyPlaced: Array<any>
  public ran: RandomInterface
  constructor({ width = 0, height = 0, /*mazeSeed = '',*/ prng = PRNG.MathRandom, inverse = false }: MazeConfig) {
    this.width = width
    this.height = height
    this.array = Array(width * height).fill(+inverse)
    for (let [x, y, _] of this.entries().filter(([x, y, r]) => !this.has(x, y)))
      this.set(x, y, 0)

      /*
    this.seed = 0
    if (mazeSeed === '') {
      this.seed = Math.floor(Math.random() * 2147483646)
    } else if (/^\d+$/.test(mazeSeed.toString())) {
      this.seed = parseInt(mazeSeed.toString())
    } else {
      this.seed = Hash.cyrb53(mazeSeed.toString())
    }
    */
    this.ran = new Random(prng)

    this.walls = []
    this.alreadyPlaced = []
  }
  public get(x: number, y: number): any {
    return this.array[y * this.width + x]
  }
  public set(x: number, y: number, value: any): any {
    this.array[y * this.width + x] = value
  }
  public entries(): Array<any> {
    return this.array.map((value, i) => [i % this.width, Math.floor(i / this.width), value])
  }
  public has(x: number, y: number): boolean {
    return x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1
  }
  public findPockets(): void {
    let queue: Array<Pair> = [[0, 0]]
    this.set(0, 0, 2)

    let checkedIndices = new Set([0])
    for (let i = 0; i < 5000 && queue.length > 0; i++) {
      let [x, y] = queue.shift()
      for (let [nx, ny] of [
        [x - 1, y], // left
        [x + 1, y], // right
        [x, y - 1], // top
        [x, y + 1], // bottom
      ]) {
        if (nx < 0 || nx > this.width - 1 || ny < 0 || ny > this.height - 1) continue
        if (this.get(nx, ny) !== 0) continue
        let i = ny * this.width + nx
        if (checkedIndices.has(i)) continue
        checkedIndices.add(i)
        queue.push([nx, ny])
        this.set(nx, ny, 2)
      }
    }

    for (let [x, y, r] of this.entries()) {
      if (r === 0)
        this.set(x, y, 1)
    }
  }
  // placeWalls() {
  //   // For debug purposes
  //   /*for (let [x, y, r] of this.entries()) {
  //     if (r === 1) {
  //       Page.cell(x, y, 1, 1, 'wall')
  //     } else if (r === 0) {
  //       Page.cell(x, y, 1, 1, 'pocket')
  //     }
  //   }*/
  //   for (let { x, y, width, height } of this.walls)
  //     Page.cell(x, y, width, height, 'wall')
  // }
  public combineWalls(): void {
    do {
      let best: Pair
      let maxSize = 0
      for (let [x, y, r] of this.entries()) {
        if (r !== 1) continue
        let size = 1
        loop: while (this.has(x + size, y + size)) {
          for (let v = 0; v <= size; v++)
            if (this.get(x + size, y + v) !== 1 || this.get(x + v, y + size) !== 1)
              break loop

          size++
        }
        if (size > maxSize) {
          maxSize = size
          best = [x, y]
        }
      }
      if (!best) return
      for (let y = 0; y < maxSize; y++) {
        for (let x = 0; x < maxSize; x++) {
          this.set(best[0] + x, best[1] + y, 0)
        }
      }
      this.walls.push({
        x: best[0], y: best[1],
        width: maxSize, height: maxSize,
      })
    } while ([].concat(...this.entries().filter(([x, y, r]) => r)).length > 0)
  }
  public mergeWalls(): void {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.get(x, y) !== 1) continue
        let chunk: Wall = {
          x, y,
          width: 0, height: 1
        }
        while (this.get(x + chunk.width, y) === 1) {
          this.set(x + chunk.width, y, 0)
          chunk.width++

          this.walls.push(chunk)
        }
        outer: while (true) {
          for (let i = 0; i < chunk.width; i++) {
            if (this.get(x + i, y + chunk.height) !== 1) break outer
          }
          for (let i = 0; i < chunk.width; i++)
            this.set(x + i, y + chunk.height, 0)
          chunk.height++

          this.walls.push(chunk)
        }
        this.walls.push(chunk)
      }
    }
  }
  public randomDirection(directions: Array<Direction>): Pair {
    let dir: Direction = this.ran.fromArray(directions)
    let x = 0
    let y = 0

    if (dir & Direction.Left)
      x -= 1
    if (dir & Direction.Right)
      x += 1
    if (dir & Direction.Up)
      y -= 1
    if (dir & Direction.Down)
      y += 1

    return [x, y]
  }
  public runAlgorithm(algorithm: Algorithm): this {
    algorithm.maze = this
    algorithm.ran = this.ran
    algorithm.init()
    return this
  }
}
