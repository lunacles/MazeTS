import { MazeInterface } from './maze.js'
import {
  RandomInterface
} from './random/random.js'
import global from './../global.js'
import Visualizer from './visualizer.js'

type Pair = [number, number]
type Coordinate = {
  x: number,
  y: number,
}
type Movement = Array<number> | number

interface WalkerSetup {
  x: number
  y: number
  maze: MazeInterface
  ran: RandomInterface
}

interface WalkerChances {
  straightChance: number
  turnChance: number
  branchChance: number
}

interface WalkerInstructions {
  startDirections: Movement
  branchDirections: Movement
}

interface WalkerLimits {
  maxLength: number
  maxTurns: number
  maxBranches: number
}

interface WalkerSettings {
  borderWrapping: boolean
  terminateOnContact: boolean
}

interface WalkerConfig {
  setup: WalkerSetup
  chances: WalkerChances
  instructions: WalkerInstructions
  settings: WalkerSettings
  limits: WalkerLimits
}

export interface WalkerInterface {
  setup: WalkerSetup
  chances: WalkerChances
  instructions: WalkerInstructions
  settings: WalkerSettings
  limits: WalkerLimits
  x: number
  y: number
  maze: MazeInterface
  ran: number
  walk: (type: number) => Promise<void>,
}

export const Walker = class WalkerInterface {
  public setup: WalkerSetup
  public chances: WalkerChances
  public instructions: WalkerInstructions
  public settings: WalkerSettings
  public limits: WalkerLimits

  public x: number
  public y: number
  private maze: MazeInterface
  private ran: RandomInterface

  private straightChance: number
  private turnChance: number
  private branchChance: number

  private startDirections: Movement
  private branchDirections: Movement

  private borderWrapping: boolean
  private terminateOnContact: boolean
  private maxLength: number
  private maxTurns: number
  private maxBranches: number

  private length: number
  private turns: number
  private branches: number
  constructor({ setup, chances, instructions, settings, limits }: WalkerConfig) {
    this.setup = setup
    this.chances = chances
    this.instructions = instructions
    this.settings = settings

    this.x = setup.x
    this.y = setup.y
    this.maze = setup.maze
    this.ran = setup.ran

    this.straightChance = chances.straightChance
    this.turnChance = chances.turnChance
    this.branchChance = chances.branchChance

    this.startDirections = instructions.startDirections
    this.branchDirections = instructions.branchDirections

    this.borderWrapping = settings.borderWrapping
    this.terminateOnContact = settings.terminateOnContact
    this.maxLength = limits.maxLength
    this.maxTurns = limits.maxTurns
    this.maxBranches = limits.maxBranches

    this.length = 0
    this.turns = 0
    this.branches = 0
  }
  public directionToPair(direction: number): Pair {
    let x = 0
    let y = 0

    if (direction & global.direction.left)
      x -= 1
    if (direction & global.direction.right)
      x += 1
    if (direction & global.direction.up)
      y -= 1
    if (direction & global.direction.down)
      y += 1

    return [x, y]
  }
  private validateCell(x?: number, y?: number): boolean {
    if (this.terminateOnContact && this.maze.get(x ?? this.x, y ?? this.y) === +!this.maze.inverse % 2) return false
    if (!this.maze.has(x ?? this.x, y ?? this.y)) return false
    return true
  }
  private wrap(x?: number, y?: number): Coordinate {
    let ix = x ?? this.x
    let iy = y ?? this.y
    let wx = ix === 0 ? this.maze.width - 2 : ix === this.maze.width - 1 ? 1 : ix
    let wy = iy === 0 ? this.maze.height - 2 : iy === this.maze.height - 1 ? 1 : iy

    if (x || y) {
      return { x: wx, y: wy, }
    } else {
      this.x = wx
      this.y = wy
    }
  }
  public async walk(type: number): Promise<void> {
    let perpendicular = ([x, y]: Pair): Array<Pair> => [[y, -x], [-y, x]]
    //let traveledCells: Array<Coordinate> = [{ x: this.x, y: this.y }]

    // get our starting direction
    let direction: number = Array.isArray(this.startDirections) ? this.ran.fromArray(this.startDirections) : this.startDirections
    // convert the direction to a pair
    let dir: Pair = this.directionToPair(direction)
    // choose a perpendicular direction for either our turn or branch to use
    let perpendicularDirection: Pair = this.ran.fromArray(perpendicular(dir))

    // limited for loop to prevent stack overflow
    for (let i = 0; i < 1e3; i++) {
      let [x, y] = dir

      // run straight chance
      if (this.ran.float() <= this.straightChance && this.length <= this.maxLength) {
        this.length++
        this.x += x
        this.y += y

      // run turn chance if previous fails
      } else if (this.ran.float() <= this.turnChance && this.turns <= this.maxTurns) {
        this.turns++
        this.length++
        let [xx, yy] = perpendicularDirection
        this.x += xx
        this.y += yy

      // run branch chance if previous fails
      } else if (this.ran.float() <= this.branchChance && this.branches <= this.maxBranches) {
        this.branches++
        let [dx, dy] = perpendicularDirection
        // wrap the branch if we allow it
        if (this.borderWrapping && !this.maze.has(this.x + dx, this.y + dy)) {
          let wrap = this.wrap(this.x + dx, this.y + dy)
          dx = wrap.x
          dy = wrap.y

        // terminate if we don't allow wrapping & branch cell is not valid
        } else if (!this.validateCell(this.x + dx, this.y + dy)) {
          break
        } else {
          dx += this.x
          dy += this.y
        }
        // create a new walker for the branch
        let branch = new Walker({
          setup: {
            x: dx,
            y: dy,
            maze: this.maze,
            ran: this.ran,
          },
          chances: this.chances,
          instructions: {
            startDirections: direction,
            branchDirections: this.branchDirections,
          },
          settings: this.settings,
          limits: {
            maxLength: this.maxLength - this.length,
            maxTurns: this.maxTurns - this.turns,
            maxBranches: this.maxBranches - this.branches
          }
        })
        await branch.walk(type)
      // terminate if all chances fail
      } else {
        break
      }
      if (this.borderWrapping)
        this.wrap()
      if (this.validateCell()) {
        this.maze.set(this.x, this.y, type)
        this.maze.mergeWalls()
        await Visualizer.sleep()
      } else {
        break
      }
    }
    await Visualizer.sleep()
  }
}
