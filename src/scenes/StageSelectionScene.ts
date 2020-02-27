import { GameObject, GameObjectUpdateArgs } from '../core';
import { Curtain, LevelSelector } from '../gameObjects';

const MIN_LEVEL_NUMBER = 1;
const MAX_LEVEL_NUMBER = 35;

export class StageSelectionScene extends GameObject {
  private selector = new LevelSelector(MIN_LEVEL_NUMBER, MAX_LEVEL_NUMBER);
  private curtain: Curtain;

  constructor(width: number, height: number) {
    super(width, height);

    this.curtain = new Curtain(width, height, true);
  }

  protected setup({}: GameObjectUpdateArgs): void {
    // TODO: order is important, z-index
    this.add(this.curtain);

    this.selector.setCenter(this.getChildrenCenter());
    this.add(this.selector);

    this.curtain.close();
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }
}
