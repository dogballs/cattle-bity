import { InputControl } from '../InputControl';
import { InputContext } from '../InputContext';

export const LevelSelectionInputContext: InputContext = {
  Next: [InputControl.Right],
  Prev: [InputControl.Left],
  FastNext: [InputControl.Up],
  FastPrev: [InputControl.Down],
  Select: [InputControl.Select, InputControl.PrimaryAction],
};
