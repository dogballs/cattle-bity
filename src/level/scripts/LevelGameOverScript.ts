import { Timer } from '../../core';
import { GameUpdateArgs } from '../../game';
import { GameOverNotice } from '../../gameObjects';

import { LevelScript } from '../LevelScript';

const SLIDE_SPEED = 200;
const TARGET_POSITION_Y = 360;
const TOTAL_DURATION = 5;
const MOVE_BLOCK_DELAY = 1;

export class LevelGameOverScript extends LevelScript {
  // Disable by default
  protected enabled = false;

  private notice: GameOverNotice;
  private moveBlockTimer = new Timer();
  private totalTimer = new Timer();

  protected setup(): void {
    this.notice = new GameOverNotice();
    this.notice.updateMatrix();
    this.notice.setCenterX(this.world.field.getSelfCenter().x);
    this.notice.position.y = this.world.field.size.height + 100;
    this.world.field.add(this.notice);

    this.moveBlockTimer.reset(MOVE_BLOCK_DELAY);
    this.moveBlockTimer.done.addListener(this.handleMoveBlockTimer);

    this.totalTimer.reset(TOTAL_DURATION);
    this.totalTimer.done.addListener(this.handleTotalTimer);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { deltaTime } = updateArgs;

    this.notice.position.y -= SLIDE_SPEED * deltaTime;
    if (this.notice.position.y <= TARGET_POSITION_Y) {
      this.notice.position.y = TARGET_POSITION_Y;
    }
    this.notice.updateMatrix();

    this.moveBlockTimer.update(deltaTime);
    this.totalTimer.update(deltaTime);
  }

  private handleMoveBlockTimer = (): void => {
    this.eventBus.levelGameOverMoveBlocked.notify(null);
  };

  private handleTotalTimer = (): void => {
    this.eventBus.levelGameOverCompleted.notify(null);
  };
}
