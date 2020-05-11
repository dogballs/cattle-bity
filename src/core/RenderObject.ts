import { BoundingBox } from './BoundingBox';
import { Painter } from './Painter';
import { Transform } from './Transform';

export class RenderObject extends Transform {
  // TODO: circular reference
  public painter: Painter = null;

  // 0 by default
  // If null - will inherit from parent
  protected zIndex: number = null;
  // Computed, don't change
  protected worldZIndex: number = null;

  // Visible by default
  // If null - will inherit from parent
  protected visible: boolean = null;
  // Computed, don't change
  protected worldVisible: boolean = null;

  protected prevDirtyBox: BoundingBox = null;

  protected needsPaint = true;

  public canRender(): boolean {
    if (this.painter === null) {
      return false;
    }
    if (this.getWorldVisible() === false) {
      return false;
    }
    return true;
  }

  // Visibility

  public setVisible(visible: boolean): void {
    this.visible = visible;

    this.updateWorldVisible(true);
  }

  public getVisible(): boolean {
    return this.visible;
  }

  public getWorldVisible(): boolean {
    return this.worldVisible;
  }

  protected updateWorldVisible(updateParents = false): void {
    if (this.parent !== null && updateParents === true) {
      this.parent.updateWorldVisible(true);
    }

    if (this.parent === null) {
      this.worldVisible = this.visible ?? true;
    } else {
      this.worldVisible = this.visible ?? this.parent.worldVisible;
    }

    for (const child of this.children) {
      child.updateWorldVisible();
    }
  }

  // Z-index

  public setZIndex(zIndex: number): void {
    this.zIndex = zIndex;

    this.updateWorldZIndex(true);
  }

  public getZIndex(): number {
    return this.zIndex;
  }

  public getWorldZIndex(): number {
    return this.worldZIndex;
  }

  protected updateWorldZIndex(updateParents = false): void {
    if (this.parent !== null && updateParents === true) {
      this.parent.updateWorldZIndex(true);
    }

    if (this.parent === null) {
      this.worldZIndex = this.zIndex ?? 0;
    } else {
      this.worldZIndex = this.zIndex ?? this.parent.worldZIndex;
    }

    for (const child of this.children) {
      child.updateWorldZIndex();
    }
  }

  // Dirty box

  public dirtyPaintBox(): void {
    this.prevDirtyBox = this.getWorldBoundingBox().clone();
    this.needsPaint = true;

    for (const child of this.children) {
      child.dirtyPaintBox();
    }
  }

  public getPrevDirtyBox(): BoundingBox {
    return this.prevDirtyBox;
  }

  public resetPrevDirtyBox(): void {
    this.prevDirtyBox = null;
  }

  // Paint flag

  public setNeedsPaint(): void {
    this.needsPaint = true;

    for (const child of this.children) {
      child.setNeedsPaint();
    }
  }

  public doesNeedPaint(): boolean {
    return this.needsPaint;
  }

  public resetNeedsPaint(): void {
    this.needsPaint = false;
  }
}
