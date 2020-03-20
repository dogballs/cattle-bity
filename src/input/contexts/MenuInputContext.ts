import { InputControl } from '../InputControl';
import { InputContext } from '../InputContext';

export const MenuInputContext: InputContext = {
  VerticalPrev: [InputControl.Up],
  VerticalNext: [InputControl.Down],
  HorizontalNext: [InputControl.Left],
  HorizontalPrev: [InputControl.Right],
  Skip: [InputControl.PrimaryAction, InputControl.Select],
  Select: [InputControl.PrimaryAction, InputControl.Select],
};
