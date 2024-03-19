interface Direction {
  none: number
  left: number
  right: number
  up: number
  down: number
}

interface DiagonalDirection {
  upLeft: number
  downLeft: number
  upRight: number
  downRight: number
}

const Direction: Direction = {
  none: 0,  // 0000
  left: 1,  // 0001
  right: 2, // 0010
  up: 4,    // 0100
  down: 8,  // 1000
}

const DiagonalDirections: DiagonalDirection = {
  upLeft: Direction.left | Direction.up,
  downLeft: Direction.left | Direction.down,
  upRight: Direction.right | Direction.up,
  downRight: Direction.right | Direction.down
}

interface MovementOptions {
  all: Array<number> | number,
  diagonal: Array<number> | number,
  vertical: Array<number> | number,
  horizontal: Array<number> | number,
}

interface FontConfig {
  family: string,
  style: string,
  size: number,
}

interface Global {
  canvas: object | undefined
  ctx: CanvasRenderingContext2D | undefined
  debug: boolean
  mobile: boolean
  fontConfig: FontConfig
  font: string
  fontFromSize: Function
  direction: Direction
  diagonalDirection: DiagonalDirection
  movementOptions: MovementOptions
  visualizerSpeed: number
}

const global: Global = {
  canvas: null,
  ctx: null,
  debug: true,
  mobile: 'ontouchstart' in document.body && /android|mobi/i.test(navigator.userAgent),
  fontConfig: {
    family: 'Ubuntu',
    style: 'bold',
    size: 16,
  },
  font: '',
  fontFromSize: (size: number): string => `${global.fontConfig.style} ${size}px ${global.fontConfig.family}`,
  direction: Direction,
  diagonalDirection: DiagonalDirections,
  movementOptions: {
    all: [
      Direction.left, Direction.right,
      Direction.up, Direction.down,
      DiagonalDirections.upLeft, DiagonalDirections.upRight,
      DiagonalDirections.downLeft, DiagonalDirections.downRight,
    ],
    diagonal: [
      DiagonalDirections.upLeft, DiagonalDirections.upRight,
      DiagonalDirections.downLeft, DiagonalDirections.downRight,
    ],
    vertical: [
      Direction.up, Direction.down
    ],
    horizontal: [
      Direction.left, Direction.right
    ],
  },
  visualizerSpeed: 5,
}
global.font = global.fontFromSize(global.fontConfig.size)

export default global
