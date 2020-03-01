import { BoundingBox } from './BoundingBox';
import { Node } from './Node';
import { Rotation } from './Rotation';
import { Size } from './Size';
import { Vector } from './Vector';

import { Renderer } from './renderers';

export class GameObject extends Node {
  // TODO: These two must go
  public collider = false;
  public ignorePause = false;

  public visible = true;
  public size: Size;
  public renderer: Renderer = null;
  // TODO: move pivot, position and rotation to transform object and
  // base it on scene graph
  public pivot = new Vector(0, 0);
  public position = new Vector(0, 0);
  // TODO: use rotation in scalar
  public rotation: Rotation = Rotation.Up;

  public tags: string[] = [];

  private needsSetup = true;

  constructor(width = 0, height = 0) {
    super();

    this.size = new Size(width, height);
  }

  // TODO: use nice rotation
  private getComputedSize(): Size {
    let { width, height } = this.size;

    if (this.rotation === Rotation.Right || this.rotation === Rotation.Left) {
      width = this.size.height;
      height = this.size.width;
    }

    return new Size(width, height);
  }

  public getBoundingBox(): BoundingBox {
    const { width, height } = this.getComputedSize();

    // Top-left point of the object
    const min = this.position.clone();

    // Bottom-right point of the object
    const max = min.clone().add(new Vector(width, height));

    return new BoundingBox(min, max);
  }

  public getWorldBoundingBox(): BoundingBox {
    const worldPosition = this.getWorldPosition();
    const size = this.getComputedSize();

    const worldPivotOffset = this.getPivotOffset();
    this.traverseAncestors((parent) => {
      worldPivotOffset.add(parent.getPivotOffset());
    });

    // Top-left point of the object
    const min = worldPosition.clone().sub(worldPivotOffset);

    // Bottom-right point of the object
    const max = min.clone().add(size.toVector());

    return new BoundingBox(min, max);
  }

  public getPivotOffset(): Vector {
    const size = this.getComputedSize();
    const offset = this.pivot.clone().mult(size.toVector());

    return offset;
  }

  public getWorldPosition(): Vector {
    const worldPosition = this.position.clone();

    this.traverseAncestors((parent) => {
      worldPosition.add(parent.position);
    });

    return worldPosition;
  }

  public setWorldPosition(worldPosition: Vector): void {
    const localPosition = worldPosition.clone();

    this.traverseAncestors((parent) => {
      localPosition.sub(parent.position);
    });

    this.position.copyFrom(localPosition);
  }

  public getCenter(): Vector {
    return this.getBoundingBox().getCenter();
  }

  public setCenter(v: Vector): void {
    const size = this.getComputedSize();

    this.position.copyFrom(v.sub(size.toVector().divideScalar(2)));
  }

  public setCenterFrom(gameObject: GameObject): void {
    this.setCenter(gameObject.getCenter());
  }

  public getChildrenCenter(): Vector {
    return this.size.toVector().divideScalar(2);
  }

  public rotate(rotation: Rotation): void {
    this.rotation = rotation;
  }

  public getChildrenWithTag(argTags: string | string[]): GameObject[] {
    const objects = [];

    const tags = Array.isArray(argTags) ? argTags : [argTags];

    // TODO: These loops look like shit
    this.traverse((object) => {
      const hasAllTags = tags.every((tag) => {
        return object.tags.includes(tag);
      });

      if (hasAllTags) {
        objects.push(object);
      }
    });

    return objects;
  }

  public hasChildrenWithTag(tag: string): boolean {
    let has = false;

    this.traverse((object) => {
      if (object.tags.includes(tag)) {
        has = true;
      }
    });

    return has;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  public invokeUpdate(...args: any[]): void {
    if (this.needsSetup === true) {
      this.needsSetup = false;
      this.setup(...args);
    }

    this.update(...args);
  }

  public invokeCollide(target: GameObject): void {
    // Can't collide if not setup yet
    if (this.needsSetup === true) {
      return;
    }

    this.collide(target);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  protected setup(...args: any[]): void {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  protected update(...args: any[]): void {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected collide(target: GameObject): void {
    return undefined;
  }
}
