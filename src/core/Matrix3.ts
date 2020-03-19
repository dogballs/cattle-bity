import { Vector } from './Vector';

import { MathUtils } from './utils';

// References:
// https://github.com/mrdoob/three.js/blob/master/src/math/Matrix3.js
// https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js

export class Matrix3 {
  public elements = [1, 0, 0, 0, 1, 0, 0, 0, 1];

  public set(
    e11: number,
    e12: number,
    e13: number,
    e21: number,
    e22: number,
    e23: number,
    e31: number,
    e32: number,
    e33: number,
  ): this {
    const e = this.elements;

    e[0] = e11;
    e[1] = e12;
    e[2] = e13;
    e[3] = e21;
    e[4] = e22;
    e[5] = e23;
    e[6] = e31;
    e[7] = e32;
    e[8] = e33;

    return this;
  }

  public applyToVector(v: Vector): Vector {
    const x = v.x;
    const y = v.y;
    const z = 1;

    const e = this.elements;

    // Using row vector convention
    v.x = x * e[0] + y * e[3] + z * e[6];
    v.y = x * e[1] + y * e[4] + z * e[7];

    return v;
  }

  public premultiply(m: Matrix3): this {
    return this.multiplyMatrices(m, this);
  }

  public multiply(m: Matrix3): this {
    return this.multiplyMatrices(this, m);
  }

  public multiplyMatrices(a: Matrix3, b: Matrix3): this {
    const ae = a.elements;

    const a11 = ae[0];
    const a12 = ae[1];
    const a13 = ae[2];
    const a21 = ae[3];
    const a22 = ae[4];
    const a23 = ae[5];
    const a31 = ae[6];
    const a32 = ae[7];
    const a33 = ae[8];

    const be = b.elements;

    const b11 = be[0];
    const b12 = be[1];
    const b13 = be[2];
    const b21 = be[3];
    const b22 = be[4];
    const b23 = be[5];
    const b31 = be[6];
    const b32 = be[7];
    const b33 = be[8];

    const e = this.elements;

    e[0] = a11 * b11 + a12 * b21 + a13 * b31;
    e[1] = a11 * b12 + a12 * b22 + a13 * b32;
    e[2] = a11 * b13 + a12 * b23 + a13 * b33;
    e[3] = a21 * b11 + a22 * b21 + a23 * b31;
    e[4] = a21 * b12 + a22 * b22 + a23 * b32;
    e[5] = a21 * b13 + a22 * b23 + a23 * b33;
    e[6] = a31 * b11 + a32 * b21 + a33 * b31;
    e[7] = a31 * b12 + a32 * b22 + a33 * b32;
    e[8] = a31 * b13 + a32 * b23 + a33 * b33;

    return this;
  }

  public multiplyScalar(s: number): this {
    const e = this.elements;

    e[0] *= s;
    e[1] *= s;
    e[2] *= s;
    e[3] *= s;
    e[4] *= s;
    e[5] *= s;
    e[6] *= s;
    e[7] *= s;
    e[8] *= s;

    return this;
  }

  public invert(): this {
    const d = this.getDeterminant();
    if (d === 0) {
      throw new Error('Determinant is 0, cant invert');
    }

    const i = this.getCofactors()
      .transpose()
      .multiplyScalar(1 / d);

    this.copyFrom(i);

    return this;
  }

  public getMinors(): Matrix3 {
    const e = this.elements;

    const e11 = e[0];
    const e12 = e[1];
    const e13 = e[2];
    const e21 = e[3];
    const e22 = e[4];
    const e23 = e[5];
    const e31 = e[6];
    const e32 = e[7];
    const e33 = e[8];

    // Minors
    const m11 = e22 * e33 - e23 * e32;
    const m12 = e21 * e33 - e23 * e31;
    const m13 = e21 * e32 - e22 * e31;
    const m21 = e12 * e33 - e13 * e32;
    const m22 = e11 * e33 - e13 * e31;
    const m23 = e11 * e32 - e12 * e31;
    const m31 = e12 * e23 - e13 * e22;
    const m32 = e11 * e23 - e13 * e21;
    const m33 = e11 * e22 - e12 * e21;

    const m = new Matrix3().set(m11, m12, m13, m21, m22, m23, m31, m32, m33);

    return m;
  }

  public getCofactors(): Matrix3 {
    const m = this.getMinors();
    const me = m.elements;

    const c = new Matrix3().set(
      me[0],
      me[1] * -1,
      me[2],
      me[3] * -1,
      me[4],
      me[5] * -1,
      me[6],
      me[7] * -1,
      me[8],
    );

    return c;
  }

  public getDeterminant(): number {
    const e = this.elements;

    const e11 = e[0];
    const e12 = e[1];
    const e13 = e[2];
    const e21 = e[3];
    const e22 = e[4];
    const e23 = e[5];
    const e31 = e[6];
    const e32 = e[7];
    const e33 = e[8];

    const d1 = e11 * (e22 * e33 - e23 * e32);
    const d2 = e12 * (e21 * e33 - e23 * e31);
    const d3 = e13 * (e21 * e32 - e22 * e31);

    const d = d1 - d2 + d3;

    return d;
  }

  public transpose(): this {
    const e = this.elements;

    const a11 = e[0];
    const a12 = e[1];
    const a13 = e[2];
    const a21 = e[3];
    const a22 = e[4];
    const a23 = e[5];
    const a31 = e[6];
    const a32 = e[7];
    const a33 = e[8];

    e[0] = a11;
    e[1] = a21;
    e[2] = a31;
    e[3] = a12;
    e[4] = a22;
    e[5] = a32;
    e[6] = a13;
    e[7] = a23;
    e[8] = a33;

    return this;
  }

  public copyFrom(m: Matrix3): this {
    this.fromArray(m.elements);

    return this;
  }

  public fromArray(array = []): this {
    for (let i = 0; i < 9; i += 1) {
      this.elements[i] = array[i];
    }

    return this;
  }

  public static createRotation(rotation: number): Matrix3 {
    const cos = MathUtils.cosDegrees(rotation);
    const sin = MathUtils.sinDegrees(rotation);

    return new Matrix3().set(cos, sin, 0, -sin, cos, 0, 0, 0, 1);
  }

  public clone(): Matrix3 {
    return new Matrix3().fromArray(this.elements);
  }
}
