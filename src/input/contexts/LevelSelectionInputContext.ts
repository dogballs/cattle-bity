import { InputControl } from '../InputControl';
import { InputContext } from '../InputContext';

export const LevelSelectionInputContext: InputContext = {
  Next: [InputControl.Down],
  Prev: [InputControl.Up],
  FastNext: [InputControl.Right],
  FastPrev: [InputControl.Left],
  Select: [InputControl.PrimaryAction, InputControl.Select],
};
