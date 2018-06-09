class KeyboardInput {
  constructor() {
    this.pressedKeyCodes = [];

    this.handleWindowKeyDown = this.handleWindowKeyDown.bind(this);
    this.handleWindowKeyUp = this.handleWindowKeyUp.bind(this);
  }

  listen() {
    document.addEventListener('keydown', this.handleWindowKeyDown);
    document.addEventListener('keyup', this.handleWindowKeyUp);
  }

  unlisten() {
    document.removeEventListener('keydown', this.handleWindowKeyDown);
    document.removeEventListener('keyup', this.handleWindowKeyUp);
  }

  isPressed(keyCode) {
    return this.pressedKeyCodes.includes(keyCode);
  }

  isPressedAny(keyCodes) {
    return keyCodes.some(keyCode => this.isPressed(keyCode));
  }

  isPressedLast(keyCode) {
    return this.pressedKeyCodes[this.pressedKeyCodes.length - 1] === keyCode;
  }

  handleWindowKeyDown(ev) {
    const { keyCode } = ev;

    if (!this.isPressed(keyCode)) {
      this.pressedKeyCodes.push(keyCode);
    }
  }

  handleWindowKeyUp(ev) {
    const { keyCode } = ev;

    const index = this.pressedKeyCodes.indexOf(keyCode);
    if (index > -1) {
      this.pressedKeyCodes.splice(index, 1);
    }
  }
}

KeyboardInput.KEY_ENTER = 13;
KeyboardInput.KEY_SPACE = 32;
KeyboardInput.KEY_ARROW_LEFT = 37;
KeyboardInput.KEY_ARROW_UP = 38;
KeyboardInput.KEY_ARROW_RIGHT = 39;
KeyboardInput.KEY_ARROW_DOWN = 40;
KeyboardInput.KEY_A = 65;
KeyboardInput.KEY_D = 68;
KeyboardInput.KEY_S = 83;
KeyboardInput.KEY_W = 87;

export default KeyboardInput;
