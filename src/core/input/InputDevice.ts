export interface InputDevice {
  listen(): void;
  unlisten(): void;
  update(): void;
  getDownCodes(): number[];
  getHoldCodes(): number[];
  getUpCodes(): number[];
}
