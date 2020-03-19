import { InputControl } from '../InputControl';
import { InputContext } from '../InputContext';

export const MenuInputContext: InputContext = {
  Up: [InputControl.Up],
  Down: [InputControl.Down],
  Skip: [InputControl.PrimaryAction, InputControl.Select],
  Select: [InputControl.PrimaryAction, InputControl.Select],
};
