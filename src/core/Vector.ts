export class Vector {
  public x: number;
  public y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  public set(x: number, y: number): this {
    this.x = x;
    this.y = y;

    return this;
  }

  public setX(x: number): this {
    this.x = x;

    return this;
  }

  public setY(y: number): this {
    this.y = y;

    return this;
  }

  public add(v: Vector): this {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  public addX(x: number): this {
    this.x += x;

    return this;
  }

  public addY(y: number): this {
    this.y += y;

    return this;
  }

  public addScalar(s: number): this {
    this.x += s;
    this.y += s;

    return this;
  }

  public sub(v: Vector): this {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  public subX(x: number): this {
    this.x -= x;

    return this;
  }

  public subY(y: number): this {
    this.y -= y;

    return this;
  }

  public divideScalar(s: number): this {
    this.x /= s;
    this.y /= s;

    return this;
  }

  public mult(v: Vector): this {
    this.x *= v.x;
    this.y *= v.y;

    return this;
  }

  public multScalar(s: number): this {
    this.x *= s;
    this.y *= s;

    return this;
  }

  public round(): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    return this;
  }

  public length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  public normalize(): this {
    const length = this.length() || 1; // In case length is zero

    this.divideScalar(length);

    return this;
  }

  public distanceTo(v: Vector): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;

    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    return distance;
  }

  public negate(): this {
    this.x = -this.x;
    this.y = -this.y;

    return this;
  }

  public copyFrom(v: Vector): this {
    this.x = v.x;
    this.y = v.y;

    return this;
  }

  public snapX(step = 1): this {
    this.x = Math.round(this.x / step) * step;

    return this;
  }

  public snapY(step = 1): this {
    this.y = Math.round(this.y / step) * step;

    return this;
  }

  public dot(v: Vector): number {
    return this.x * v.x + this.y * v.y;
  }

  public cross(v: Vector): number {
    return this.x * v.y - this.y * v.x;
  }

  public equals(v: Vector): boolean {
    return this.x === v.x && this.y === v.y;
  }

  public clone(): Vector {
    return new Vector(this.x, this.y);
  }

  public static fromArray(array: number[]): Vector {
    return new Vector(array[0], array[1]);
  }
}
