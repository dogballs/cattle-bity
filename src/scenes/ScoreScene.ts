import { GameObject, GameObjectUpdateArgs, RectRenderer } from '../core';
import { ScoreTable, SpriteText } from '../gameObjects';
import * as config from '../config';

export class ScoreScene extends GameObject {
  private levelTitle = new SpriteText('STAGE 1', { color: config.COLOR_WHITE });
  private scoreTable = new ScoreTable();

  protected setup(): void {
    this.renderer = new RectRenderer(config.COLOR_BLACK);

    this.levelTitle.pivot.set(0.5, 0);
    this.levelTitle.setCenter(this.getChildrenCenter());
    this.levelTitle.position.setY(128);
    this.add(this.levelTitle);

    // this.scoreTable.position.set(352, 192);

    this.scoreTable.setCenter(this.getChildrenCenter());
    // this.scoreTable.pivot.set(0.5, 0.5);
    this.add(this.scoreTable);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }
}
