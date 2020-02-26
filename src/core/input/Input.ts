import { InputMap } from './InputMap';
import { InputDevice } from './InputDevice';
import { NullInputDevice } from './NullInputDevice';

export class Input {
  private map: InputMap = {};
  private device: InputDevice = new NullInputDevice();

  public setDevice(device: InputDevice): this {
    this.device = device;

    return this;
  }

  public setMap(map: InputMap): this {
    this.map = map;

    return this;
  }

  public update(): void {
    this.device.update();
  }

  public isDown(control: number): boolean {
    const targetCode = this.unmap(control);
    const downCodes = this.device.getDownCodes();
    const isDown = downCodes.includes(targetCode);

    return isDown;
  }

  public isDownAny(controls: number[]): boolean {
    const targetCodes = this.unmapList(controls);
    const downCodes = this.device.getDownCodes();
    const isDownAny = downCodes.some((code) => targetCodes.includes(code));

    return isDownAny;
  }

  public isHold(control: number): boolean {
    const targetCode = this.unmap(control);
    const holdCodes = this.device.getHoldCodes();
    const isHold = holdCodes.includes(targetCode);

    return isHold;
  }

  public isHoldAny(controls: number[]): boolean {
    const targetCodes = this.unmapList(controls);
    const holdCodes = this.device.getHoldCodes();
    const isHoldAny = holdCodes.some((code) => targetCodes.includes(code));

    return isHoldAny;
  }

  public isNotHoldAll(controls: number[]): boolean {
    const targetCodes = this.unmapList(controls);
    const holdCodes = this.device.getHoldCodes();
    const isNotHoldAll = holdCodes.every((code) => !targetCodes.includes(code));

    return isNotHoldAll;
  }

  public isHoldLast(control: number): boolean {
    const codes = this.device.getHoldCodes();
    const isHoldLast = codes[codes.length - 1] === this.unmap(control);

    return isHoldLast;
  }

  public isUp(control: number): boolean {
    const codes = this.device.getUpCodes();
    const isUp = codes.includes(this.unmap(control));

    return isUp;
  }

  private unmap(control: number): number {
    return this.map[control];
  }

  private unmapList(controls: number[]): number[] {
    return controls.map((control) => this.unmap(control));
  }
}
