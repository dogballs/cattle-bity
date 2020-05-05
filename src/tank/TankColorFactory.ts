import { TankColor } from './TankColor';

export class TankColorFactory {
  public static createPlayerColor(playerIndex: number): TankColor {
    if (playerIndex === 0) {
      return TankColor.Primary;
    }
    if (playerIndex === 1) {
      return TankColor.Secondary;
    }
    return null;
  }
}
