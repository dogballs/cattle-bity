import { Timer } from '../core';
import { GameObjectUpdateArgs } from '../game';
import { GameOverHeading } from '../gameObjects';

import { Scene } from './Scene';
import { SceneType } from './SceneType';

const SCENE_DURATION = 3;

export class GameOverScene extends Scene {
  private heading = new GameOverHeading();
  private timer = new Timer(SCENE_DURATION);

  protected setup(): void {
    this.timer.done.addListener(this.handleDone);

    this.heading.origin.set(0.5, 0.5);
    this.heading.setCenter(this.root.getSelfCenter());
    this.heading.position.addY(-32);
    this.root.add(this.heading);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });

    this.timer.update(updateArgs.deltaTime);
  }

  private handleDone = (): void => {
    this.transition(SceneType.Menu);
  };
}
