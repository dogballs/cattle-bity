import { Subject, Timer } from '../../core';
import { GameUpdateArgs } from '../../game';
import { Curtain, LevelTitle } from '../../gameObjects';
import * as config from '../../config';

import { LevelScript } from '../LevelScript';

export class LevelIntroScript extends LevelScript {
  public completed = new Subject();
  private curtain: Curtain;
  private title: LevelTitle;
  private timer: Timer;

  protected setup(): void {
    this.timer = new Timer(config.LEVEL_START_DELAY);
    this.timer.done.addListener(this.handleTimer);

    // TODO: add them last order is important
    // TODO: curtain is displayed on top of scenes? (transition between levels)
    this.curtain = new Curtain(
      this.world.sceneRoot.size.width,
      this.world.sceneRoot.size.height,
      false,
    );
    this.world.sceneRoot.add(this.curtain);

    this.title = new LevelTitle(this.session.getLevelNumber());
    this.title.setCenter(this.world.sceneRoot.getSelfCenter());
    this.title.origin.set(0.5, 0.5);
    this.world.sceneRoot.add(this.title);
  }

  protected update({ deltaTime }: GameUpdateArgs): void {
    this.timer.update(deltaTime);
  }

  private handleTimer = (): void => {
    this.curtain.open();
    this.title.setVisible(false);
    this.completed.notify(null);
  };
}
