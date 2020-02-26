export interface InputDevice {
  update(): void;
  getDownCodes(): number[];
  getHoldCodes(): number[];
  getUpCodes(): number[];
}
