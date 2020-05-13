import { TankColor } from './TankColor';

const COLORS = [TankColor.Primary, TankColor.Secondary];

export class TankColorFactory {
  public static createPlayerColor(playerIndex: number): TankColor {
    return COLORS[playerIndex];
  }
}
