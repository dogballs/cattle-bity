export class Matrix4 {
  public elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

  public set(
    e11: number,
    e12: number,
    e13: number,
    e14: number,
    e21: number,
    e22: number,
    e23: number,
    e24: number,
    e31: number,
    e32: number,
    e33: number,
    e34: number,
    e41: number,
    e42: number,
    e43: number,
    e44: number,
  ): this {
    const e = this.elements;

    e[0] = e11;
    e[1] = e12;
    e[2] = e13;
    e[3] = e14;
    e[4] = e21;
    e[5] = e22;
    e[6] = e23;
    e[7] = e24;
    e[8] = e31;
    e[9] = e32;
    e[10] = e33;
    e[11] = e34;
    e[12] = e41;
    e[13] = e42;
    e[14] = e43;
    e[15] = e44;

    return this;
  }

  public premultiply(m: Matrix4): this {
    return this.multiplyMatrices(m, this);
  }

  public multiply(m: Matrix4): this {
    return this.multiplyMatrices(this, m);
  }

  public multiplyMatrices(a: Matrix4, b: Matrix4): this {
    const ae = a.elements;

    const a11 = ae[0];
    const a12 = ae[1];
    const a13 = ae[2];
    const a14 = ae[3];
    const a21 = ae[4];
    const a22 = ae[5];
    const a23 = ae[6];
    const a24 = ae[7];
    const a31 = ae[8];
    const a32 = ae[9];
    const a33 = ae[10];
    const a34 = ae[11];
    const a41 = ae[12];
    const a42 = ae[13];
    const a43 = ae[14];
    const a44 = ae[15];

    const be = b.elements;

    const b11 = be[0];
    const b12 = be[1];
    const b13 = be[2];
    const b14 = be[3];
    const b21 = be[4];
    const b22 = be[5];
    const b23 = be[6];
    const b24 = be[7];
    const b31 = be[8];
    const b32 = be[9];
    const b33 = be[10];
    const b34 = be[11];
    const b41 = be[12];
    const b42 = be[13];
    const b43 = be[14];
    const b44 = be[15];

    const e = this.elements;

    e[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    e[1] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    e[2] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    e[3] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    e[4] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    e[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    e[6] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    e[7] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    e[8] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    e[9] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    e[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    e[11] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    e[12] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    e[13] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    e[14] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    e[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return this;
  }

  public translate(tx: number, ty: number, tz: number): this {
    const translation = Matrix4.createTranslation(tx, ty, tz);

    this.premultiply(translation);

    return this;
  }

  public scale(sx: number, sy: number, sz: number): this {
    const scale = Matrix4.createScale(sx, sy, sz);

    this.premultiply(scale);

    return this;
  }

  public static createTranslation(tx: number, ty: number, tz: number): Matrix4 {
    // prettier-ignore
    return new Matrix4().set(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx, ty, tz, 1,
    );
  }

  public static createScale(sx: number, sy: number, sz: number): Matrix4 {
    // prettier-ignore
    return new Matrix4().set(
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, 1,
    );
  }

  public static createOrthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number,
  ): Matrix4 {
    // prettier-ignore
    return new Matrix4().set(
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0,

      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1,
    );
  }

  public static createProjection(
    width: number,
    height: number,
    depth: number,
  ): Matrix4 {
    // prettier-ignore
    return new Matrix4().set(
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    );
  }
}
