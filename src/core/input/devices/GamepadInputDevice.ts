import { InputDevice } from '../InputDevice';

export class GamepadInputDevice implements InputDevice {
  private deviceIndex: number;
  private isListening = false;
  private downCodes: number[] = [];
  private holdCodes: number[] = [];
  private upCodes: number[] = [];

  constructor(deviceIndex: number) {
    this.deviceIndex = deviceIndex;
  }

  public isConnected(): boolean {
    const gamepad = this.getGamepad();

    if (gamepad === null) {
      return false;
    }

    return true;
  }

  public listen(): void {
    this.isListening = true;
  }

  public unlisten(): void {
    this.isListening = false;
  }

  public update(): void {
    if (!this.isListening) {
      return;
    }

    const gamepad = this.getGamepad();
    if (gamepad === null) {
      return;
    }

    // Extract buttons that are in pressed state
    const codes = [];

    const { buttons } = gamepad;
    for (let i = 0; i < buttons.length; i += 1) {
      const button = buttons[i];
      if (button.pressed === true) {
        codes.push(i);
      }
    }

    const downCodes = [];
    const holdCodes = [];

    for (const code of codes) {
      // Newly pressed key, which was not previously down or hold
      if (!this.downCodes.includes(code) && !this.holdCodes.includes(code)) {
        downCodes.push(code);
      }

      // Button that was down on previous frame is now considered hold, because
      // it is still down on current frame.
      // Hold continues to be hold.
      if (this.downCodes.includes(code) || this.holdCodes.includes(code)) {
        holdCodes.push(code);
      }
    }

    // Find buttons that were down or hold on previous frame, which means
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

  private getGamepad(): Gamepad {
    const gamepads = navigator.getGamepads();

    // Firefox will have empty array
    if (gamepads.length === 0) {
      return null;
    }

    const gamepad = gamepads[this.deviceIndex];

    // Chrome will have filled array of 4 elements with null values
    // Value will be null after device is connected or page is reloaded,
    // until user has pressed any button.
    if (gamepad === null) {
      return null;
    }

    return gamepad;
  }
}
