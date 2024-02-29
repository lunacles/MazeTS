import Global from './global.js'
import Log from './log.js'

interface TextArea {
  text: string
  width: number
  height: number
}

namespace Util {
  export const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max)
  export const averageArray = (array: Array<number>): number => array.length ? array.reduce((a, b): number => a + b) / array.length : 0
  export const sumArray = (array: Array<number>): number => array.reduce((a, b): number => a + b, 0)
  export const sleep = (ms: number): Promise<object> => new Promise(r => setTimeout(r, ms))
  export const measureText = (text: string, size: number): TextMetrics => {
    Global.ctx.font = Global.fontFromSize(size)
    return Global.ctx.measureText(text)
  }
  export const fitTextToArea = ({ text = '', width = 0, height = 0 }: TextArea): number => {
    let aspectRatio: number = Util.measureText(text, 200).width / 200
    let maxSizeWidth: number = width / aspectRatio
    return Math.min(maxSizeWidth, height)
  }
  export const dateSuffix = (day: number): string => {
    let last: number = day % 10
    let lastTwo: number = day % 100
    if ([11, 12, 13].includes(lastTwo)) return 'th'
    switch (last) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }
  export const formatDate = (string: string): string => {
    let date: Date = new Date(string)
    try {
      let months: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      if (!(date instanceof Date && !isNaN(date.getDate()))) throw new Error('Invalid date')
      let day: number = date.getUTCDate()
      let name: string = months[date.getUTCMonth()]
      return `${name} ${day}${dateSuffix(day)}, ${date.getUTCFullYear()}`
    } catch (err) {
      Log.error('Failed to retrieve date', err)
    }
  }
  export const raceTimeout = async (promise: object, time: number): Promise<any> => {
    let timeout: Promise<object> = new Promise(resolve => {
      setTimeout((): void => {
        resolve(promise)
      }, time)
    })

    return Promise.race([promise, timeout])
  }
}

export default Util
