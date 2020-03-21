import { InputButtonCodePresenter } from '../InputButtonCodePresenter';

export class GamepadButtonCodePresenter implements InputButtonCodePresenter {
  public asString(code: number): string {
    switch (code) {
      case 0:
        return 'A';
      case 1:
        return 'B';
      case 2:
        return 'X';
      case 3:
        return 'Y';
      case 4:
        return 'LB';
      case 5:
        return 'RB';
      case 6:
        return 'LT';
      case 7:
        return 'RT';
      case 8:
        return 'SELECT/BACK';
      case 9:
        return 'START';
      case 10:
        return 'LEFT AXIS';
      case 11:
        return 'RIGHT AXIS';
      case 12:
        return 'D-UP';
      case 13:
        return 'D-DOWN';
      case 14:
        return 'D-LEFT';
      case 15:
        return 'D-RIGHT';
    }

    return `GP[${code}]`;
  }
}
