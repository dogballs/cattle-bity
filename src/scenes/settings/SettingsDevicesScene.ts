import { SceneMenu, SceneMenuTitle, TextMenuItem } from '../../gameObjects';

import { GameScene } from '../GameScene';

export class SettingsDevicesScene extends GameScene {
  private title: SceneMenuTitle;
  private backItem: TextMenuItem;
  private menu: SceneMenu;

  protected setup(): void {
    this.title = new SceneMenuTitle('SETTINGS → PLAYER INPUTS');
    this.root.add(this.title);

    this.backItem = new TextMenuItem('BACK');
    this.backItem.selected.addListener(this.handleBackSelected);

    const menuItems = [this.backItem];

    this.menu = new SceneMenu();
    this.menu.setItems(menuItems);
    this.root.add(this.menu);
  }

  private handleBackSelected = (): void => {
    this.navigator.back();
  };
}
