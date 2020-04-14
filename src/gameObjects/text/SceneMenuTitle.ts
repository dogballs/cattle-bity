import * as config from '../../config';

import { SpriteText } from './SpriteText';

// Pre-positioned to be used in "menu" scenes, so all have same position
// and style
export class SceneMenuTitle extends SpriteText {
  constructor(text: string) {
    super(text, { color: config.COLOR_YELLOW });

    this.position.set(
      config.MENU_TITLE_DEFAULT_POSITION.x,
      config.MENU_TITLE_DEFAULT_POSITION.y,
    );
  }
}
