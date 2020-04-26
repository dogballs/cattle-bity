import { BoundingBox } from './BoundingBox';
import { Matrix3 } from './Matrix3';
import { Node } from './Node';
import { Size } from './Size';
import { Vector } from './Vector';

import { MathUtils } from './utils';

// Refenreces:
// https://docs.unity3d.com/ScriptReference/RectTransform.html
// https://github.com/mrdoob/three.js/blob/dev/src/core/Object3D.js
// https://github.com/SFML/SFML/blob/master/src/SFML/Graphics/Transformable.cpp
// http://gameprogrammingpatterns.com/dirty-flag.html
// https://en.wikipedia.org/wiki/Transformation_matrix
// https://en.wikipedia.org/wiki/Affine_transformation
// https://medium.com/swlh/understanding-3d-matrix-transforms-with-pixijs-c76da3f8bd8

// -1 is because coordinate system start is at top left
const X_AXIS = new Vector(1, 0);
const Y_AXIS = new Vector(0, -1);

export class Transform extends Node {
  public size = new Size();

  public position = new Vector(0, 0);

  // Values in range [0,1] based on size.
  public origin = new Vector(0, 0);

  // Degrees; clockwise
  public rotation = 0;

  // Pivot for rotation. Values in range [0,1] based on size.
  public pivot = new Vector(0, 0);

  public matrix = new Matrix3();
  public worldMatrix = new Matrix3();

  public boundingBox = new BoundingBox();
  public worldBoundingBox = new BoundingBox();

  public matrixAutoUpdate = false;
  public worldMatrixNeedsUpdate = false;

  constructor(width = 0, height = 0) {
    super();

    this.size = new Size(width, height);
  }

  public rotate(rotation: number): void {
    this.rotation = rotation;
  }

  // Add child while keeping it's world position.
  // Modifies attachable object local matrix, position and rotation.
  public attach(target: Transform): this {
    // Make sure self tree is up-to-date, because we need a correct world matrix
    this.updateWorldMatrix(true);

    // Self object will become a parent for a target object
    const invSelfWorldTransformMatrix = this.worldMatrix.clone().invert();

    if (target.parent !== null) {
      target.parent.updateWorldMatrix(true);
      invSelfWorldTransformMatrix.premultiply(target.parent.worldMatrix);
    }

    // Revert all world transformations of self (new parent) from the target,
    // so target's local matrix will now be relative to a new parent.
    target.updateMatrix();
    target.applyMatrix3(invSelfWorldTransformMatrix);

    this.add(target);

    return this;
  }

  public applyMatrix3(transformMatrix: Matrix3): void {
    if (this.matrixAutoUpdate) {
      this.updateMatrix();
    }

    this.matrix.multiply(transformMatrix);

    const { rotation, position } = this.decomposeTransformMatrix(
      this.matrix,
      this.getPivotOffset(),
      this.getOriginOffset(),
    );

    this.rotation = rotation;
    this.position = position;
  }

  public translateX(distance: number): this {
    this.translateOnAxis(X_AXIS, distance);
    return this;
  }

  public translateY(distance: number): this {
    this.translateOnAxis(Y_AXIS, distance);
    return this;
  }

  public translateOnAxis(axis: Vector, distance: number): this {
    const d = Matrix3.createRotation(this.rotation)
      .applyToVector(axis.clone())
      .multScalar(distance);

    this.position.add(d);

    return this;
  }

  public getWorldPosition(): Vector {
    const { position: worldPosition } = this.decomposeTransformMatrix(
      this.worldMatrix,
      this.getPivotOffset(),
      this.getOriginOffset(),
    );

    return worldPosition;
  }

  public getWorldRotation(): number {
    const { rotation: worldRotation } = this.decomposeTransformMatrix(
      this.worldMatrix,
      this.getPivotOffset(),
      this.getOriginOffset(),
    );

    return worldRotation;
  }

  public getCenter(): Vector {
    return this.getBoundingBox().getCenter();
  }

  public setCenter(v: Vector): void {
    const size = this.getBoundingBox().getSize();

    this.position.set(v.x - size.width / 2, v.y - size.height / 2);
  }

  public setCenterX(x: number): void {
    const size = this.getBoundingBox().getSize();

    this.position.setX(x - size.width / 2);
  }

  public setCenterY(y: number): void {
    const size = this.getBoundingBox().getSize();

    this.position.setY(y - size.height / 2);
  }

  public getSelfCenter(): Vector {
    return this.size.toVector().divideScalar(2);
  }

  public getBoundingBox(): BoundingBox {
    if (this.matrixAutoUpdate) {
      this.updateMatrix();
    }

    return this.boundingBox;
  }

  public getWorldBoundingBox(): BoundingBox {
    this.updateWorldMatrix(true);

    return this.worldBoundingBox;
  }

  public getSelfPoints(): Vector[] {
    const { width, height } = this.size;

    const points = [
      new Vector(0, 0),
      new Vector(width, 0),
      new Vector(width, height),
      new Vector(0, height),
    ];

    return points;
  }

