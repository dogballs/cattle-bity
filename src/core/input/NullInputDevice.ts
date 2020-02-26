import { InputDevice } from './InputDevice';

export class NullInputDevice implements InputDevice {
  public update(): void {
    // Do nothing
  }

  public getDownCodes(): number[] {
    return [];
  }

  public getHoldCodes(): number[] {
    return [];
  }

  public getUpCodes(): number[] {
    return [];
  }
}
