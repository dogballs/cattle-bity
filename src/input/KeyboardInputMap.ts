import { KeyboardKey, InputMap } from '../core';

import { InputControl } from './InputControl';

export const KeyboardInputMap: InputMap = {
  [InputControl.Start]: KeyboardKey.Enter,
  [InputControl.Select]: KeyboardKey.RShift,
  [InputControl.Up]: KeyboardKey.ArrowUp,
  [InputControl.Down]: KeyboardKey.ArrowDown,
  [InputControl.Left]: KeyboardKey.ArrowLeft,
  [InputControl.Right]: KeyboardKey.ArrowRight,
  [InputControl.A]: KeyboardKey.Z,
  [InputControl.B]: KeyboardKey.A,
  [InputControl.TurboA]: KeyboardKey.X,
  [InputControl.TurboB]: KeyboardKey.S,
};
