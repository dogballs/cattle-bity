import { GameObjectUpdateArgs } from '../core';
import { Curtain, LevelSelector } from '../gameObjects';

import { Scene } from './Scene';
import { SceneType } from './SceneType';

const MIN_LEVEL_NUMBER = 1;
const MAX_LEVEL_NUMBER = 35;

export class StageSelectionScene extends Scene {
  private selector = new LevelSelector(MIN_LEVEL_NUMBER, MAX_LEVEL_NUMBER);
  private curtain: Curtain;

  protected setup({}: GameObjectUpdateArgs): void {
    this.curtain = new Curtain(this.root.size.width, this.root.size.height);

    // TODO: order is important, z-index
    this.root.add(this.curtain);

    this.selector.setCenter(this.root.getChildrenCenter());
    this.selector.selected.addListener(this.handleLevelSelected);
    this.root.add(this.selector);

    this.curtain.close();
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleLevelSelected = (level: number): void => {
    console.log({ level });
    this.transition(SceneType.Level);
  };
}
