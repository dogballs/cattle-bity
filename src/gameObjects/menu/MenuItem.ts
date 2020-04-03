import { GameObject, Subject } from '../../core';
import { GameObjectUpdateArgs } from '../../game';

export abstract class MenuItem extends GameObject {
  public focused = new Subject();
  public unfocused = new Subject();
  public selected = new Subject();
  public focusable = true;
  public isFocused = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public updateFocused(updateArgs?: GameObjectUpdateArgs): void {
    // Virtual
  }

  public focus(): void {
    this.isFocused = true;
    this.focused.notify();
  }

  public unfocus(): void {
    this.isFocused = false;
    this.unfocused.notify();
  }

  public select(): void {
    this.selected.notify();
  }
}
