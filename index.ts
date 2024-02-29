import Document from './public/document.js'

import {
  Rect,
  RoundRect,
  Circle,
  Bar,
} from './public/elements.js'

import Colors from './public/colors.js'

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

  Document.refreshCanvas(timeElapsed)

  requestAnimationFrame(appLoop)
}
requestAnimationFrame(appLoop)
