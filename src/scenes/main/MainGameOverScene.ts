import { Timer } from '../../core';
import { AudioManager, GameUpdateArgs } from '../../game';
import { GameOverHeading } from '../../gameObjects';
import { MenuInputContext } from '../../input';

import { GameScene } from '../GameScene';
import { GameSceneType } from '../GameSceneType';

const SCENE_DURATION = 3;

export class MainGameOverScene extends GameScene {
  private heading = new GameOverHeading();
  private timer = new Timer(SCENE_DURATION);
  private audioManager: AudioManager;

  protected setup({ audioManager }: GameUpdateArgs): void {
    this.audioManager = audioManager;

    this.timer.done.addListener(this.handleDone);

    this.heading.origin.set(0.5, 0.5);
    this.heading.setCenter(this.root.getSelfCenter());
    this.heading.position.addY(-32);
    this.root.add(this.heading);

    this.audioManager.play('game-over');
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { inputManager } = updateArgs;

    const inputVariant = inputManager.getActiveVariant();

    if (inputVariant.isDownAny(MenuInputContext.Skip)) {
      this.finish();
      return;
    }

    super.update(updateArgs);

    this.timer.update(updateArgs.deltaTime);
  }

  private handleDone = (): void => {
    this.finish();
  };

  private finish(): void {
    this.audioManager.stopAll();
    this.navigator.clearAndPush(GameSceneType.MainHighscore);
  }
}
