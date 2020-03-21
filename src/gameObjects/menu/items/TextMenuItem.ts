import { SpriteText, SpriteTextOptions } from '../../SpriteText';

import { MenuItem } from '../MenuItem';

export class TextMenuItem extends MenuItem {
  private text: SpriteText;

  constructor(text = '', options: SpriteTextOptions = {}) {
    super();

    this.text = new SpriteText(text, options);
  }

  public setText(text: string): void {
    this.text.setText(text);
  }

  protected setup(): void {
    this.size.copyFrom(this.text.size);
    this.add(this.text);
  }
}
