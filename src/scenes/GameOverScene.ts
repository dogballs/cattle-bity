import { GameObjectUpdateArgs, Timer } from '../core';
import { GameOverHeading } from '../gameObjects';

import { Scene } from './Scene';
import { SceneType } from './SceneType';

export class GameOverScene extends Scene {
  private heading = new GameOverHeading();
  private timer = new Timer(180);

  protected setup(): void {
    this.timer.done.addListener(this.handleDone);

    this.heading.pivot.set(0.5, 0.5);
    this.heading.setCenter(this.root.getChildrenCenter());
    this.heading.position.addY(-32);
    this.root.add(this.heading);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });

    this.timer.tick();
  }

  private handleDone = (): void => {
    this.transition(SceneType.Menu);
  };
}
