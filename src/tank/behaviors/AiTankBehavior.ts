import { Logger, RandomUtils, Timer, Vector } from '../../core';
import { GameUpdateArgs, Rotation } from '../../game';
import { Tank } from '../../gameObjects';
import * as config from '../../config';

import { TankBehavior } from '../TankBehavior';

enum State {
  Moving,
  Thinking,
  UnstuckThinking,
  Firing,
}

const THINK_DURATION = 0.3;
const FIRE_MIN_DELAY = 0;
const FIRE_MAX_DELAY = 1.5;
const STUCK_FIRE_CHANCE = 30;
const UNSTUCK_THINK_CHANCE = 5;
const ROTATE_TOWARDS_BASE_CHANCE = 30;

const ROTATIONS = [Rotation.Up, Rotation.Down, Rotation.Left, Rotation.Right];

export class AiTankBehavior extends TankBehavior {
  private state: State = State.Moving;
  private lastPosition = new Vector(-1, -1);
  private thinkTimer = new Timer();
  private fireTimer = new Timer();
  private log = new Logger(AiTankBehavior.name, Logger.Level.Info);

  public update(tank: Tank, updateArgs: GameUpdateArgs): void {
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
      this.fireTimer.update(updateArgs.deltaTime);
    }

    // Simply waiting to fire after tank decided to fire
    if (this.state === State.Firing) {
      return;
    }

    if (this.state === State.Thinking || this.state === State.UnstuckThinking) {
      if (this.thinkTimer.isDone()) {
        // When tank is done thinking, he can either fire in his current
        // direction or rotate and move to another direction. First, find out
        // if he wants to fire.
        if (this.state === State.Thinking && this.shouldFireWhenStuck()) {
          this.log.debug('I am done thinking. I want to fire!');
          this.state = State.Firing;
          return;
        }

        // Otherwise, we pick some new random direction
        this.state = State.Moving;
        const nextRotation = this.getNextRotation(tank);
        this.log.debug('I am done thinking. Rotating %s', nextRotation);
        tank.rotate(nextRotation);
        return;
      }
      this.thinkTimer.update(updateArgs.deltaTime);
      return;
    }

    tank.move(updateArgs.deltaTime);

    // Position might come as floats, but we need precise ints in here to
    // check if positions is exactly the same
    const tankPosition = tank.position.clone().round();

    // If tank can no longer move it his direction, he has to decide what to do
    // next.
    const isStuck =
      this.lastPosition.equals(tankPosition) && this.state === State.Moving;

    if (isStuck) {
      this.log.debug('I am stuck. Thinking...');
      this.state = State.Thinking;
      this.thinkTimer.reset(THINK_DURATION);
      return;
    }

    // If tank is not stuck and can still move in his direction, there is a
    // chance that he will do something instead of just moving forward
    if (this.shouldThinkWhenUnstuck(tank)) {
      this.log.debug('I changed my mind all of a sudden. Thinking...');
      this.state = State.UnstuckThinking;
      this.thinkTimer.reset(THINK_DURATION);
      return;
    }

    this.lastPosition = tankPosition;
  }

  private attemptFire(): void {
    // Convert seconds to milliseconds to use random integer func
    const min = FIRE_MIN_DELAY * 1000;
    const max = FIRE_MAX_DELAY * 1000;

    const delay = RandomUtils.number(min, max) / 1000;

    this.log.debug('I will try to fire in %f seconds', delay);
    this.fireTimer.reset(delay);
  }

  private shouldThinkWhenUnstuck(tank: Tank): boolean {
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

  private shouldFireWhenStuck(): boolean {
    const shouldFire = RandomUtils.probability(STUCK_FIRE_CHANCE);

    return shouldFire;
  }

  private getNextRotation(tank: Tank): Rotation {
    const shouldRotateTowardsBase = RandomUtils.probability(
      ROTATE_TOWARDS_BASE_CHANCE,
    );

    if (shouldRotateTowardsBase) {
      this.log.debug('I want to go towards base');
      return this.getRotationTowardsBase(tank);
    }

    return this.getRandomRotation();
  }

  private getRandomRotation(): Rotation {
    return RandomUtils.arrayElement(ROTATIONS);
  }

  private getRandomRotationExcept(prevRotation: Rotation): Rotation {
    const rotations = ROTATIONS.slice();

    // Remove prev rotation from possible outcomes
    const prevIndex = rotations.indexOf(prevRotation);
    rotations.splice(prevIndex, 1);

    return RandomUtils.arrayElement(rotations);
  }

  private getRotationTowardsBase(tank: Tank): Rotation {
    const basePosition = new Vector(
      config.BASE_DEFAULT_POSITION.x,
      config.BASE_DEFAULT_POSITION.y,
    );
    const tankPosition = tank.position;

    const direction = basePosition
      .clone()
      .sub(tankPosition)
      .normalize();

    const maxValue = Math.max(direction.x, direction.y);

    if (Math.abs(direction.x) === Math.abs(maxValue)) {
      if (direction.x > 0) {
        return Rotation.Right;
      }
      if (direction.x < 0) {
        return Rotation.Left;
      }
    }

    return Rotation.Down;
  }
}
