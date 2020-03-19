import { InputControl } from '../InputControl';
import { InputContext } from '../InputContext';

export const LevelInputContext: InputContext = {
  MoveUp: [InputControl.Up],
  MoveDown: [InputControl.Down],
  MoveLeft: [InputControl.Left],
  MoveRight: [InputControl.Right],
  Fire: [InputControl.PrimaryAction],
  Pause: [InputControl.Select],
};
