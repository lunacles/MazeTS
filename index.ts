import Document from './public/document.js'

import {
  Rect,
  RoundRect,
  Circle,
  Bar,
} from './public/elements.js'
import MazeWall from './public/components/mazewall.js'

import Colors from './public/colors.js'
import Color from './public/color.js'

import { Maze } from './public/src/maze.js'
import {
  RandomWalker
} from './public/src/algorithms/random-walker.js'
import { PRNG } from './public/src/random/prng.js'
import { Hash } from './public/src/random/hash.js'

let maze = new Maze({
  width: 32,
  height: 32,
  prng: PRNG.simple(Hash.cyrb53('lol'))
}).runAlgorithm(new RandomWalker({
  seedAmount: 75,
  turnChance: 0.2,
  straightChance: 0.6,
}))
console.log(maze.array)

let time = 0
let tick = 0
let appLoop = async (newTime) => {
  let timeElapsed = newTime - time
  time = newTime
  tick++

  let spacing = 5
  let rectSize = 100
  Rect.draw({
    x: spacing, y: spacing,
    width: rectSize, height: rectSize,
  }).alpha(0.25).fill(Colors.red)

  let circleRadius = 50
  Circle.draw({
    x: spacing * 2 + rectSize, y: spacing,
    radius: circleRadius,
  }).fill(Colors.white)

  RoundRect.draw({
    x: spacing * 3 + rectSize + circleRadius * 2, y: spacing,
    width: rectSize, height: rectSize,
    radii: 10,
  }).fill(Colors.black).stroke(Colors.white, 2.5)

  Bar.draw({
    x: spacing * 4 + rectSize * 2 + circleRadius * 2, y: spacing,
    width: rectSize * 1.5, height: rectSize,
  }).fill(Colors.white)

  MazeWall.draw({
    x: Document.centerX, y: Document.centerY,
    width: 50, height: 100,
  }).both(Colors.wall, Color.blend(Colors.wall, Colors.black, 0.2), 2)
  MazeWall.draw({
    x: Document.centerX + 50, y: Document.centerY,
    width: 50, height: 50,
  }).both(Colors.wall, Color.blend(Colors.wall, Colors.black, 0.2), 2)

  Document.refreshCanvas(timeElapsed)

  requestAnimationFrame(appLoop)
}
requestAnimationFrame(appLoop)
