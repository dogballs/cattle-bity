class KeyboardInput {
  public static KEY_ENTER = 13;
  public static KEY_SPACE = 32;
  public static KEY_ARROW_LEFT = 37;
  public static KEY_ARROW_UP = 38;
  public static KEY_ARROW_RIGHT = 39;
  public static KEY_ARROW_DOWN = 40;
  public static KEY_A = 65;
  public static KEY_D = 68;
  public static KEY_S = 83;
  public static KEY_W = 87;

  private pressedKeyCodes: number[];

  constructor() {
    this.pressedKeyCodes = [];

    this.handleWindowKeyDown = this.handleWindowKeyDown.bind(this);
    this.handleWindowKeyUp = this.handleWindowKeyUp.bind(this);
  }

  public listen() {
    document.addEventListener('keydown', this.handleWindowKeyDown);
    document.addEventListener('keyup', this.handleWindowKeyUp);
  }

  public unlisten() {
    document.removeEventListener('keydown', this.handleWindowKeyDown);
    document.removeEventListener('keyup', this.handleWindowKeyUp);
  }

  public isPressed(keyCode) {
    return this.pressedKeyCodes.includes(keyCode);
  }

  public isPressedAny(keyCodes) {
    return keyCodes.some((keyCode) => this.isPressed(keyCode));
  }

  public isPressedLast(keyCode) {
    return this.pressedKeyCodes[this.pressedKeyCodes.length - 1] === keyCode;
  }

  private handleWindowKeyDown(ev) {
    const { keyCode } = ev;

    if (!this.isPressed(keyCode)) {
      this.pressedKeyCodes.push(keyCode);
    }
  }

  private handleWindowKeyUp(ev) {
    const { keyCode } = ev;

    const index = this.pressedKeyCodes.indexOf(keyCode);
    if (index > -1) {
      this.pressedKeyCodes.splice(index, 1);
    }
  }
}

export default KeyboardInput;
