import { InputBinding, KeyboardButtonCode } from '../../core';

import { InputControl } from '../InputControl';

// Suggested for multi-player mode, first player, left side of the keyboard
export class SecondaryKeyboardInputBinding extends InputBinding {
  constructor() {
    super();

    this.setDefault(InputControl.Up, KeyboardButtonCode.W);
    this.setDefault(InputControl.Down, KeyboardButtonCode.S);
    this.setDefault(InputControl.Left, KeyboardButtonCode.A);
    this.setDefault(InputControl.Right, KeyboardButtonCode.D);
    this.setDefault(InputControl.Select, KeyboardButtonCode.Space);
    this.setDefault(InputControl.PrimaryAction, KeyboardButtonCode.F);
    this.setDefault(InputControl.SecondaryAction, KeyboardButtonCode.G);
    this.setDefault(InputControl.Rewind, KeyboardButtonCode.R);
    this.setDefault(InputControl.FastForward, KeyboardButtonCode.T);
  }
}
