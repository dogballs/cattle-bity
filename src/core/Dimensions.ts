import { Vector } from './Vector';

export class Dimensions {
  public width: number;
  public height: number;

  constructor(width = 0, height = 0) {
    this.width = width;
    this.height = height;
  }

  public set(width: number, height: number): this {
    this.width = width;
    this.height = height;

    return this;
  }

  public toVector(): Vector {
    return new Vector(this.width, this.height);
  }
}
