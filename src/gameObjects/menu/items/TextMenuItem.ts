import { SpriteText } from '../../SpriteText';

import { MenuItem } from '../MenuItem';

export class TextMenuItem extends SpriteText implements MenuItem {
  public updateFocused(): void {
    // Do nothing
  }

  public updateUnfocused(): void {
    // Do nothing
  }
}
