import { InputBinding, KeyboardButtonCode } from '../../core';

import { InputControl } from '../InputControl';

// Suggested for multi-player mode, second player, right side of the keyboard,
// because secondary tank spawns on the right side of base
export class TertiaryKeyboardInputBinding extends InputBinding {
  constructor() {
    super();

    this.setDefault(InputControl.Up, KeyboardButtonCode.Up);
    this.setDefault(InputControl.Down, KeyboardButtonCode.Down);
    this.setDefault(InputControl.Left, KeyboardButtonCode.Left);
    this.setDefault(InputControl.Right, KeyboardButtonCode.Right);
    this.setDefault(InputControl.Select, KeyboardButtonCode.Enter);
    this.setDefault(InputControl.PrimaryAction, KeyboardButtonCode.K);
    this.setDefault(InputControl.SecondaryAction, KeyboardButtonCode.L);
    this.setDefault(InputControl.Rewind, KeyboardButtonCode.I);
    this.setDefault(InputControl.FastForward, KeyboardButtonCode.O);
  }
}