  public getPoints(): Vector[] {
    const selfPoints = this.getSelfPoints();

    const points = selfPoints.map((point) => {
      return this.matrix.applyToVector(point);
    });

    return points;
  }

  public getWorldPoints(): Vector[] {
    const selfPoints = this.getSelfPoints();

    const points = selfPoints.map((point) => {
      return this.worldMatrix.applyToVector(point);
    });

    return points;
  }

  public updateMatrix(childrenNeedUpdate = false): void {
    const transformMatrix = this.composeTransformMatrix(
      this.getPivotOffset(),
      this.getOriginOffset(),
      this.rotation,
      this.position,
    );
    this.matrix.copyFrom(transformMatrix);

    this.boundingBox.fromPoints(this.getPoints());

    this.setWorldMatrixNeedsUpdate(childrenNeedUpdate);
  }

  public setWorldMatrixNeedsUpdate(updateChildren = false): void {
    this.worldMatrixNeedsUpdate = true;

    if (updateChildren) {
      for (const child of this.children) {
        child.setWorldMatrixNeedsUpdate(updateChildren);
      }
    }
  }

  public updateWorldMatrix(
    updateParents = false,
    updateChildren = false,
  ): void {
    // Goes up the tree to all parents and updates their local and world matrix.
    // Note, that it will update all parents starting from the root, before it
    // continues updating current object.
    if (updateParents === true && this.parent !== null) {
      this.parent.updateWorldMatrix(true, false);
    }

    // Update current node local matrix
    if (this.matrixAutoUpdate) {
      this.updateMatrix();
    }

    if (this.worldMatrixNeedsUpdate) {
      // Update current node world matrix
      if (this.parent === null) {
        this.worldMatrix.copyFrom(this.matrix);
      } else {
        this.worldMatrix.multiplyMatrices(this.matrix, this.parent.worldMatrix);
      }

      this.worldBoundingBox.fromPoints(this.getWorldPoints());

      this.worldMatrixNeedsUpdate = false;
    }

    // Goes down the tree and updates all children local and world matrix
    if (updateChildren === true) {
      for (const child of this.children) {
        child.updateWorldMatrix(false, true);
      }
    }
  }

  private getPivotOffset(): Vector {
    const pivotOffset = new Vector(
      -this.pivot.x * this.size.width,
      -this.pivot.y * this.size.height,
    );
    return pivotOffset;
  }

  private getOriginOffset(): Vector {
    const originOffset = new Vector(
      -this.origin.x * this.size.width,
      -this.origin.y * this.size.height,
    );
    return originOffset;
  }

  /**
   * P (Pivot offset for rotation around it)
   *   [1  0  0]
   *   [0  1  0]
   *   [px py 1]

   * R (Rotation)
   *   [cos -sin 0]
   *   [sin  cos 0]
   *   [ 0    0  1]
   *
   * -P (Pivot offset cancellation)
   *   [1    0  0]
   *   [0    1  0]
   *   [-px -py 1]
   *
   * O (Origin offset for translation around it)
   *   [1  0  0]
   *   [0  1  0]
   *   [ox oy 1]
   *
   * T (Translation):
   *   [1  0  0]
   *   [0  1  0]
   *   [tx ty 1]
   *
   * All combined into a single transform matrix
   *
   *   TM = P * R * (-P) * O * T
   *
   * which can be applied to a vector V to transform it:
   *
   *   V' = V * TM
   */
  private composeTransformMatrix(
    pivotOffset: Vector,
    originOffset: Vector,
    rotation: number,
    position: Vector,
  ): Matrix3 {
    const pivX = pivotOffset.x;
    const pivY = pivotOffset.y;

    const orgX = originOffset.x;
    const orgY = originOffset.y;

    const posX = position.x;
    const posY = position.y;

    const cos = MathUtils.cosDegrees(rotation);
    const sin = MathUtils.sinDegrees(rotation);

    const tx = pivX * cos - pivY * sin - pivX + orgX + posX;
    const ty = pivX * sin + pivY * cos - pivY + orgY + posY;

    const transformMatrix = new Matrix3().set(
      cos,
      sin,
      0,
      -sin,
      cos,
      0,
      tx,
      ty,
      1,
    );

    return transformMatrix;
  }

  private decomposeTransformMatrix(
    transformMatrix: Matrix3,
    pivotOffset: Vector,
    originOffset: Vector,
  ): { rotation: number; position: Vector } {
    const pivX = pivotOffset.x;
    const pivY = pivotOffset.y;

    const orgX = originOffset.x;
    const orgY = originOffset.y;

    const cos = transformMatrix.elements[0];
    const sin = transformMatrix.elements[1];
    const tx = transformMatrix.elements[6];
    const ty = transformMatrix.elements[7];

    let rotation = MathUtils.atan2Degrees(sin, cos);
    if (rotation < 0) {
      rotation += 360;
    }

    const posX = tx - (pivX * cos - pivY * sin - pivX + orgX);
    const posY = ty - (pivX * sin + pivY * cos - pivY + orgY);

    const position = new Vector(posX, posY);

    return {
      rotation,
      position,
    };
  }
}
