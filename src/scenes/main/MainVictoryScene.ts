import { Scene, Timer } from '../../core';
import { GameUpdateArgs } from '../../game';
import { VictoryHeading } from '../../gameObjects';

import { GameSceneType } from '../GameSceneType';

const SCENE_DURATION = 3;

export class MainVictoryScene extends Scene {
  private heading: VictoryHeading;
  private timer = new Timer(SCENE_DURATION);

  protected setup(): void {
    this.timer.done.addListener(this.handleDone);

    this.heading = new VictoryHeading();
    this.heading.origin.set(0.5, 0.5);
    this.heading.setCenter(this.root.getSelfCenter());
    this.heading.position.addY(-32);
    this.root.add(this.heading);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });

    this.timer.update(updateArgs.deltaTime);
  }

  private handleDone = (): void => {
    this.navigator.clearAndPush(GameSceneType.MainHighscore);
  };
}
