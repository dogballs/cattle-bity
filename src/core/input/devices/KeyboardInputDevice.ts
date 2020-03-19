import { InputDevice } from '../InputDevice';

export class KeyboardInputDevice implements InputDevice {
  private listenedDownCodes: number[] = [];

  private downCodes: number[] = [];
  private holdCodes: number[] = [];
  private upCodes: number[] = [];

  public listen(): void {
    document.addEventListener('keydown', this.handleWindowKeyDown);
    document.addEventListener('keyup', this.handleWindowKeyUp);
  }

  public unlisten(): void {
    document.removeEventListener('keydown', this.handleWindowKeyDown);
    document.removeEventListener('keyup', this.handleWindowKeyUp);
  }

  public update(): void {
    const codes = this.listenedDownCodes;

    const downCodes = [];
    const holdCodes = [];

    for (const code of codes) {
      // Newly pressed key, which was not previously down or hold
      if (!this.downCodes.includes(code) && !this.holdCodes.includes(code)) {
        downCodes.push(code);
      }

      // Key that was down on previous frame is now considered hold, because
      // it is still down on current frame.
      // Hold key continues to be hold.
      if (this.downCodes.includes(code) || this.holdCodes.includes(code)) {
        holdCodes.push(code);
      }
    }

    // Find keycodes that were down or hold on previous frame, which means
    // that in current frame they are considered up

    const upCodes = [];

    for (const code of this.downCodes) {
      if (!codes.includes(code)) {
        upCodes.push(code);
      }
    }

    for (const code of this.holdCodes) {
      if (!codes.includes(code)) {
        upCodes.push(code);
      }
    }

    this.downCodes = downCodes;
    this.holdCodes = holdCodes;
    this.upCodes = upCodes;
  }

  public getDownCodes(): number[] {
    return this.downCodes;
  }

  public getHoldCodes(): number[] {
    return this.holdCodes;
  }

  public getUpCodes(): number[] {
    return this.upCodes;
  }

  private handleWindowKeyDown = (ev): void => {
    const { keyCode } = ev;

    if (!this.listenedDownCodes.includes(keyCode)) {
      this.listenedDownCodes.push(keyCode);
    }
  };

  private handleWindowKeyUp = (ev): void => {
    const { keyCode } = ev;

    const index = this.listenedDownCodes.indexOf(keyCode);
    if (index !== -1) {
      this.listenedDownCodes.splice(index, 1);
    }
  };
}
