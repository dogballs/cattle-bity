import { Collider, Collision } from './collision';

import { Painter } from './Painter';
import { Transform } from './Transform';

export class GameObject extends Transform {
  // TODO: These two must go
  public collider: Collider = null;
  public ignorePause = false;

  public visible = true;

  // TODO: circular reference
  public painter: Painter = null;

  public tags: string[] = [];

  private needsSetup = true;

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  public invokeUpdate(...args: any[]): void {
    if (this.needsSetup === true) {
      this.needsSetup = false;
      this.setup(...args);
    }

    this.update(...args);
  }

  public invokeCollide(collision: Collision): void {
    // Can't collide if not setup yet
    if (this.needsSetup === true) {
      return;
    }

    this.collide(collision);
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
  protected collide(collision: Collision): void {
    return undefined;
  }
}
