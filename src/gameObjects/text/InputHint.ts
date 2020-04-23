import { Timer } from '../../core';
import { GameUpdateArgs } from '../../game';
import * as config from '../../config';

import { SpriteText } from './SpriteText';

const BLINK_DELAY = 0.4;

export class InputHint extends SpriteText {
  public zIndex = config.LEVEL_TITLE_Z_INDEX;
  private blinkTimer = new Timer();

  constructor(text: string) {
    super(text, {
      color: config.COLOR_BLACK,
      opacity: 0.1,
    });

    this.origin.set(0.5, 0.5);
    this.updateMatrix();
    this.setCenterX(config.CANVAS_WIDTH / 2);
    this.position.setY(840);
  }

  protected update({ deltaTime }: GameUpdateArgs): void {
    this.blinkTimer.update(deltaTime);

    if (this.blinkTimer.isDone()) {
      this.dirtyPaintBox();
      this.setVisible(!this.getVisible());
      this.blinkTimer.reset(BLINK_DELAY);
    }
  }
}
