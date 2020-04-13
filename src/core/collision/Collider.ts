import { BoundingBox } from '../BoundingBox';
import { GameObject } from '../GameObject';
import { Subject } from '../Subject';

export abstract class Collider {
  public object: GameObject;
  public dynamic: boolean;
  public unregisterRequested = new Subject();

  constructor(object: GameObject, dynamic = false) {
    this.object = object;
    this.dynamic = dynamic;
  }

  abstract init(): void;
  abstract update(): void;

  abstract getBox(): BoundingBox;
  abstract getPrevBox(): BoundingBox;
  abstract getCurrentBox(): BoundingBox;

  public unregister(): void {
    this.unregisterRequested.notify(null);
  }
}
