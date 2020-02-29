import {
  GameObject,
  GameObjectUpdateArgs,
  Input,
  Subject,
  Timer,
} from '../core';
import { InputControl } from '../input';

import { SpriteText } from './SpriteText';

const SLOW_HOLD_DELAY = 7;
const FAST_HOLD_DELAY = 1;

export class LevelSelector extends GameObject {
  public selected = new Subject<number>();
  private level = 1;
  private minLevel = 1;
  private maxLevel = 1;
  private text = new SpriteText('');
  private holdThrottle = new Timer();

  constructor(minLevel = 1, maxLevel = 1) {
    super();

    this.minLevel = minLevel;
    this.maxLevel = maxLevel;
  }

  protected setup(): void {
    this.text.pivot.set(0.5, 0.5);
    this.add(this.text);
    this.updateText();
  }

  protected update({ input }: GameObjectUpdateArgs): void {
    if (input.isDown(InputControl.Start)) {
      this.selected.notify(this.level);
      return;
    }

    this.throttleInput(input, InputControl.A, this.selectNext, SLOW_HOLD_DELAY);
    this.throttleInput(input, InputControl.B, this.selectPrev, SLOW_HOLD_DELAY);
    this.throttleInput(
      input,
      InputControl.TurboA,
      this.selectNext,
      FAST_HOLD_DELAY,
    );
    this.throttleInput(
      input,
      InputControl.TurboB,
      this.selectPrev,
      FAST_HOLD_DELAY,
    );
  }

  private throttleInput(
    input: Input,
    control: InputControl,
    selectCallback: () => void,
    delay: number,
  ): void {
    if (input.isDown(control) || input.isUp(control)) {
      this.holdThrottle.stop();
    }

    if (input.isHoldFirst(control)) {
      if (this.holdThrottle.isDone()) {
        selectCallback();
        this.holdThrottle.reset(delay);
      }
      this.holdThrottle.tick();
    }
  }

  private selectNext = (): void => {
    const nextLevel = this.level + 1;
    if (nextLevel > this.maxLevel) {
      return;
    }
    this.level = nextLevel;
    this.updateText();
  };

  private selectPrev = (): void => {
    const nextLevel = this.level - 1;
    if (nextLevel < this.minLevel) {
      return;
    }
    this.level = nextLevel;
    this.updateText();
  };

  private updateText(): void {
    this.text.setText(this.getLevelText());
  }

  private getLevelText(): string {
    const numberText = this.level.toString().padStart(2, ' ');
    const levelText = `STAGE ${numberText}`;
    return levelText;
  }
}
