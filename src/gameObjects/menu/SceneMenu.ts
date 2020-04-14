import * as config from '../../config';

import { Menu } from './Menu';

// Pre-positioned to be used in "menu" scenes, so all menus have same position
export class SceneMenu extends Menu {
  constructor() {
    super();

    this.position.set(
      config.MENU_DEFAULT_POSITION.x,
      config.MENU_DEFAULT_POSITION.y,
    );
  }
}
