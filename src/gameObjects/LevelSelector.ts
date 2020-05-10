import { GameObject, Subject } from '../core';
import { GameUpdateArgs } from '../game';
import { InputHoldThrottle, LevelSelectionInputContext } from '../input';
import * as config from '../config';

import { LevelTitle, SpriteText } from './text';

const SLOW_HOLD_DELAY = 0.12;
const FAST_HOLD_DELAY = 0.016;

export class LevelSelector extends GameObject {
  public selected = new Subject<number>();
  public zIndex = config.LEVEL_TITLE_Z_INDEX;
  private currentLevel = 1;
  private minLevel = 1;
  private maxLevel: number;
  private isPlaytest: boolean;
  private title: LevelTitle;
  private arrowLeft: SpriteText;
  private arrowRight: SpriteText;
  private holdThrottles: InputHoldThrottle[] = [];

  constructor(maxLevel = 1, isPlaytest = false) {
    super();

    this.maxLevel = maxLevel;
    this.isPlaytest = isPlaytest;

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
    this.title = new LevelTitle(0, this.isPlaytest);
    this.title.origin.set(0.5, 0.5);
    this.title.updateMatrix();
    this.add(this.title);
    this.updateText();

    this.arrowLeft = new SpriteText('←', {
      color: config.COLOR_BLACK,
      opacity: 0.1,
    });
    this.arrowLeft.origin.setY(0.5);
    this.arrowLeft.position.setX(-200);
    this.add(this.arrowLeft);

    this.arrowRight = new SpriteText('→', {
      color: config.COLOR_BLACK,
      opacity: 0.1,
    });
    this.arrowRight.origin.setY(0.5);
    this.arrowRight.position.setX(180);
    this.add(this.arrowRight);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { deltaTime, inputManager } = updateArgs;

    const inputVariant = inputManager.getActiveVariant();

    if (inputVariant.isDownAny(LevelSelectionInputContext.Select)) {
      this.selected.notify(this.currentLevel);
      return;
    }

    for (const holdThrottle of this.holdThrottles) {
      holdThrottle.update(inputVariant, deltaTime);
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
