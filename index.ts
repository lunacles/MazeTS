import Document from './public/document.js'

import { Maze } from './public/src/maze.js'
//import {
//  RandomWalker
//} from './public/src/algorithms/random-walker.js'
import {
  Noise
} from './public/src/algorithms/noise.js'
import { PRNG } from './public/src/random/prng.js'
import { Hash } from './public/src/random/hash.js'

//import global from './public/global.js'

import Map from './public/components/map.js'

const maze = new Maze(32, 32, PRNG.simple(Hash.cyrb53('maze')), false)
const map = new Map(maze)
maze.runAlgorithm(
  new Noise('clamped')
    .setZoom(4)
    .setIterations(2)
/*
  new RandomWalker(75, true)
    .setWalkerChances(0.6, 0.2, 0)
    .setWalkerInstructions([
      ...global.movementOptions.horizontal as Array<number>,
      ...global.movementOptions.vertical as Array<number>,
    ])
    .setWalkerSettings(true, false)
    .setWalkerLimits(Infinity, Infinity, 20)
*/
)

let time = 0
let tick = 0
let appLoop = async (newTime) => {
  let timeElapsed = newTime - time
  time = newTime
  tick++

  let mapSize = Document.height * 0.75
  map.draw({
    x: Document.centerX - mapSize * 0.5, y: Document.centerY - mapSize * 0.5,
    width: mapSize, height: mapSize
  })

  Document.refreshCanvas(timeElapsed)

  requestAnimationFrame(appLoop)
}
requestAnimationFrame(appLoop)
