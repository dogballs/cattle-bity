import { Painter } from './Painter';
import { Transform } from './Transform';

// TODO: transform should be a component
export class RenderObject extends Transform {
  // TODO: circular reference
  public painter: Painter = null;

  // 0 by default
  // If null - will inherit from parent
  public zIndex: number = null;
  // Computed, don't change
  public worldZIndex: number = null;

  // Visible by default
  // If null - will inherit from parent
  public visible: boolean = null;
  // Computed, don't change
  public worldVisible: boolean = null;

  public updateWorldVisible(
    updateParents = false,
    updateChildren = false,
  ): void {
    if (updateParents === true && this.parent !== null) {
      this.parent.updateWorldVisible(true, false);
    }

    if (this.parent === null) {
      this.worldVisible = this.visible ?? true;
    } else {
      this.worldVisible = this.visible ?? this.parent.worldVisible;
    }

    if (updateChildren === true) {
      for (const child of this.children) {
        child.updateWorldVisible(false, true);
      }
    }
  }

  public updateWorldZIndex(
    updateParents = false,
    updateChildren = false,
  ): void {
    if (updateParents === true && this.parent !== null) {
      this.parent.updateWorldZIndex(true, false);
    }

    if (this.parent === null) {
      this.worldZIndex = this.zIndex ?? 0;
    } else {
      this.worldZIndex = this.zIndex ?? this.parent.worldZIndex;
    }

    if (updateChildren === true) {
      for (const child of this.children) {
        child.updateWorldZIndex(false, true);
      }
    }
  }
}
