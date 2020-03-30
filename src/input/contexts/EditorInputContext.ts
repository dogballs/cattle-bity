import { InputControl } from '../InputControl';
import { InputContext } from '../InputContext';

export const EditorInputContext: InputContext = {
  MoveUp: [InputControl.Up],
  MoveDown: [InputControl.Down],
  MoveLeft: [InputControl.Left],
  MoveRight: [InputControl.Right],
  Draw: [InputControl.PrimaryAction],
};
