import { GameObject, GameObjectUpdateArgs, RectRenderer } from '../core';
import { LevelSelector } from '../gameObjects';
import * as config from '../config';

const MIN_LEVEL_NUMBER = 1;
const MAX_LEVEL_NUMBER = 35;

export class StageSelectionScene extends GameObject {
  private selector = new LevelSelector(MIN_LEVEL_NUMBER, MAX_LEVEL_NUMBER);

  protected setup({}: GameObjectUpdateArgs): void {
    this.renderer = new RectRenderer(config.BACKGROUND_COLOR);

    this.selector.setCenter(this.getChildrenCenter());
    this.add(this.selector);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }
}
