export interface InputDevice {
  isConnected(): boolean;
  listen(): void;
  unlisten(): void;
  update(): void;
  getDownCodes(): number[];
  getHoldCodes(): number[];
  getUpCodes(): number[];
}
