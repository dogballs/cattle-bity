import { AudioLoader } from '../../core';
import { GameUpdateArgs, GameScript, GameState } from '../../game';
import { PauseNotice } from '../../gameObjects';
import { LevelInputContext } from '../../input';

import { LevelWorld } from '../LevelWorld';

export class LevelPauseScript extends GameScript {
  private world: LevelWorld;
  private notice: PauseNotice;
  // TODO: rework
  private audioLoader: AudioLoader;

  constructor(world: LevelWorld) {
    super();

    this.world = world;
  }

  protected setup({ audioLoader }: GameUpdateArgs): void {
    this.audioLoader = audioLoader;

    this.notice = new PauseNotice();
    this.notice.setCenter(this.world.field.getSelfCenter());
    this.notice.position.y += 18;
    this.notice.visible = false;
    this.world.field.add(this.notice);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { gameState, input } = updateArgs;

    if (input.isDownAny(LevelInputContext.Pause)) {
      if (gameState.is(GameState.Playing)) {
        gameState.set(GameState.Paused);
        this.activate();
      } else {
        gameState.set(GameState.Playing);
        this.deactivate();
      }
    }
  }

  private activate(): void {
    this.notice.visible = true;
    this.notice.restart();

    this.audioLoader.pauseAll();
    this.audioLoader.load('pause').play();
  }

  private deactivate(): void {
    this.notice.visible = false;

    this.audioLoader.resumeAll();
  }
}
