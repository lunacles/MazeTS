import Global from './../global.js'

interface VisualizerInterface {
  setSpeed: (ms: number) => void
  sleep: (ms?: number) => Promise<object>
}

const Visualizer: VisualizerInterface = {
  setSpeed(ms: number): void {
    Global.visualizerSpeed = ms
  },
  sleep(ms?: number): Promise<object> {
    return new Promise(r => setTimeout(r, ms ?? Global.visualizerSpeed))
  }
}

export default Visualizer
