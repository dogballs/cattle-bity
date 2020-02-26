import {
  GameObject,
  GameObjectUpdateArgs,
  KeyboardInput,
  KeyboardKey,
  Timer,
} from '../core';
import { SpriteTextNode } from './SpriteTextNode';

// TODO: turbo button throttle is faster
const INPUT_THROTTLE = 7;

export class LevelSelector extends GameObject {
  private level = 1;
  private minLevel = 1;
  private maxLevel = 1;
  private text = new SpriteTextNode('primary', '', { scale: 4 });
  private throttle = new Timer();

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
    this.throttleInput(input, KeyboardKey.W, this.selectPrev);
    this.throttleInput(input, KeyboardKey.S, this.selectNext);
  }

  private throttleInput(
    input: KeyboardInput,
    key: KeyboardKey,
    selectCallback: () => void,
  ): void {
    if (input.isDown(key) || input.isUp(key)) {
      this.throttle.stop();
    }

    if (input.isHold(key)) {
      if (this.throttle.isDone()) {
        selectCallback();
        this.throttle.reset(INPUT_THROTTLE);
      }
      this.throttle.tick();
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
