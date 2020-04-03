import { SpriteText, SpriteTextOptions } from '../../SpriteText';
import * as config from '../../../config';

import { MenuItem } from '../MenuItem';

export interface TextMenuItemOptions extends SpriteTextOptions {
  unfocusableColor?: string;
}

const DEFAULT_OPTIONS: TextMenuItemOptions = {
  color: config.COLOR_WHITE,
  unfocusableColor: config.COLOR_GRAY,
};

export class TextMenuItem extends MenuItem {
  private text: SpriteText;
  private options: TextMenuItemOptions;

  constructor(text = '', options: TextMenuItemOptions = {}) {
    super();

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);

    this.text = new SpriteText(text, this.options);
  }

  public setText(text: string): void {
    this.text.setText(text);
  }

  protected setup(): void {
    this.size.copyFrom(this.text.size);
    this.add(this.text);
  }

  protected update(): void {
    if (this.focusable) {
      this.text.setColor(this.options.color);
    } else {
      this.text.setColor(this.options.unfocusableColor);
    }
  }
}
