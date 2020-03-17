import { Rotation } from './Rotation';

export class RotationMap<T> {
  private map: Map<Rotation, T> = new Map();

  public set(rotation: Rotation, value: T): void {
    this.map.set(this.round(rotation), value);
  }

  public get(rotation: Rotation): T {
    return this.map.get(this.round(rotation));
  }

  // Tries to round rotation value to one of possible map values, because
  // calculations might introduce some error.
  private round(rotation: number): number {
    return Math.round(rotation) % 360;
  }
}
