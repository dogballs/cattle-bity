const mapEventNameToKeyCodes = {
  up: [
    38, // arrow up
    87, // w
  ],
  down: [
    40, // arrow down
    83, // s
  ],
  right: [
    39, // arrow right
    68, // d
  ],
  left: [
    37, // arrow left
    65, // a
  ],
};

class InputHandler {
  constructor() {
    this.listeners = {};

    this.pressedKeyCodes = [];

    this.animationFrameId = null;

    this.handleWindowKeyDown = this.handleWindowKeyDown.bind(this);
    this.handleWindowKeyUp = this.handleWindowKeyUp.bind(this);
    this.startEventLoop = this.startEventLoop.bind(this);
  }

  addListener(eventName, listenerToAdd) {
    // If there is no any listeners yet, make sure to start listening to
    // window events as soon as we add first listener
    if (!this.hasListeners()) {
      this.attachNativeListener();
    }

    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(listenerToAdd);
  }

  removeListener(eventName, listenerToRemove) {
    const listeners = this.listeners[eventName] || [];
    const nextListeners = this.listeners[eventName] = listeners.filter(
      listener => listener !== listenerToRemove
    );

    if (nextListeners.length === 0) {
      delete this.listeners[eventName];
    } else {
      this.listeners[eventName] = nextListeners;
    }

    // Stop listening to window events when there is no listeners left
    if (!this.hasListeners()) {
      this.detachNativeListener();
    }
  }

  hasListeners() {
    return Object.keys(this.listeners).length > 0;
  }

  attachNativeListener() {
    window.addEventListener('keydown', this.handleWindowKeyDown);
    window.addEventListener('keyup', this.handleWindowKeyUp);
    // Window keydown event has a built-in delay before the key will start
    // repeating the events. To avoid that create a custom loop without any
    // delays to continuously track the pressed key.
    this.startEventLoop();
  }

  detachNativeListener() {
    window.removeEventListener('keydown', this.handleWindowKeyDown);
    window.removeEventListener('keyup', this.handleWindowKeyUp);
    this.stopEventLoop();
  }

  handleWindowKeyDown(ev) {
    const pressedKeyCode = ev.keyCode;

    if (this.pressedKeyCodes.includes(pressedKeyCode)) {
      return;
    }

    this.pressedKeyCodes.push(pressedKeyCode);
  }

  handleWindowKeyUp(ev) {
    const releasedKeyCode = ev.keyCode;

    const index = this.pressedKeyCodes.indexOf(releasedKeyCode);
    if (index > -1) {
      this.pressedKeyCodes.splice(index, 1);
    }
  }

  startEventLoop() {
    this.animationFrameId = window.requestAnimationFrame(this.startEventLoop);

    // Handle multi-press. In case several keys are pressed at the same time,
    // the last one pressed will have the priority. So when you release all
    // keys except the first one, it will still move in the direction of the
    // pressed key.
    const pressedKeyCodes = this.pressedKeyCodes;
    const lastPressedKeyCode = pressedKeyCodes[pressedKeyCodes.length - 1];
    if (lastPressedKeyCode === undefined) {
      return;
    }

    this.emit(lastPressedKeyCode);
  }

  stopEventLoop() {
    window.cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }

  emit(pressedKeyCode) {
    // Find name of the event by pressed key code
    const eventName = Object.keys(mapEventNameToKeyCodes).find((eventName) => {
      const keyCodes = mapEventNameToKeyCodes[eventName];
      const isKeyCode = keyCodes.includes(pressedKeyCode);
      return isKeyCode;
    });

    if (eventName === undefined) {
      return;
    }

    // Execute all listeners attached to event
    const listeners = this.listeners[eventName];
    listeners.forEach(listener => listener());
  }
}

export default InputHandler;
