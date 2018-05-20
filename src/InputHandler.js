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

    this.handleWindowKeyDown = this.handleWindowKeyDown.bind(this);
  }

  addListener(eventName, listenerToAdd) {
    // If there is no any listeners yet, make sure to start listening to
    // window events as soon as we add first listener
    if (!this.hasListeners()) {
      this.attachWindowListener();
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
      this.detachWindowListener();
    }
  }

  hasListeners() {
    return Object.keys(this.listeners).length > 0;
  }

  attachWindowListener() {
    window.addEventListener('keydown', this.handleWindowKeyDown);
  }

  detachWindowListener() {
    window.removeEventListener('keydown', this.handleWindowKeyDown);
  }

  handleWindowKeyDown(ev) {
    const pressedKeyCode = ev.keyCode;

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
    listeners.forEach(listener => listener(ev));
  }
}

export default InputHandler;
