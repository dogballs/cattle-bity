import { Vector } from './Vector';

export class Vector3 {
  public x: number;
  public y: number;
  public z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public toVector2(): Vector {
    return new Vector(this.x, this.y);
  }

  public static fromVector2(v: Vector, z = 1): Vector3 {
    return new Vector3(v.x, v.y, z);
  }
}
