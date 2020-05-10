import { GamepadButtonCode, InputBinding } from '../../core';

import { InputControl } from '../InputControl';

export class SecondaryGamepadInputBinding extends InputBinding {
  constructor() {
    super();

    this.setDefault(InputControl.Up, GamepadButtonCode.Up);
    this.setDefault(InputControl.Down, GamepadButtonCode.Down);
    this.setDefault(InputControl.Left, GamepadButtonCode.Left);
    this.setDefault(InputControl.Right, GamepadButtonCode.Right);
    this.setDefault(InputControl.Select, GamepadButtonCode.Start);
    this.setDefault(InputControl.PrimaryAction, GamepadButtonCode.X);
    this.setDefault(InputControl.SecondaryAction, GamepadButtonCode.Y);
    this.setDefault(InputControl.Rewind, GamepadButtonCode.A);
    this.setDefault(InputControl.FastForward, GamepadButtonCode.B);
  }
}
