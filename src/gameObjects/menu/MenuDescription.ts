import { GameObject, RectPainter } from '../../core';
import * as config from '../../config';

import { SpriteText } from '../text';

export class MenuDescription extends GameObject {
  public painter = new RectPainter(config.COLOR_GRAY, config.COLOR_YELLOW);
  private text: SpriteText;
  private message: string;

  constructor(message = '') {
    super(992, 110);

    this.message = message;
  }

  protected setup(): void {
    this.text = new SpriteText(this.message, { color: config.COLOR_BLACK });
    this.text.position.set(16, 16);
    this.add(this.text);
  }
}
