namespace Log {
  const startTime: number = Date.now()
  const time = (): string => {
    return `[${new Date().toISOString()}] [${((Date.now() - startTime) * 0.001).toFixed(3)}]`
  }
  export const error = (reason: string, err: Error): void => {
    console.error(time(), 'ERROR:', reason, err)
  }
  export const warn = (reason: string): void => {
    console.warn(time(), 'WARN:', ...reason)
  }
  export const info = (info: string): void => {
    console.info(time(), 'INFO:', info)
  }
}

export default Log
