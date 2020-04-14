import { GameObject, Subject } from '../core';
import { GameUpdateArgs } from '../game';
import { InputHoldThrottle, LevelSelectionInputContext } from '../input';

import { LevelTitle } from './text';

const SLOW_HOLD_DELAY = 0.12;
const FAST_HOLD_DELAY = 0.016;

export class LevelSelector extends GameObject {
  public selected = new Subject<number>();
  private currentLevel = 1;
  private minLevel = 1;
  private maxLevel: number;
  private title = new LevelTitle();
  private holdThrottles: InputHoldThrottle[] = [];

  constructor(maxLevel = 1) {
    super();

    this.maxLevel = maxLevel;

    this.holdThrottles = [
      new InputHoldThrottle(LevelSelectionInputContext.Next, this.selectNext, {
        delay: SLOW_HOLD_DELAY,
      }),
      new InputHoldThrottle(LevelSelectionInputContext.Prev, this.selectPrev, {
        delay: SLOW_HOLD_DELAY,
      }),
      new InputHoldThrottle(
        LevelSelectionInputContext.FastNext,
        this.selectNext,
        { delay: FAST_HOLD_DELAY },
      ),
      new InputHoldThrottle(
        LevelSelectionInputContext.FastPrev,
        this.selectPrev,
        { delay: FAST_HOLD_DELAY },
      ),
    ];
  }

  protected setup(): void {
    this.title.origin.set(0.5, 0.5);
    this.add(this.title);
    this.updateText();
  }

  protected update({ deltaTime, input }: GameUpdateArgs): void {
    if (input.isDownAny(LevelSelectionInputContext.Select)) {
      this.selected.notify(this.currentLevel);
      return;
    }

    for (const holdThrottle of this.holdThrottles) {
      holdThrottle.update(input, deltaTime);
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
