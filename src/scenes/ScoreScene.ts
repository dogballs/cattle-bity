import { GameObjectUpdateArgs, RectRenderer } from '../core';
import { ScoreTable, SpriteText } from '../gameObjects';
import * as config from '../config';

import { Scene } from './Scene';
import { SceneType } from './SceneType';

export class ScoreScene extends Scene {
  private levelTitle = new SpriteText('STAGE 1', { color: config.COLOR_WHITE });
  private scoreTable = new ScoreTable();

  protected setup(): void {
    this.root.renderer = new RectRenderer(config.COLOR_BLACK);

    this.levelTitle.pivot.set(0.5, 0);
    this.levelTitle.setCenter(this.root.getChildrenCenter());
    this.levelTitle.position.setY(128);
    this.root.add(this.levelTitle);

    this.scoreTable.setCenter(this.root.getChildrenCenter());
    this.scoreTable.done.addListener(this.handleDone);
    this.root.add(this.scoreTable);

    this.scoreTable.start();
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleDone = (): void => {
    this.transition(SceneType.GameOver);
  };
}
