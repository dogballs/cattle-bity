import { InputBinding, KeyboardButtonCode } from '../../core';

import { InputControl } from '../InputControl';

export const KeyboardInputBinding: InputBinding = {
  [InputControl.Up]: KeyboardButtonCode.Up,
  [InputControl.Down]: KeyboardButtonCode.Down,
  [InputControl.Left]: KeyboardButtonCode.Left,
  [InputControl.Right]: KeyboardButtonCode.Right,
  [InputControl.Select]: KeyboardButtonCode.Enter,
  [InputControl.PrimaryAction]: KeyboardButtonCode.Z,
};
