import { InputControl } from '../InputControl';
import { InputContext } from '../InputContext';

export const EditorMapInputContext: InputContext = {
  MoveUp: [InputControl.Up],
  MoveDown: [InputControl.Down],
  MoveLeft: [InputControl.Left],
  MoveRight: [InputControl.Right],
  Draw: [InputControl.PrimaryAction],
  Erase: [InputControl.SecondaryAction],
  NextBrush: [InputControl.FastForward],
  PrevBrush: [InputControl.Rewind],
  Menu: [InputControl.Select],
};
