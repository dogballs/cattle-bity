import { Logger, LogLevel, Rotation, Timer, Vector } from '../../core';
import { Tank } from '../../gameObjects';
import { RandomUtils } from '../../utils';
import * as config from '../../config';

import { TankBehavior } from './TankBehavior';

enum State {
  Moving,
  Thinking,
  UntuckThinking,
  Firing,
}

const THINK_DURATION = 2;
const FIRE_MIN_DELAY = 0;
const FIRE_MAX_DELAY = 60;
const STUCK_FIRE_CHANCE = 30;
const UNSTUCK_THINK_CHANCE = 5;

const rotations = [Rotation.Up, Rotation.Down, Rotation.Left, Rotation.Right];

export class DumbAiTankBehavior extends TankBehavior {
  private state: State = State.Moving;
  private lastPosition = new Vector(-1, -1);
  private thinkTimer = new Timer();
  private fireTimer = new Timer();
  private log = new Logger(DumbAiTankBehavior.name, LogLevel.Info);

  public update(tank: Tank): void {
    if (this.fireTimer.isDone()) {
      const hasFired = tank.fire();
      if (hasFired) {
        this.log.debug('Fire!');

        // If tank decided to fire during thinking phase, we wait for it
        // here and then reset him
        if (this.state === State.Firing) {
          this.state = State.Moving;
        }
      } else {
        this.log.debug('Could not fire :(');
      }

      // Fire next bullet in some random interval
      this.attemptFire();
    } else {
      this.fireTimer.tick();
    }

    // Simply waiting to fire after tank decided to fire
    if (this.state === State.Firing) {
      return;
    }

    if (this.state === State.Thinking || this.state === State.UntuckThinking) {
      if (this.thinkTimer.isDone()) {
        // When tank is done thinking, he can either fire in his current
        // direction or rotate and move to another direction. First, find out
        // if he wants to fire.
        if (this.state === State.Thinking && this.shouldStuckFire()) {
          this.log.debug('I am done thinking. I want to fire!');
          this.state = State.Firing;
          return;
        }

        // Otherwise, we pick some new random direction
        this.state = State.Moving;
        const nextRotation = this.getRandomRotation();
        this.log.debug('I am done thinking. Rotating %s', nextRotation);
        tank.rotate(nextRotation);
        tank.move();
        return;
      }
      this.thinkTimer.tick();
      return;
    }

    tank.move();

    // If tank can no longer move it his direction, he has to decide what to do
    // next.
    const isStuck =
      this.lastPosition.equals(tank.position) && this.state === State.Moving;
    if (isStuck) {
      this.log.debug('I am stuck. Thinking...');
      this.state = State.Thinking;
      this.thinkTimer.reset(THINK_DURATION);
      return;
    }

    // If tank is not stuck and can still move in his direction, there is a
    // chance that he will do something instead of just moving forward
    if (this.shouldUnstuckThink(tank)) {
      this.log.debug('I changed my mind all of a sudden. Thinking...');
      this.state = State.UntuckThinking;
      this.thinkTimer.reset(THINK_DURATION);
      return;
    }

    this.lastPosition = tank.position.clone();
  }

  private attemptFire(): void {
    const delay = RandomUtils.number(FIRE_MIN_DELAY, FIRE_MAX_DELAY);
    this.log.debug('I will try to fire in %d ticks', delay);
    this.fireTimer.reset(delay);
  }

  private shouldUnstuckThink(tank: Tank): boolean {
    const num = RandomUtils.number(1, 100);
    const hasChance = num <= UNSTUCK_THINK_CHANCE;

    const { rotation, position } = tank;

    const isTankVertical =
      rotation === Rotation.Up || rotation === Rotation.Down;
    const isTankHorizontal =
      rotation === Rotation.Left || rotation === Rotation.Right;

    const tileSize = config.TILE_SIZE_MEDIUM;

    const isTankOnTileX = isTankHorizontal && position.x % tileSize === 0;
    const isTankOnTileY = isTankVertical && position.y % tileSize === 0;

    const shouldThink = hasChance && (isTankOnTileX || isTankOnTileY);

    return shouldThink;
  }

  private shouldStuckFire(): boolean {
    const num = RandomUtils.number(1, 100);
    const hasChance = num <= STUCK_FIRE_CHANCE;

    return hasChance;
  }

  private getRandomRotation(): Rotation {
    return RandomUtils.arrayElement(rotations);
  }
}
