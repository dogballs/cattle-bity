export enum KeyboardKey {
  Enter = 13,
  Space = 32,
  ArrowLeft = 37,
  ArrowUp = 38,
  ArrowRight = 39,
  ArrowDown = 40,
  A = 65,
  B = 66,
  D = 68,
  E = 69,
  S = 83,
  T = 84,
  W = 87,
}

export type KeyboardKeyCode = KeyboardKey | number;

export class KeyboardInput {
  private listenedDownKeyCodes: KeyboardKeyCode[] = [];

  private downKeyCodes: KeyboardKeyCode[] = [];
  private holdKeyCodes: KeyboardKeyCode[] = [];
  private upKeyCodes: KeyboardKeyCode[] = [];

  public listen(): void {
    document.addEventListener('keydown', this.handleWindowKeyDown);
    document.addEventListener('keyup', this.handleWindowKeyUp);
  }

  public unlisten(): void {
    document.removeEventListener('keydown', this.handleWindowKeyDown);
    document.removeEventListener('keyup', this.handleWindowKeyUp);
  }

  public update(): void {
    const keyCodes = this.listenedDownKeyCodes.slice();

    const downKeyCodes = keyCodes.filter((keyCode) => {
      return (
        !this.downKeyCodes.includes(keyCode) &&
        !this.holdKeyCodes.includes(keyCode)
      );
    });

    const holdKeyCodes = keyCodes.filter((keyCode) => {
      return (
        this.downKeyCodes.includes(keyCode) ||
        this.holdKeyCodes.includes(keyCode)
      );
    });

    const oldDownKeyCodes = this.downKeyCodes.filter((keyCode) => {
      return !keyCodes.includes(keyCode);
    });

    const oldHoldKeyCodes = this.holdKeyCodes.filter((keyCode) => {
      return !keyCodes.includes(keyCode);
    });

    this.downKeyCodes = downKeyCodes;
    this.holdKeyCodes = holdKeyCodes;
    this.upKeyCodes = [...oldDownKeyCodes, ...oldHoldKeyCodes];
  }

  public isDown(keyCode: KeyboardKeyCode): boolean {
    return this.downKeyCodes.includes(keyCode);
  }

  public isHold(keyCode: KeyboardKeyCode): boolean {
    return this.holdKeyCodes.includes(keyCode);
  }

  public isHoldAny(keyCodes: KeyboardKeyCode[]): boolean {
    return this.holdKeyCodes.some((keyCode) => keyCodes.includes(keyCode));
  }

  public isHoldLast(keyCode: KeyboardKeyCode): boolean {
    return this.holdKeyCodes[this.holdKeyCodes.length - 1] === keyCode;
  }

  public isUp(keyCode: KeyboardKeyCode): boolean {
    return this.upKeyCodes.includes(keyCode);
  }

  private handleWindowKeyDown = (ev): void => {
    const { keyCode } = ev;

    if (!this.listenedDownKeyCodes.includes(keyCode)) {
      this.listenedDownKeyCodes.push(keyCode);
    }
  };

  private handleWindowKeyUp = (ev): void => {
    const { keyCode } = ev;

    const index = this.listenedDownKeyCodes.indexOf(keyCode);
    if (index !== -1) {
      this.listenedDownKeyCodes.splice(index, 1);
    }
  };
}
