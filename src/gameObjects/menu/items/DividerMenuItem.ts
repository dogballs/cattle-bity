import { SpriteTextOptions } from '../../SpriteText';

import { TextMenuItem } from './TextMenuItem';

export class DividerMenuItem extends TextMenuItem {
  public focusable = false;

  constructor(options: SpriteTextOptions = {}) {
    super('-', options);
  }
}
