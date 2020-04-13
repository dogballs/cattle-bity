import { BoundingBox } from '../../BoundingBox';
import { Vector } from '../../Vector';

import { Collider } from '../Collider';

export class BoxCollider extends Collider {
  private prevBox: BoundingBox;
  private currentBox: BoundingBox;

  public init(): void {
    this.object.updateWorldMatrix();
    const box = this.object.getWorldBoundingBox();

    this.prevBox = box.clone();
    this.currentBox = box.clone();
  }

  public update(): void {
    this.object.updateWorldMatrix();
    const box = this.object.getWorldBoundingBox();

    this.prevBox = this.currentBox;
    this.currentBox = box.clone();
  }

  public getBox(): BoundingBox {
    return this.currentBox;
  }

  public getPrevBox(): BoundingBox {
    return this.prevBox;
  }

  public getCurrentBox(): BoundingBox {
    return this.currentBox;
  }

  public getDirection(): Vector {
    const prevCenter = this.prevBox.getCenter();
    const currentCenter = this.currentBox.getCenter();

    const dx = currentCenter.x - prevCenter.x;
    const dy = currentCenter.y - prevCenter.y;

    const direction = new Vector(dx, dy);

    return direction;
  }
}
