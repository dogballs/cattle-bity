import { KeyboardInput, KeyboardKeyCode } from '../core';

export class MockKeyboardInput extends KeyboardInput {
  public addDown(keyCode: KeyboardKeyCode): void {
    this.downKeyCodes.push(keyCode);
  }

  public listen(): void {
    // Do nothing
  }

  public unlisten(): void {
    // Do nothing
  }

  public update(): void {
    // Do nothing
  }
}
