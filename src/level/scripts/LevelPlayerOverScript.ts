import { Timer } from '../../core';
import { GameUpdateArgs } from '../../game';
import { GameOverNotice } from '../../gameObjects';

import { LevelScript } from '../LevelScript';

const MOVE_DURATION = 1;
const STAY_DURATION = 1;

const SLIDE_POSITIONS = [
  { startX: 64, endX: 224 },
  { startX: 640, endX: 480 },
];

enum State {
  Idle,
  Moving,
  Staying,
  Done,
}

export class LevelPlayerOverScript extends LevelScript {
  // Disable by default
  protected enabled = false;

  private notice: GameOverNotice;
  private timer = new Timer();
  private playerIndex = -1;
  private state = State.Idle;

  public setPlayerIndex(playerIndex: number): void {
    this.playerIndex = playerIndex;
  }

  protected setup(): void {
    this.notice = new GameOverNotice();
    this.notice.updateMatrix();
    this.notice.position.setX(SLIDE_POSITIONS[this.playerIndex].startX);
    this.notice.position.setY(
      this.world.field.size.height - this.notice.size.height,
    );
    this.world.field.add(this.notice);

    this.state = State.Moving;

    this.timer.reset(MOVE_DURATION);
    this.timer.done.addListener(this.handleTimerDone);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { deltaTime } = updateArgs;

    if (this.state === State.Moving) {
      this.notice.dirtyPaintBox();

      const { startX, endX } = SLIDE_POSITIONS[this.playerIndex];
      const totalDistance = endX - startX;
      const speed = totalDistance / MOVE_DURATION;

      this.notice.position.x += speed * deltaTime;
      if (this.playerIndex === 0 && this.notice.position.x > endX) {
        this.notice.position.x = endX;
      } else if (this.playerIndex === 1 && this.notice.position.x < endX) {
        this.notice.position.x = endX;
      }

      this.notice.updateMatrix();

      this.timer.update(deltaTime);
    }

    if (this.state === State.Staying) {
      this.timer.update(deltaTime);
    }
  }

  private handleTimerDone = (): void => {
    if (this.state === State.Moving) {
      this.state = State.Staying;
      this.timer.reset(STAY_DURATION);
      return;
    }
    if (this.state === State.Staying) {
      this.state = State.Done;
      this.notice.dirtyPaintBox();
      this.notice.removeSelf();
      return;
    }
  };
}
