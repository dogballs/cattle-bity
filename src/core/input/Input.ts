import { InputBinding } from './InputBinding';
import { InputDevice } from './InputDevice';
import { NullInputDevice } from './devices';

export class Input {
  private binding: InputBinding = {};
  private device: InputDevice = new NullInputDevice();

  public setDevice(device: InputDevice): this {
    this.device = device;

    return this;
  }

  public setBinding(binding: InputBinding): this {
    this.binding = binding;

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

  public isHoldFirst(control: number): boolean {
    const targetCode = this.unmap(control);
    const codes = this.device.getHoldCodes();
    const isHoldFirst = codes[0] === targetCode;

    return isHoldFirst;
  }

  public isHoldFirstAny(controls: number[]): boolean {
    const targetCodes = this.unmapList(controls);
    const codes = this.device.getHoldCodes();
    const firstCode = codes[0];
    const isHoldFirstAny = targetCodes.includes(firstCode);

    return isHoldFirstAny;
  }

  public isHoldLast(control: number): boolean {
    const targetCode = this.unmap(control);
    const codes = this.device.getHoldCodes();
    const isHoldLast = codes[codes.length - 1] === targetCode;

    return isHoldLast;
  }

  public isHoldLastAny(controls: number[]): boolean {
    const targetCodes = this.unmapList(controls);
    const codes = this.device.getHoldCodes();
    const lastCode = codes[codes.length - 1];
    const isHoldLastAny = targetCodes.includes(lastCode);

    return isHoldLastAny;
  }

  public isUp(control: number): boolean {
    const codes = this.device.getUpCodes();
    const isUp = codes.includes(this.unmap(control));

    return isUp;
  }

  public isUpAny(controls: number[]): boolean {
    const targetCodes = this.unmapList(controls);
    const upCodes = this.device.getUpCodes();
    const isUpAny = upCodes.some((code) => targetCodes.includes(code));

    return isUpAny;
  }

  private unmap(control: number): number {
    return this.binding[control];
  }

  private unmapList(controls: number[]): number[] {
    return controls.map((control) => this.unmap(control));
  }
}
