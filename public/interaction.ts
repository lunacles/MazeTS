import Document from './document.js'

interface Mouse {
  x: number
  y: number
  left: boolean
  right: boolean
  middle: boolean
  leftHeld: boolean
  rightHeld: boolean
  middleHeld: boolean
  drag: {
    x: number
    y: number
  }
  touchStartY: number
  currentTouchY: number
  scroll: number
  targetScroll: number
  moving: boolean
}

interface Keyboard {
  altKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  keyCode: number | null
  key: string | null
}

type SettingsMap = Map<string, Map<string, any>>
type EventMap = Map<string, object>

const Interaction = class {
  static editEvent(e: string) {
    return new Interaction(e)
  }
  public static mouse: Mouse = {
    x: 0,
    y: 0,
    left: false,
    right: false,
    middle: false,
    leftHeld: false,
    rightHeld: false,
    middleHeld: false,
    drag: {
      x: 0,
      y: 0,
    },
    touchStartY: 0,
    currentTouchY: 0,
    scroll: 0,
    targetScroll: 0,
    moving: false,
  }
  public static keyboard: Keyboard = {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    keyCode: null,
    key: null,
  }
  public static settings: SettingsMap = new Map([
    ['mouse', new Map<string, any>([
      ['preventDefault', true],
      ['dispatchAfterRelease', true],
      ['scrollSpeed', 15],
    ])],
  ])
  static events: EventMap = new Map([
    ['mousedown', {
      assigned: null,
      default: (e: MouseEvent): void => {
        let dispatchAfterRelease: boolean = Interaction.settings.get('mouse').get('dispatchAfterRelease')
        if (e.buttons & 1) {
          Interaction.mouse.left = !dispatchAfterRelease
          Interaction.mouse.leftHeld = true
        }
        if (e.buttons & 2) {
          Interaction.mouse.right = !dispatchAfterRelease
          Interaction.mouse.rightHeld = true
        }
        if (e.buttons & 4) {
          Interaction.mouse.middle = !dispatchAfterRelease
          Interaction.mouse.middleHeld = true
        }
      },
      mouseDrag: (e: MouseEvent): void => {
        if (!Interaction.mouse.drag) return
        let x: number = (e.offsetX - Document.width / 2) / Math.min(Document.width, Document.height)
        let y: number = (e.offsetY - Document.height / 2) / Math.min(Document.width, Document.height)

        Interaction.mouse.drag.x = x
        Interaction.mouse.drag.y = y
      },
    }],
    ['mouseup', {
      assigned: null,
      default: (e: MouseEvent): void => {
        let dispatchAfterRelease: boolean = Interaction.settings.get('mouse').get('dispatchAfterRelease')
        if (Interaction.mouse.leftHeld) {
          Interaction.mouse.left = dispatchAfterRelease
          Interaction.mouse.leftHeld = false
        }
        if (Interaction.mouse.rightHeld) {
          Interaction.mouse.right = dispatchAfterRelease
          Interaction.mouse.rightHeld = false
        }
        if (Interaction.mouse.middleHeld) {
          Interaction.mouse.middle = dispatchAfterRelease
          Interaction.mouse.middleHeld = false
        }
      },
    }],
    ['wheel', {
      assigned: null,
      default: (e: WheelEvent): void => {
        if (Interaction.settings.get('mouse').get('preventDefault'))
          e.preventDefault()

        Interaction.mouse.targetScroll -= Math.sign(e.deltaY) * Interaction.settings.get('mouse').get('scrollSpeed')
      },
    }],
    ['mousemove', {
      assigned: null,
      default: (e: MouseEvent): void => {
        Interaction.mouse.x = e.clientX
        Interaction.mouse.y = e.clientY
      },
      mouseDrag: e => {
        Interaction.mouse.drag = {
          x: (e.offsetX - Document.width / 2) / Math.min(Document.width, Document.height),
          y: (e.offsetY - Document.height / 2) / Math.min(Document.width, Document.height),
        }
      }
    }],
    ['contextmenu', {
      assigned: null,
      default: (e: MouseEvent): void => {
        if (Interaction.settings.get('mouse').get('preventDefault'))
          e.preventDefault()
      }
    }],
    ['click', {
      assigned: null,
      default: (e: MouseEvent): void => {}
    }],
    ['dbclick', {
      assigned: null,
      default: (e: MouseEvent): void => {}
    }],
    ['mouseenter', {
      assigned: null,
      default: (e: MouseEvent): void => {}
    }],
    ['mouseleave', {
      assigned: null,
      default: (e: MouseEvent): void => {}
    }],
    ['mouseout', {
      assigned: null,
      default: (e: MouseEvent): void => {}
    }],
    ['mouseover', {
      assigned: null,
      default: (e: MouseEvent): void => {}
    }],
    // mobile event listeners
    ['touchstart', {
      assigned: null,
      default: (e: TouchEvent): void => {
        if (Interaction.settings.get('mouse').get('preventDefault'))
          e.preventDefault()

        Interaction.mouse.left = !Interaction.settings.get('mouse').get('dispatchAfterRelease')
        Interaction.mouse.leftHeld = true
        Interaction.mouse.x = e.touches[0].clientX
        Interaction.mouse.y = e.touches[0].clientY
        Interaction.mouse.touchStartY = e.touches[0].clientY
      }
    }],
    ['touchcancel', {
      assigned: null,
      default: (e: TouchEvent): void => {
        Interaction.mouse.left = Interaction.settings.get('mouse').get('dispatchAfterRelease')
        Interaction.mouse.leftHeld = false
      }
    }],
    ['touchend', {
      assigned: null,
      default: (e: TouchEvent): void => {
        Interaction.mouse.left = Interaction.settings.get('mouse').get('dispatchAfterRelease')
        Interaction.mouse.leftHeld = false
      }
    }],
    ['touchmove', {
      assigned: null,
      default: (e: TouchEvent): void => {
        Interaction.mouse.moving = true
        Interaction.mouse.currentTouchY = e.touches[0].clientY
        Interaction.mouse.x = e.touches[0].clientX
        Interaction.mouse.y = e.touches[0].clientY
        let deltaY: number = Interaction.mouse.touchStartY - Interaction.mouse.currentTouchY
        Interaction.mouse.targetScroll -= deltaY
        Interaction.mouse.touchStartY = Interaction.mouse.currentTouchY
      }
    }],
    // keyboard event listeners
    ['keydown', {
      assigned: null,
      useWindow: true,
      default: (e: KeyboardEvent): void => {
        Interaction.keyboard.altKey = e.altKey
        Interaction.keyboard.ctrlKey = e.ctrlKey
        Interaction.keyboard.shiftKey = e.shiftKey
        Interaction.keyboard.keyCode = e.keyCode
        Interaction.keyboard.key = e.key
      }
    }],
    // misc.
    ['beforeunload', {
      assigned: null,
      useWindow: true,
      default: (): void => {}
    }],
  ])
  static reset(): void {
    Interaction.keyboard = {
      altKey: false,
      ctrlKey: false,
      shiftKey: false,
      keyCode: null,
      key: null,
    }
    Interaction.mouse.left = false
    Interaction.mouse.right = false
    Interaction.mouse.middle = false
    Interaction.mouse.moving = false
  }
  private event: string
  private element: any
  constructor(event: string) {
    this.event = event
    this.element = Interaction.events.get(this.event)
    if (!this.element) throw new Error(`Unable to find event ${this.event}`)
  }

  getEvent(task: string): any {
    if (!this.element[task]) throw new Error(`Unable to assign task ${task} to ${this.event}`)
    return this.element[task]
  }

  bind(task: string, event?: EventListenerOrEventListenerObject): void {
    if (this.element.assigned)
      (this.element.useWindow ? window : document).removeEventListener(this.event, this.element.assigned)

    let e = task === 'custom' && typeof event === 'function' ? event : this.getEvent(task)
    ;(this.element.useWindow ? window : document).addEventListener(this.event, e)
    this.element.assigned = e
    Interaction.events.set(this.event, this.element)
  }
}

export default Interaction
