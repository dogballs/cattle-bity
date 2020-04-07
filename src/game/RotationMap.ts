import { Rotation } from './Rotation';

export class RotationMap<T> {
  private map = new Map<Rotation, T>();

  public set(rotation: Rotation, value: T): this {
    this.map.set(this.round(rotation), value);

    return this;
  }

  public get(rotation: Rotation): T {
    return this.map.get(this.round(rotation));
  }

  public forEach(callbackFn): this {
    this.map.forEach(callbackFn);

    return this;
  }

  // Tries to round rotation value to one of possible map values, because
  // calculations might introduce some error.
  private round(rotation: number): number {
    return Math.round(rotation) % 360;
  }
}
