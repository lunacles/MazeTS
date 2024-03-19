import global from './../global.js'

interface VisualizerInterface {
  setSpeed: (ms: number) => void
  sleep: (ms?: number) => Promise<object>
}

const Visualizer: VisualizerInterface = {
  setSpeed(ms: number): void {
    global.visualizerSpeed = ms
  },
  sleep(ms?: number): Promise<object> {
    return new Promise(r => setTimeout(r, ms ?? global.visualizerSpeed))
  }
}

export default Visualizer
