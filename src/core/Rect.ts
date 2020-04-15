import { Vector } from './Vector';

export class Rect {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public setWidth(width: number): this {
    this.width = width;

    return this;
  }

  public setHeight(height: number): this {
    this.height = height;

    return this;
  }

  public getCenter(): Vector {
    return new Vector(this.x + this.width / 2, this.y + this.height / 2);
  }

  public intersectsRect(other: Rect): boolean {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  public clone(): Rect {
    return new Rect(this.x, this.y, this.width, this.height);
  }

  public toString(): string {
    return `[x: ${this.x}, y: ${this.y}, width: ${this.width}, height: ${this.height}]`;
  }
}
