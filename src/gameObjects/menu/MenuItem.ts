import { GameObject, Subject } from '../../core';
import { GameObjectUpdateArgs } from '../../game';

export abstract class MenuItem extends GameObject {
  public selected = new Subject();
  public focusable = true;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public updateFocused(updateArgs?: GameObjectUpdateArgs): void {
    // Virtual
  }
}
