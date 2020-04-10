import { Subject, Timer } from '../../core';
import { GameUpdateArgs } from '../../game';
import { Tank } from '../../gameObjects';

import { TankBehavior } from '../TankBehavior';

const MOVE_DURATION = 3;
const PREFIRE_DELAY = 1;
const FIRE_LIMIT = 1;

enum State {
  Moving,
  Prefire,
  Firing,
  Done,
}

export class VictoryTankBehavior extends TankBehavior {
  public stopped = new Subject();
  public fired = new Subject();

  private moveTimer = new Timer(MOVE_DURATION);
  private prefireTimer = new Timer(PREFIRE_DELAY);
  private fireCounter = 0;
  private state = State.Moving;

  public update(tank: Tank, updateArgs: GameUpdateArgs): void {
    if (this.state === State.Done) {
      return;
    }

    if (this.state === State.Moving) {
      if (this.moveTimer.isDone()) {
        this.state = State.Prefire;
        this.stopped.notify(null);
        tank.idle();
        return;
      }

      tank.move(updateArgs.deltaTime);

      this.moveTimer.update(updateArgs.deltaTime);
      return;
    }

    if (this.state === State.Prefire) {
      if (this.prefireTimer.isDone()) {
        this.state = State.Firing;
        return;
      }

      this.prefireTimer.update(updateArgs.deltaTime);
      return;
    }

    // Move for some time
    if (this.moveTimer.isActive()) {
      return;
    }

    // Once done moving start firing
    const hasFired = tank.fire();
    if (!hasFired) {
      return;
    }

    this.fired.notify(null);

    // Fire specific number of times
    this.fireCounter += 1;
    if (this.fireCounter < FIRE_LIMIT) {
      return;
    }

    this.state = State.Done;
  }
}
