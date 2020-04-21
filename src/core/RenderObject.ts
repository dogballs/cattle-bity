import { Painter } from './Painter';
import { Transform } from './Transform';

// TODO: transform should be a component
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

  public setVisible(visible: boolean): void {
    this.visible = visible;

    this.updateWorldVisible();
  }

  public getWorldVisible(): boolean {
    return this.worldVisible;
  }

  protected updateWorldVisible(): void {
    if (this.parent === null) {
      this.worldVisible = this.visible ?? true;
    } else {
      this.worldVisible = this.visible ?? this.parent.worldVisible;
    }

    for (const child of this.children) {
      child.updateWorldVisible();
    }
  }

  public setZIndex(zIndex: number): void {
    this.zIndex = zIndex;

    this.updateWorldZIndex();
  }

  public getWorldZIndex(): number {
    return this.worldZIndex;
  }

  protected updateWorldZIndex(): void {
    if (this.parent === null) {
      this.worldZIndex = this.zIndex ?? 0;
    } else {
      this.worldZIndex = this.zIndex ?? this.parent.worldZIndex;
    }

    for (const child of this.children) {
      child.updateWorldZIndex();
    }
  }
}
