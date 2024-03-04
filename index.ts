import Document from './public/document.js'

import { Maze } from './public/src/maze.js'
import {
  RandomWalker
} from './public/src/algorithms/random-walker.js'
import { PRNG } from './public/src/random/prng.js'
import { Hash } from './public/src/random/hash.js'

import Map from './public/components/map.js'

const maze = new Maze({
  width: 32,
  height: 32,
  prng: PRNG.MathRandom//PRNG.simple(Hash.cyrb53('lolxd'))
}).runAlgorithm(new RandomWalker({
  seedAmount: 75,
  turnChance: 0.2,
  straightChance: 0.6,
})).findPockets().mergeWalls()
console.log(maze.array)
const map = new Map(maze)

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
