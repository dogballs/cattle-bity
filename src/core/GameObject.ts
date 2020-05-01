import { Collider, Collision } from './collision';

import { RenderObject } from './RenderObject';

export class GameObject extends RenderObject {
  public collider: Collider = null;
  public ignorePause = false;
  public tags: string[] = [];

  private needsSetup = true;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  public invokeUpdate(...args: any[]): void {
    if (this.needsSetup === true) {
      this.needsSetup = false;
      this.setup(...args);
      this.updateMatrix();
      this.updateWorldVisible(true);
      this.updateWorldZIndex(true);
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

  protected hasBeenSetup(): boolean {
    return !this.needsSetup;
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

  public resetNeedsPaint(): void {
    // Don't reset paint status until setup
    if (this.needsSetup === true) {
      return;
    }

    super.resetNeedsPaint();
  }
}
