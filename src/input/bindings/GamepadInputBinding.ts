import { GamepadButtonCode, InputBinding } from '../../core';

import { InputControl } from '../InputControl';

export const GamepadInputBinding: InputBinding = {
  [InputControl.Up]: GamepadButtonCode.Up,
  [InputControl.Down]: GamepadButtonCode.Down,
  [InputControl.Left]: GamepadButtonCode.Left,
  [InputControl.Right]: GamepadButtonCode.Right,
  [InputControl.Select]: GamepadButtonCode.Start,
  [InputControl.PrimaryAction]: GamepadButtonCode.X,
};
