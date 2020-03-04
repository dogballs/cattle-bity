import { Vector } from './Vector';

export class Size {
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

  public setWidth(width: number): this {
    this.width = width;

    return this;
  }

  public setHeight(height: number): this {
    this.height = height;

    return this;
  }

  public copyFrom(size: Size): this {
    this.width = size.width;
    this.height = size.height;

    return this;
  }

  public flip(): this {
    const tmp = this.width;
    this.width = this.height;
    this.height = tmp;

    return this;
  }

  public clone(): Size {
    return new Size(this.width, this.height);
  }

  public toVector(): Vector {
    return new Vector(this.width, this.height);
  }
}
