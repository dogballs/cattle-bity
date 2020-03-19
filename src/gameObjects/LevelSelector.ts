import { GameObject, Input, Subject, Timer } from '../core';
import { GameObjectUpdateArgs } from '../game';
import { InputControl, LevelSelectionInputContext } from '../input';

import { LevelTitle } from './LevelTitle';

const SLOW_HOLD_DELAY = 0.12;
const FAST_HOLD_DELAY = 0.016;

export class LevelSelector extends GameObject {
  public selected = new Subject<number>();
  private currentLevel = 1;
  private minLevel = 1;
  private maxLevel: number;
  private title = new LevelTitle();
  private holdThrottle = new Timer();

  constructor(maxLevel = 1) {
    super();

    this.maxLevel = maxLevel;
  }

  protected setup(): void {
    this.title.origin.set(0.5, 0.5);
    this.add(this.title);
    this.updateText();
  }

  protected update({ deltaTime, input }: GameObjectUpdateArgs): void {
    if (input.isDownAny(LevelSelectionInputContext.Select)) {
      this.selected.notify(this.currentLevel);
      return;
    }

    this.throttleInput(
      input,
      deltaTime,
      LevelSelectionInputContext.Next,
      this.selectNext,
      SLOW_HOLD_DELAY,
    );
    this.throttleInput(
      input,
      deltaTime,
      LevelSelectionInputContext.Prev,
      this.selectPrev,
      SLOW_HOLD_DELAY,
    );
    this.throttleInput(
      input,
      deltaTime,
      LevelSelectionInputContext.FastNext,
      this.selectNext,
      FAST_HOLD_DELAY,
    );
    this.throttleInput(
      input,
      deltaTime,
      LevelSelectionInputContext.FastPrev,
      this.selectPrev,
      FAST_HOLD_DELAY,
    );
  }

  private throttleInput(
    input: Input,
    deltaTime: number,
    controls: InputControl[],
    selectCallback: () => void,
    delay: number,
  ): void {
    if (input.isDownAny(controls) || input.isUpAny(controls)) {
      this.holdThrottle.stop();
    }

    if (input.isHoldFirstAny(controls)) {
      if (this.holdThrottle.isDone()) {
        selectCallback();
        this.holdThrottle.reset(delay);
      }
      this.holdThrottle.update(deltaTime);
    }
  }

  private selectNext = (): void => {
    const nextLevel = this.currentLevel + 1;
    if (nextLevel > this.maxLevel) {
      return;
    }
    this.currentLevel = nextLevel;
    this.updateText();
  };

  private selectPrev = (): void => {
    const nextLevel = this.currentLevel - 1;
    if (nextLevel < this.minLevel) {
      return;
    }
    this.currentLevel = nextLevel;
    this.updateText();
  };

  private updateText(): void {
    this.title.setLevelNumber(this.currentLevel);
  }
}
