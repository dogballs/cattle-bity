import { InputControl } from '../InputControl';
import { InputContext } from '../InputContext';

export const MenuInputContext: InputContext = {
  VerticalPrev: [InputControl.Up],
  VerticalNext: [InputControl.Down],
  HorizontalNext: [InputControl.Right],
  HorizontalPrev: [InputControl.Left],
  Skip: [InputControl.PrimaryAction, InputControl.Select],
  Select: [InputControl.PrimaryAction, InputControl.Select],
};
