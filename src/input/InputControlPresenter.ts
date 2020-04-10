import { InputControl } from './InputControl';

export class InputControlPresenter {
  public static asString(control: InputControl, unknownValue = '???'): string {
    switch (control) {
      case InputControl.Up:
        return 'MOVE UP';
      case InputControl.Down:
        return 'MOVE DOWN';
      case InputControl.Left:
        return 'MOVE LEFT';
      case InputControl.Right:
        return 'MOVE RIGHT';
      case InputControl.PrimaryAction:
        return 'FIRE';
      case InputControl.SecondaryAction:
        return 'RAPID FIRE';
      case InputControl.Select:
        return 'SELECT/PAUSE';
      default:
        return unknownValue;
    }
  }
}
